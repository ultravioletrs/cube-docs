# Using OpenCode with Cube AI

This guide explains how to configure [OpenCode](https://opencode.ai) to work with your Cube AI instance. OpenCode is an AI-powered code editor that can leverage the models hosted on your Cube AI platform.

## Prerequisites

- A running Cube AI instance.
- OpenCode installed on your local machine.
- An active Cube AI user account and authentication token.

## Configuration

To connect OpenCode to Cube AI, you need to configure it to use the OpenAI-compatible API provided by the Cube AI proxy.

### 1. Get your Authentication Token

If you haven't already, obtain your JWT token from the Cube AI instance:

```bash
curl -ksSiX POST https://<cube-ai-instance>/users/tokens/issue \
  -H "Content-Type: application/json" \
  -d '{
    "username": "<your_email>",
    "password": "<your_password>"
  }'
```

Copy the `access_token` from the response.

### 2. Pulling Models

Before configuring OpenCode, ensure you have the appropriate models available in your Cube AI instance. For coding tasks, the `qwen2.5-coder` models are highly recommended.

You can pull models using the Cube AI proxy API. You will need your authentication token and domain ID for this. Replace `<your_domain_id>` with the domain ID obtained from the Cube AI UI or created via the API (see the [Getting Started Guide](getting-started.md#quick-start)).

```bash
# Pull Qwen 2.5 Coder 7B (Recommended)
curl -k -X POST https://<cube-ai-instance>/proxy/<your_domain_id>/api/pull \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "name": "qwen2.5-coder:7b-instruct-q4_K_M"
  }'
```

Other recommended models:
- `qwen2.5-coder:3b` (Faster)
- `deepseek-coder:6.7b-instruct-q4_K_M`

### 3. Verify Pulled Models

You can verify that the models have been pulled by listing them:

```bash
# List available models
curl -k https://<cube-ai-instance>/proxy/<your_domain_id>/v1/models \
  -H "Authorization: Bearer <your_access_token>"
```

### 4. Increasing Context Window for Tool Support

Opencode requires larger context windows for tool functionality. Let's configure it to use a larger context window.

```bash
# First, load the model
curl -k -X POST https://<cube-ai-instance>/proxy/<your_domain_id>/api/generate \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "model": "qwen2.5-coder:7b-instruct-q4_K_M",
    "prompt": "test",
    "stream": false
}'

# Create a new model with increased context window
curl -k -X POST https://<cube-ai-instance>/proxy/<your_domain_id>/api/create \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "name": "qwen2.5-coder:7b-16k",
  "modelfile": "FROM qwen2.5-coder:7b-instruct-q4_K_M\nPARAMETER num_ctx 16384"
  }'
```

### 4. Verify Context Window Increase

```bash
# Check model info
curl -k https://<cube-ai-instance>/proxy/<your_domain_id>/api/show \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{"name": "qwen2.5-coder:7b-16k"}'
```

### 5. Install OpenCode

You can install OpenCode from [here](https://opencode.ai/docs#install).

### 6. Configure OpenCode

You can configure OpenCode by editing the `~/.config/opencode/opencode.json` file. Create the file if it doesn't exist.

Add the following configuration, replacing `<cube-ai-instance>` with your instance's address, `<your_access_token>` with the token you obtained, and `<your_domain_id>` with your domain ID:

```json
{
    "$schema": "https://opencode.ai/config.json",
    "model": "cube/qwen2.5-coder:7b-16k",
    "provider": {
        "cube": {
            "npm": "@ai-sdk/openai-compatible",
            "name": "Cube AI",
            "options": {
                "baseURL": "http://<cube-ai-instance>/proxy/<your_domain_id>/v1",
                "apiKey": "<your_access_token>"
            },
            "models": {
                "qwen2.5-coder:7b-16k": {
                    "name": "Qwen 2.5 Coder 7B (16K) - Main",
                    "tool_call": false,
                    "reasoning": false
                },
            },
        }
    }
}
```

### 3. Verify Connection

1. Open OpenCode.
2. Run `opencode /models` to see if the Cube AI models are listed.

![OpenCode models](./img/opencode-models.png)

3. Select a model (e.g., `cube/qwen2.5-coder:7b-16k`).
4. Try a simple prompt to verify the connection.

![OpenCode example addition](./img/opencode-example.png)

## Supported Features

- **Code Generation**: Use models like `qwen2.5-coder:7b-16k` for code completion and generation.
- **Chat**: Interact with models for general questions and assistance.
- **Tools**: If the model supports it (like `qwen2.5-coder:7b-16k` in the example), you can enable tools for file operations and command execution.

## Troubleshooting

- **Connection Refused**: Ensure your Cube AI instance is running and accessible from your machine.
- **Authentication Error**: Verify your JWT token is valid and correctly placed in the `Authorization` header.
- **Certificate Errors**: If using self-signed certificates, ensure `rejectUnauthorized` is set to `false` in the `tls` options.
