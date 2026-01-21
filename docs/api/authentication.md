---
id: authentication
title: Authentication
sidebar_position: 2
---

Cube AI uses **token-based authentication** with **Personal Access Tokens (PATs)**.

All API requests must be authenticated using a valid PAT.  
Authentication is **required** before interacting with any Cube AI API endpoint.

---

## Overview

Cube AI authentication is based on **long-lived Personal Access Tokens (PATs)**:

- PATs are issued to a **user**
- PATs are used for **all API access, integrations, and development workflows**
- API access is **scoped by domain**, not by the token itself

This approach avoids frequent re-authentication and is recommended for all external usage.

---

## Personal Access Tokens (Recommended)

**Personal Access Tokens (PATs)** are long-lived tokens intended for:

- API access
- CLI tools
- IDE integrations (Continue, OpenCode, etc.)
- Automation and scripts

PATs replace short-lived access tokens for all documented API usage.

---

## Creating a Personal Access Token

To create a PAT:

1. Log in to the Cube AI UI
2. Click your profile avatar in the top-right corner
3. Navigate to **Profile → Personal Access Tokens**
4. Click **Create Token**
5. Copy and store the token securely

> PATs are shown **only once**. Make sure to store them securely.

---

## Using a Personal Access Token

All Cube AI API requests must include the PAT as a Bearer token:

```http
Authorization: Bearer <pat>
```

Example:

```bash
curl -k https://<cube-ai-instance>/users   -H "Authorization: Bearer <pat>"
```

---

## Domain-Scoped API Access

Cube AI exposes model APIs through a **domain-scoped proxy**.

All OpenAI-compatible API requests must be sent to:

```http
/proxy/<domain_id>/v1/
```

Example:

```bash
curl -k https://<cube-ai-instance>/proxy/<domain_id>/v1/models   -H "Authorization: Bearer <pat>"
```

The domain determines:

- Which models are available
- Which backends are used (Ollama / vLLM)
- Access permissions

---

## Token Scope and Security

- PATs are **issued per user**
- PATs are **long-lived**
- Domains control **model visibility and permissions**
- Tokens must be kept **secret**
- Tokens should be transmitted only over **HTTPS**

> For local development, Cube AI may run with self-signed certificates.  
> In production, valid TLS certificates are required.

---

## Short-Lived Access Tokens (UI Only)

Cube AI may issue **short-lived JWT access tokens** internally for UI login sessions.

These tokens:

- Are managed automatically by the UI
- Are **not intended for direct API usage**
- Are **not documented** for external integrations

All documentation examples use **Personal Access Tokens (PATs)**.

---

## Summary

- Cube AI uses **Personal Access Tokens (PATs)** for authentication
- PATs are created via the Cube AI UI
- All API calls require `Authorization: Bearer <pat>`
- Model APIs are accessed via the **domain proxy**
- Domain isolation and PAT-based access are core security features of Cube AI
