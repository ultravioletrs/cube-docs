# Getting Started

Before logging in or interacting with Cube AI, you need to make sure that Cube AI has been deployed and is running. Deployment can be done by the instance administrator or by you if you have the necessary access permissions.

### Steps to Connect

1. Ensure that Cube AI is deployed and running on your instance.
2. Connect to the deployed Cube AI instance on port `6193` using your login credentials (username and password).
3. If you are unable to log in, contact the administrator of the instance and request that they create a new user account for you.

## Create a new user

If you are the administrator, follow [this demonstration](https://jam.dev/c/f8d3fa47-7505-4201-b8ca-c0f724826237) to learn how to create a new user. Below are the summarized steps:

1. Log in with admin credentials
2. Create a new domain (if needed)
3. Login to the newly created domain (or already existing domain)
4. Click profile icon and navigate to `Manage Users`
5. Click create
6. Fill in the form
7. Click `Create`
8. Share the login credentials (username and password) with the new user

## Login

Once the administrator creates your account and shares your login details, use the credentials to log in to Cube AI and obtain an authentication token as shown below.

```bash
curl -ksSiX POST https://<cube-ai-instance>/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "identity": "<your_email>",
  "secret": "<your_password>"
}
EOF
```

Be sure to replace `<your_email>` and `<your_password>` with your actual login details. You'll receive a response similar to this:

```bash
HTTP/2 201
content-type: application/json
date: Wed, 18 Sep 2024 11:13:48 GMT
x-frame-options: DENY
x-xss-protection: 1; mode=block
content-length: 591

{"access_token":"<access_token>","refresh_token":"<refresh_token>"}
```

The `access_token` field in the response is your API token, which will be used for authentication in future API calls. The `refresh_token` field is a token you can use to obtain a new access token once the current one expires.

## VS Code Setup

1. Download and install [VS Code](https://code.visualstudio.com/).
2. In VS Code, download and install the [Continue extension](https://www.continue.dev/). This extension connects Cube AI models to your coding environment for assistance.
3. Open the Continue extension, click the settings icon (`Configure Continue`), and open the `.continue/config.json` file (alternatively, you can navigate to the `.continue` folder in your project’s root directory via File Explorer or press `Ctrl+Shift+P` and type "Continue: Open config.json" in the Command Palette).
4. Edit the `.continue/config.json` file to look like this:

```json
{
  "models": [
    {
      "title": "Ollama",
      "provider": "ollama",
      "model": "llama3:8b",
      "apiKey": "<access_token>",
      "apiBase": "<cube-ai-instance>/ollama"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Starcoder 2 3b",
    "provider": "ollama",
    "model": "starcoder2:3b",
    "apiKey": "<access_token>",
    "apiBase": "<cube-ai-instance>/ollama"
  },
  "embeddingsProvider": {
    "provider": "ollama",
    "model": "nomic-embed-text",
    "apiKey": "<access_token>",
    "apiBase": "<cube-ai-instance>/ollama"
  },
  "requestOptions": {
    "verifySsl": false
  }
}
```

For a more detailed explanation of how to connect to Cube AI with the continue extension, check out [this video demonstration](https://www.youtube.com/watch?v=BGpv_iTB2NE).
