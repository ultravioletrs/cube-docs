# Developer Guide

Connect to Cube AI deployed instance of port `:6193`. Login with you username and password. If you can't ask the instance adminisrator to create a new user, you can create a new user.

## Create a new user

[This is a demonstration of how to create a new user](https://jam.dev/c/f8d3fa47-7505-4201-b8ca-c0f724826237). You can use the same steps to create a new user.

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
curl -ksSiX POST https://162.243.173.49/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "identity": "admin@example.com",
  "secret": "m2N2Lfno"
}
EOF
```

The response will look something like this:

```bash
HTTP/2 201
content-type: application/json
date: Wed, 18 Sep 2024 11:13:48 GMT
x-frame-options: DENY
x-xss-protection: 1; mode=block
content-length: 591

{"access_token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjY2NjE2MjgsImlhdCI6MTcyNjY1ODAyOCwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwidHlwZSI6MCwidXNlciI6IjY1OGU0NGI5LTlkNGYtNDRjMi05Y2ZmLWE0OTVhZTg2YmU5ZSJ9.zvEm-z166e_gOekc47qCKVIGLSR8J1SrXjU3x9mqsGTynnrDMVul09mzuY3aXxijnmxm5brHKSw7gCwzTAGniQ","refresh_token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjY3NDQ0MjgsImlhdCI6MTcyNjY1ODAyOCwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjY1OGU0NGI5LTlkNGYtNDRjMi05Y2ZmLWE0OTVhZTg2YmU5ZSJ9.mqvZpNKmN_p_NnoJ9jCnZobVov1ZM4AmL9cMI3VFJWYzeIpYg2QBB4jrtBq4SHGIm_hH3AhPZNgQAIfUFSb_kg"}
```

The access token is the `access_token` field in the response will be used to authenticate with the API.

## VS Code Setup

1. Download and intall [VS Code](https://code.visualstudio.com/)
2. In VS Code download and install the [continue extention](https://www.continue.dev/). This extenstion will help us connect with the Cube AI running models and use them as coding assistance.
3. Open tthe continue extension and click the setting icon `Configure Continue`. This will open the `.continue/config.json` file.
4. Edit the `config.json` file to look something like this:

```json
{
  "models": [
    {
      "title": "Ollama",
      "provider": "ollama",
      "model": "llama3:8b",
      "apiKey": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjY2NjY2NDksImlhdCI6MTcyNjY2MzA0OSwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwidHlwZSI6MCwidXNlciI6Ijg1NWMwMWQwLWQ3M2YtNGFlNS1iN2QzLTRjNmU2ZTc1YzU0NyJ9.o6tL1fXPaiLldLk6ntVff-8IKGLvuondTLLxerHsZWjvfnoFq72jU7rFGXbZDBhZUzs3yjIJ8emn02Q9Zr4TOg",
      "apiBase": "http://157.245.247.202/ollama"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Starcoder 2 3b",
    "provider": "ollama",
    "model": "starcoder2:3b",
    "apiKey": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjY2NjY2NDksImlhdCI6MTcyNjY2MzA0OSwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwidHlwZSI6MCwidXNlciI6Ijg1NWMwMWQwLWQ3M2YtNGFlNS1iN2QzLTRjNmU2ZTc1YzU0NyJ9.o6tL1fXPaiLldLk6ntVff-8IKGLvuondTLLxerHsZWjvfnoFq72jU7rFGXbZDBhZUzs3yjIJ8emn02Q9Zr4TOg",
    "apiBase": "http://157.245.247.202/ollama"
  },
  "embeddingsProvider": {
    "provider": "ollama",
    "model": "nomic-embed-text",
    "apiKey": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjY2NjY2NDksImlhdCI6MTcyNjY2MzA0OSwiaXNzIjoibWFnaXN0cmFsYS5hdXRoIiwidHlwZSI6MCwidXNlciI6Ijg1NWMwMWQwLWQ3M2YtNGFlNS1iN2QzLTRjNmU2ZTc1YzU0NyJ9.o6tL1fXPaiLldLk6ntVff-8IKGLvuondTLLxerHsZWjvfnoFq72jU7rFGXbZDBhZUzs3yjIJ8emn02Q9Zr4TOg",
    "apiBase": "http://157.245.247.202/ollama"
  },
  "requestOptions": {
    "verifySsl": false
  }
}
```

This is a demonstration of how to connect to Cube AI with the continue extension.

<iframe width="560" height="315" src="https://www.youtube.com/embed/BGpv_iTB2NE?si=2qwUc4p99MYkSROK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
