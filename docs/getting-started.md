# Getting Started

Connect to Cube AI deployed instance on port `:6193`. Login with your username and password. If you can't log in ask the instance administrator to create a new user.

## Create a new user

Follow [this demonstration](https://jam.dev/c/f8d3fa47-7505-4201-b8ca-c0f724826237) to learn how to create a new user. Below are the summarized steps:

1. Admin login with their credentials
2. Create a new domain if there is none
3. Login to the new domain or already existing domain
4. Click profile icon and navigate to `Manage Users`
5. Click create
6. Fill in the form
7. Click `Create`

## Login

Get a token from using your login credentials.

```bash
curl -ksSiX POST https://<cube-ai-instance>/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "identity": "<your_email>",
  "secret": "<your_password>"
}
EOF
```

You'll receive a response similar to this:

```bash
HTTP/2 201
content-type: application/json
date: Wed, 18 Sep 2024 11:13:48 GMT
x-frame-options: DENY
x-xss-protection: 1; mode=block
content-length: 591

{"access_token":"<access_token>","refresh_token":"<refresh_token>"}
```

The `access_token` field in the response is your API token, which will be used for authentication in future API calls.

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

For a more detailed explanation of how to connect to Cube AI with the continue extension, check out [this video demonstration](https://www.youtube.com/embed/BGpv_iTB2NE?si=2qwUc4p99MYkSROK).

---
