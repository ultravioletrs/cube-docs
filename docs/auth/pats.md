---
id: pats
title: Personal Access Tokens (PATs)
---

## What are Personal Access Tokens (PATs)

Personal Access Tokens (PATs) are **time-limited, scope-based tokens** used to
authenticate API requests without using username/password credentials.

PATs are intended for programmatic access, automation, CLI usage, and
third-party integrations.

---

## When to use PATs

Use Personal Access Tokens when you need:

- API access from scripts or services
- Authentication for CLI tools
- CI/CD or automation workflows
- Integration with external tools and editors

---

## Creating a PAT (UI)

To create a Personal Access Token using the Cube AI UI:

1. Log in to the Cube AI UI
2. Navigate to **Profile → PATs**
3. Click **Create**
4. Provide the required information:
   - **Name** — a unique name for the token
   - **Duration** — token validity period
   - **Scopes** — allowed resources and operations
5. Click **Create** and copy the generated token

⚠️ The token value is displayed only once.
Store it securely, as it cannot be retrieved again.

---

## Token Duration

When creating a PAT, you must define its validity period.

The token will automatically expire after the selected duration.
Expired tokens can no longer be used for authentication.

---

## Token Scopes

PATs in Cube AI are **scope-based**.

Each token must define one or more scopes.  
A scope consists of:

- **Entity Type** — the type of resource (for example: models, domains, datasets)
- **Entity** — the specific resource instance
- **Operation** — the allowed operation (for example: read, write, execute)

Only operations explicitly allowed by the configured scopes can be performed
using the PAT.

---

## Using a PAT

PATs are passed as Bearer tokens in the `Authorization` header.

```http
Authorization: Bearer <your_pat>
```

### Example

```bash
curl -k https://<cube-ai-instance>/proxy/<domain_id>/v1/models \
  -H "Authorization: Bearer <your_pat>"
```

---

## Security Best Practices

- PATs are issued per user
- Access remains restricted by domain permissions
- Tokens should be kept secret
- Rotate tokens regularly
- Revoke unused or compromised tokens immediately

---

## Revoking PATs

PATs can be revoked at any time from the UI:

### Profile → PATs → Revoke
