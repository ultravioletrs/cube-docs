---
id: continue
title: Continue for VS Code
sidebar_position: 1
---

# Continue Integration for VS Code

The **Continue** extension brings **Cube AI** LLM capabilities directly into **Visual Studio Code**, enabling:

- inline code completions
- refactoring assistance
- chat-based explanations
- test and documentation generation

This guide shows how to connect **Continue** with a **Cube AI domain** in a few simple steps.

---

## What You Will Get

After completing this guide, you will be able to:

- use Cube AI models inside VS Code
- chat with your codebase
- refactor and explain code using enterprise-grade LLMs
- keep all data inside your Cube AI deployment

---

## Architecture Overview

Continue runs locally inside VS Code and forwards requests to Cube AI, which handles authentication, model routing, and security, while all data remains inside your Cube AI deployment.

<!-- IMAGE: architecture-diagram -->
<!-- Add diagram: Continue → Cube AI → Models -->

---

## 1. Install Requirements

### Install Visual Studio Code
https://code.visualstudio.com

### Install the Continue Extension
https://www.continue.dev

---

## 2. Open Continue Configuration

In **Visual Studio Code**:

1. Click the **Continue** icon in the sidebar  
2. Open the **Settings (⚙️)** menu  
3. Select **Configure Continue**

This opens the configuration file:

```
.continue/config.yaml
```

<!-- IMAGE: continue-open-config -->
<!-- Screenshot: Continue icon + Configure option -->

---

## 3. Generate a Cube AI Access Token

Before configuring Continue, generate an access token in **Cube AI UI**:

1. Open Cube AI UI
2. Go to **Profile → Tokens**
3. Click **Generate token**
4. Copy the token value

<!-- IMAGE: cube-token-generation -->
<!-- Screenshot: Profile → Tokens -->

---

## 4. Configure Continue to Use Cube AI

Replace the contents of `.continue/config.yaml` with the configuration below.

```yaml
name: Cube AI
version: "1.0.0"
schema: v1

models:
  - name: tinyllama
    provider: ollama
    model: tinyllama:1.1b
    apiKey: <access_token>
    apiBase: https://<cube-instance>/proxy/<domain-id>
    requestOptions:
      verifySsl: false

  - name: starcoder2
    provider: ollama
    model: starcoder2:7b
    apiKey: <access_token>
    apiBase: https://<cube-instance>/proxy/<domain-id>
    requestOptions:
      verifySsl: false

context:
  - provider: code
  - provider: terminal
  - provider: diff
  - provider: folder
  - provider: problems
  - provider: docs
```

### Replace the placeholders

- `<access_token>` → your Cube AI access token  
- `<cube-instance>` → usually `localhost`  
- `<domain-id>` → Cube AI domain ID  

⚠️ `verifySsl: false` is for local development only.

---

## 5. Verify the Connection

1. Open Continue chat using **Ctrl + L**
2. Select a configured model
3. Ask:

```
Explain what this project does
```

<!-- IMAGE: continue-chat-success -->
<!-- Screenshot: Continue chat with response -->

---

## 6. Example Prompts

- Explain this function
- Refactor this file
- Write unit tests
- Summarize this folder

---

## 7. Troubleshooting

### Connection Issues
- Ensure Cube AI is running
- Verify domain ID
- Check access token

### Unauthorized (401)
- Token expired or invalid

### SSL Errors
```yaml
requestOptions:
  verifySsl: false
```

---

## 8. Video Tutorial

https://www.youtube.com/watch?v=BGpv_iTB2NE

---

## Next Steps

- Embeddings & RAG
- Models overview
- API integrations
