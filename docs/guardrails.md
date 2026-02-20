---
id: guardrails
title: AI Guardrails
---

AI Guardrails in Cube AI define the **security, isolation, and control mechanisms**
applied around Large Language Model (LLM) inference.

Their purpose is to ensure that LLM usage is **safe, auditable, and predictable**
in enterprise environments.

Guardrails do not change how models reason or generate outputs — they control
**how models are accessed, executed, and isolated** within the platform.

In Cube AI, a *domain* represents an isolated workspace that groups users,
permissions, configuration, and available models. Guardrails are applied
**per domain**, ensuring strong isolation and access control between workspaces.

---

## Cube AI Scope

> **Cube AI scope**
>
> Cube AI guardrails operate at the **platform level**.
> They control access, isolation, and execution of models, but do **not**
> modify model weights, prompts, or training behavior.

Cube AI does **not**:

- train models
- fine-tune models
- rewrite prompts
- alter model outputs for ethical or policy reasons

---

## What Guardrails Do

![Cube AI guardrails overview](/img/cube-ai-guardrails.png)

This diagram illustrates how Cube AI guardrails enforce security and isolation
at the platform level without interfering with application logic or model behavior.

Cube AI guardrails provide:

### Authentication & Authorization

- token-based access control (PATs and API tokens)
- domain-scoped permissions
- per-domain model visibility
- enforcement of role-based access control (RBAC)

### Domain Isolation

- strict separation between domains
- no data or model leakage across domains
- isolated execution contexts
- domain-scoped configuration and model exposure

### Request Validation

- validation of incoming API requests
- enforcement of API contracts
- rejection of malformed or unauthorized calls

### Model Access Control

- control over which models are available per domain
- backend-specific model exposure (e.g., vLLM, Ollama)
- prevention of unauthorized model usage

### Secure Execution (TEE)

When configured, model inference can execute inside
**Trusted Execution Environments (TEEs)**.

This provides:

- confidential execution of prompts and responses
- runtime memory isolation
- attested secure connections between platform components
- verifiable execution integrity

### Auditing & Observability

- recording of security-relevant events
- traceability of inference calls
- integration with audit logs when enabled
- support for compliance and forensic analysis

---

## What Guardrails Do NOT Do

To avoid confusion, Cube AI guardrails do **not**:

- rewrite or sanitize prompts
- filter or censor model outputs
- implement AI ethics or content moderation policies
- perform alignment tuning
- replace application-level safety logic

Guardrails ensure **platform-level safety and isolation**, not application behavior.

---

## Why Guardrails Matter

Without guardrails, LLM deployments risk:

- unauthorized access
- data leakage between tenants
- untraceable model usage
- insecure execution environments
- unpredictable production behavior

Cube AI guardrails make LLM usage suitable for:

- enterprise deployments
- multi-tenant environments
- regulated industries
- confidential and sensitive workloads

---

## Relationship to Applications

Guardrails complement — but do not replace — application-level controls.

Applications remain responsible for:

- prompt design
- output validation
- business logic enforcement
- user-facing safety mechanisms

Cube AI ensures the **infrastructure layer remains secure, isolated, and auditable**.

---

## Next Steps

- Learn how Cube AI executes models using [vLLM](./vllm)
- Explore available [Models](./api/models)
- Use [Chat Completions](./api/chat-completions) with guardrails enabled
- Review [Audit Logs](./security/audit-logs) for execution traceability
