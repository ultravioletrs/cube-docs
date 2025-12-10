---
id: continue
title: Continue for VS Code
sidebar_position: 1
---

# Continue Integration for VS Code

The **Continue** extension brings Cube AI’s LLM capabilities directly into Visual Studio Code, enabling inline completions, refactoring help, and chat-based assistance.

This guide shows how to connect Continue with a Cube AI domain.

---

## 1. Install Requirements

1. Install **Visual Studio Code**  
   https://code.visualstudio.com

2. Install the **Continue** extension  
   https://www.continue.dev

---

## 2. Open Continue Configuration

In VS Code:

1. Click the **Continue** icon  
2. Open the gear/settings menu  
3. Select **Configure Continue**

This opens:

```
.continue/config.json
```

---

## 3. Configure Continue to Use Cube AI

Replace the contents of `config.json` with:

Before editing the file, make sure you have generated your Cube AI access token.  
You can obtain it in the Cube AI UI under **Profile → Tokens**.

```json
{
  "name": "Cube AI",
  "version": "1.0.0",
  "schema": "v1",
  "models": [
    {
      "name": "tinyllama",
      "provider": "ollama",
      "model": "tinyllama:1.1b",
      "apiKey": "<access_token>",
      "apiBase": "https://<your-cube-instance>/proxy/<your-domain-id>",
      "requestOptions": {
        "verifySsl": false
      }
    },
    {
      "name": "starcoder2",
      "provider": "ollama",
      "model": "starcoder2:7b",
      "apiKey": "<access_token>",
      "apiBase": "https://<your-cube-instance>/proxy/<your-domain-id>",
      "requestOptions": {
        "verifySsl": false
      }
    }
  ],
  "context": [
    { "provider": "code" },
    { "provider": "terminal" },
    { "provider": "diff" },
    { "provider": "folder" },
    { "provider": "problems" },
    { "provider": "docs" }
  ]
}
```

### Replace:

- `<access_token>` → your Cube AI access token  
- `<your-cube-instance>` → usually `localhost`  
- `<your-domain-id>` → domain ID your VS Code should use  

> `verifySsl: false` should be used **only for local development**.

---

## 4. Using Continue With Cube AI

Once configured:

- Press **Ctrl+L** to open the Continue chat  
- Ask questions or request explanations  
- Use inline suggestions backed by Cube AI models running inside TEEs

Examples:

- “Explain this function”
- “Refactor this TypeScript file”
- “Write unit tests for this module”

---

## 5. Troubleshooting

### Connection issues
- Ensure Cube AI is running (`make up`)  
- Verify the domain exists  
- Check whether your token is valid  

### SSL issues
Set `"verifySsl": false"` for local dev only.  
Use proper certificates in production.

---

## 6. Video Tutorial

A complete walkthrough is available here:

https://www.youtube.com/watch?v=BGpv_iTB2NE
