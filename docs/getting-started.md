---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Prerequisites

- Docker and Docker Compose
- NVIDIA GPU with CUDA support (recommended for vLLM)
- Hardware with TEE support (AMD SEV-SNP or Intel TDX)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/ultravioletrs/cube.git
   cd cube
   ```

2. **Start Cube AI services**

   ```bash
   make up
   ```

3. **Configuration**
   Cube AI can be configured to use different backends. The default backend is Ollama.

   Ollama:
   `bash
    make up-ollama
    `

   vLLM:
   `bash
    make up-vllm
    `

4. **Get your authentication token**

   All API requests require authentication using JWT tokens. Once the services are running, obtain a JWT token:

   ```bash
   curl -ksSiX POST https://localhost/users/tokens/issue \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin@example.com",
       "password": "m2N2Lfno"
     }'
   ```

   The response will contain your JWT token:

   ```json
   {
     "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
     "refresh_token": "..."
   }
   ```

5. **Create a domain**

   All API requests require a domain ID in the URL path. You can either get the domain ID from the UI or create a new domain via the API:

   ```bash
   curl -sSiX POST http://localhost:9003/domains \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -d '{
       "name": "Magistrala",
       "route": "magistrala",
       "tags": ["absmach", "IoT"],
       "metadata": {
         "region": "EU"
       }
     }'
   ```

   The response will contain your domain information including the `id`:

   ```json
   {
     "id": "d7f9b3b8-4f7e-4f44-8d47-1a6e5e6f7a2b",
     "name": "Magistrala",
     "route": "magistrala",
     "tags": ["absmach", "IoT"],
     "metadata": {
       "region": "EU"
     },
     "status": "enabled",
     "created_by": "c8c3e4f1-56b2-4a22-8e5f-8a77b1f9b2f4",
     "created_at": "2025-10-29T14:12:01Z",
     "updated_at": "2025-10-29T14:12:01Z"
   }
   ```

   **Notes:**
   - `name` and `route` are required fields
   - `route` must be unique and cannot be changed after creation
   - `metadata` must be a valid JSON object
   - The `id` is automatically generated if not provided
   - Save the `id` value as you'll need it for all subsequent API requests

6. **Verify the installation**

   List available models (replace `YOUR_DOMAIN_ID` with the domain ID from step 4):

   ```bash
   curl -k https://localhost/proxy/YOUR_DOMAIN_ID/api/tags \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

7. **Make your first AI request**

   Replace `YOUR_DOMAIN_ID` with your actual domain ID:

   ```bash
   curl -k https://localhost/proxy/YOUR_DOMAIN_ID/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -d '{
       "model": "tinyllama:1.1b",
       "messages": [
         {
           "role": "user",
           "content": "Hello! How can you help me today?"
         }
       ]
     }'
   ```

## Usage Guide

The following sections describe how to manage users and integrate with development tools.

## Administrator and User Accounts

### Administrator Access

If you are the instance administrator, you do not need to create a separate account for yourself. The platform is preconfigured with an administrator account that you can log into directly using your admin credentials. As the administrator, you can also generate authentication tokens for API access. Non-admin users, however, will need accounts created for them by the administrator.

### Creating a New User Account

As an administrator, you have the ability to create accounts for non-admin users and grant them access to Cube AI. Follow [this demonstration](https://jam.dev/c/f8d3fa47-7505-4201-b8ca-c0f724826237) to see the process in action. Here’s a summary of the steps:

1. **Log in** using your **administrator credentials**.
2. **Create a new domain** (if one is needed).
3. **Log in** to the newly created domain (or an existing domain).
4. Click on your **profile icon** and select **`Manage Users`**.
5. Click **`Create`** to start creating a new user.
6. Fill out the user details in the form.
7. Click **`Create`** to finalize the user creation.
8. **Share** the username and password with the newly created user so they can log in.

### Non-Admin User Login

Once the administrator has created your account and shared the login details with you, use those credentials to log in to Cube AI. After logging in, you can obtain an authentication token for API interactions as shown below:

```bash
curl -ksSiX POST https://<cube-ai-instance>/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "username": "<your_email>",
  "password": "<your_password>"
}
EOF
```

Replace `<your_email>` and `<your_password>` with the credentials provided by the administrator.

You will receive a response similar to the following:

```bash
HTTP/2 201
content-type: application/json
date: Wed, 18 Sep 2024 11:13:48 GMT
x-frame-options: DENY
x-xss-protection: 1; mode=block
content-length: 591

{"access_token":"<access_token>","refresh_token":"<refresh_token>"}
```

The `access_token` field contains your API token, which is required for making authenticated API calls. The `refresh_token` can be used to obtain a new access token when the current one expires.

## Setting Up VS Code for Cube AI Integration

To maximize Cube AI’s potential within your development environment, you’ll need to integrate it with Visual Studio Code (VS Code) using the **Continue extension**. This extension enables you to directly interact with LLMs in TEE inside VS Code, providing intelligent code completion, code suggestions, and contextual insights.

### Steps for Setting Up

1. **Download and install** [Visual Studio Code (VS Code)](https://code.visualstudio.com/).
2. In VS Code, **download and install** the [Continue extension](https://www.continue.dev/), which connects Cube AI models to your development environment for enhanced coding assistance.
3. **Open the Continue extension** by clicking the settings icon (gear icon), then select **`Configure Continue`**. This will open the `.continue/config.json` file. Alternatively:
   - You can navigate to the `.continue` folder in your project’s root directory using File Explorer.
   - Press `Ctrl+Shift+P` to open the Command Palette and search for **"Continue: Open config.json"**.
4. **Edit** the `.continue/config.json` file to include the following configuration:

```yml
name: Local Assistant
version: 1.0.0
schema: v1
models:
  - name: tinyllama
    provider: ollama
    model: tinyllama:1.1b
    apiKey: <access_token>
    apiBase: https://<your-cube-instance>/proxy/<your-domain-id>
    requestOptions:
      verifySsl: false
  - name: Starcoder 2 3b
    provider: ollama
    model: starcoder2:7b
    apiKey: <access_token>
    apiBase: https://<your-cube-instance>/proxy/<your-domain-id>
    requestOptions:
      verifySsl: false
  - name: Nomic Embed Text
    provider: ollama
    model: nomic-embed-text
    apiKey: <access_token>
    apiBase: https://<your-cube-instance>/proxy/<your-domain-id>
    requestOptions:
      verifySsl: false
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase
```

Update the `apiKey` with your `access token`, the `apiBase` with the URL of your Cube AI instance, and replace `<your-domain-id>` with the domain ID from step 4. These values should reflect the actual deployment settings you're working with.

For a more detailed explanation of how to connect to Cube AI with the continue extension, check out [this video demonstration](https://www.youtube.com/watch?v=BGpv_iTB2NE).
