# Getting Started

Before logging in or interacting with Cube AI, ensure that Cube AI has been properly deployed and is running. Deployment can be performed by the instance administrator or by you, provided you have the necessary access permissions. For a detailed guide on how to deploy Cube AI, refer to the [developer guide](https://github.com/ultravioletrs/cube-docs/blob/main/docs/developer-guide.md).

Therefore, to connect:

1. Ensure that Cube AI is deployed and running on your instance.
2. Connect to the deployed Cube AI instance on port `6193` using your login credentials (username and password).

Port `6193` is the default port for accessing Cube AI deployment. It is configurable through the `docker/.env` file, meaning you can change it to any port that suits your deployment needs as described in the [developer guide](https://github.com/ultravioletrs/cube-docs/blob/main/docs/developer-guide.md).

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
  "identity": "<your_email>",
  "secret": "<your_password>"
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

### Steps for Setting Up:

1. **Download and install** [Visual Studio Code (VS Code)](https://code.visualstudio.com/).
2. In VS Code, **download and install** the [Continue extension](https://www.continue.dev/), which connects Cube AI models to your development environment for enhanced coding assistance.
3. **Open the Continue extension** by clicking the settings icon (gear icon), then select **`Configure Continue`**. This will open the `.continue/config.json` file. Alternatively:
   - You can navigate to the `.continue` folder in your project’s root directory using File Explorer.
   - Press `Ctrl+Shift+P` to open the Command Palette and search for **"Continue: Open config.json"**.
4. **Edit** the `.continue/config.json` file to include the following configuration:

```json
{
  "models": [
    {
      "title": "tinyllama",
      "provider": "ollama",
      "model": "tinyllama:1.1b",
      "apiKey": "<access_token>",
      "apiBase": "http://<your-ollama-instance>/ollama"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Starcoder 2 3b",
    "provider": "ollama",
    "model": "starcoder2:7b",
    "apiKey": "<access_token>",
    "apiBase": "http://<your-ollama-instance>/ollama"
  },
  "embeddingsProvider": {
    "provider": "ollama",
    "model": "nomic-embed-text",
    "apiKey": "<access_token>",
    "apiBase": "http://<your-ollama-instance>/ollama"
  },
  "requestOptions": {
    "verifySsl": false
  },
  "customCommands": [
    {
      "name": "test",
      "prompt": "{{{ input }}}\n\nWrite a comprehensive set of unit tests for the selected code. It should setup, run tests that check for correctness including important edge cases, and teardown. Ensure that the tests are complete and sophisticated. Give the tests just as chat output, don't edit any file.",
      "description": "Write unit tests for highlighted code"
    }
  ],
  "contextProviders": [
    {
      "name": "code",
      "params": {}
    },
    {
      "name": "docs",
      "params": {}
    },
    {
      "name": "diff",
      "params": {}
    },
    {
      "name": "terminal",
      "params": {}
    },
    {
      "name": "problems",
      "params": {}
    },
    {
      "name": "folder",
      "params": {}
    },
    {
      "name": "codebase",
      "params": {}
    }
  ],
  "slashCommands": [
    {
      "name": "edit",
      "description": "Edit selected code"
    },
    {
      "name": "comment",
      "description": "Write comments for the selected code"
    },
    {
      "name": "share",
      "description": "Export the current chat session to markdown"
    },
    {
      "name": "cmd",
      "description": "Generate a shell command"
    },
    {
      "name": "commit",
      "description": "Generate a git commit message"
    }
  ]
}
```

Update the `apiKey` with your `access token` and the `apiBase` with the URL of your Cube AI instance (if different from the default one). These values should reflect the actual deployment settings you're working with.

For a more detailed explanation of how to connect to Cube AI with the continue extension, check out [this video demonstration](https://www.youtube.com/watch?v=BGpv_iTB2NE).
