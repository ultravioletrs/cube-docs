---
id: ui-overview
title: UI Overview
---

This section provides a high-level overview of the Cube AI user interface and
common user workflows.

---

## Login

Users authenticate using their email and password through the Cube AI login page.

![Cube AI login screen](/img/ui/login.png)

After successful authentication, users gain access to their available domains.

---

## Domains

Domains represent isolated execution environments.

A selected domain determines:

- Available models
- Enabled backends (Ollama, vLLM)
- Permissions and access scope

Users must select a domain before interacting with models or APIs.

![Domain selection screen](/img/ui/domains.png)

---

## Models

Models are scoped to the selected domain.

Available models can be viewed and selected directly from the Chat interface.
The list of models reflects what is enabled and available in the active domain.

![Available models in the selected domain](/img/ui/models.png)

---

## Tokens

The Tokens section allows users to:

- Create Personal Access Tokens (PATs)
- Define token duration and scopes
- Revoke existing tokens
- Copy tokens for API and tool usage

Tokens are required for API access and external integrations.

![Personal Access Token creation screen](/img/ui/pats.png)

---

## Chat and Completions

The UI provides interactive access to language models through a chat interface.

Users can:

- Select a model from the available domain models
- Send prompts and receive responses
- Switch models dynamically
- Execute inference inside a Trusted Execution Environment (TEE)

Responses are generated securely and are domain-isolated.

![Chat and model selection screen](/img/ui/chat.png)

---

## Typical User Workflow

A common workflow looks like this:

1. Log in to the UI
2. Select a domain
3. Select an available model
4. Create a Personal Access Token
5. Use the token in API calls or external tools
