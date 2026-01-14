---
id: guardrails
title: Guardrails
sidebar_position: 6
---

## Guardrails

Cube AI includes a built-in **Guardrails Service** that provides AI safety controls for LLM interactions. The service acts as a semantic firewall, validating inputs and sanitizing outputs to ensure safe, compliant, and policy-adherent AI behavior.

---

## What Are Guardrails?

Guardrails are programmable safety controls that sit between users and LLMs. They provide:

- **Input Validation:** Filter malicious prompts, jailbreak attempts, and toxic language before they reach the LLM
- **Output Sanitization:** Validate LLM responses for safety, accuracy, and policy compliance
- **PII Detection:** Automatically detect and redact Personally Identifiable Information
- **Dialogue Control:** Enforce specific conversation flows using Colang definitions
- **Dynamic Configuration:** Update guardrails in real-time without service restarts

---

## Key Capabilities

### Input Rails

Input rails protect the LLM by filtering:

- **Jailbreak Attempts:** Detects prompts trying to bypass safety filters ("ignore previous instructions", "act as DAN", etc.)
- **Prompt Injection:** Blocks attempts to manipulate model behavior through injection attacks
- **Toxic Content:** Filters abusive language, hate speech, and harassment
- **Restricted Topics:** Blocks queries about illegal activities, weapons, drugs, etc.
- **Bias Detection:** Identifies gender, racial, religious, and age-related bias

### Output Rails

Output rails sanitize LLM responses:

- **Hallucination Detection:** Identifies overconfident or factually uncertain statements
- **Content Safety:** Filters violence, explicit content, and offensive material
- **PII Redaction:** Masks sensitive data like names, emails, credit cards, and IP addresses
- **Bias Prevention:** Blocks biased statements in responses
- **Policy Enforcement:** Ensures responses align with organizational guidelines

### Sensitive Data Detection

Powered by Microsoft Presidio, the service detects:

- Person names (PERSON)
- Email addresses (EMAIL_ADDRESS)
- Credit card numbers (CREDIT_CARD)
- Cryptocurrency addresses (CRYPTO)
- Dates and times (DATE_TIME)
- IBAN codes (IBAN_CODE)
- IP addresses (IP_ADDRESS)
- Locations (LOCATION)
- Medical license numbers (MEDICAL_LICENSE)

---

## Configuration Files

Guardrails are defined using three file types:

### config.yml

Main configuration defining models, rails, and sensitive data detection:

```yaml
models:
  - type: main
    engine: ollama
    model: llama3.2:latest
    parameters:
      base_url: http://cube-agent:8901

instructions:
  - type: general
    content: |
      You are a helpful AI assistant. Provide accurate, helpful information while maintaining ethical guidelines.

rails:
  config:
    sensitive_data_detection:
      # Presidio analyzer configuration
      nlp_engine_name: spacy
      supported_languages: [en]
      models:
        - lang_code: en
          model_name: en_core_web_lg
      ner_model_configuration:
        model_to_presidio_entity_mapping:
          PER: PERSON
          PERSON: PERSON
          NORP: NRP
          FAC: LOCATION
          LOC: LOCATION
          GPE: LOCATION
          LOCATION: LOCATION
          ORG: ORGANIZATION
          ORGANIZATION: ORGANIZATION
          DATE: DATE_TIME
          TIME: DATE_TIME
        low_confidence_score_multiplier: 0.4
      input:
        score_threshold: 0.6
        entities:
          - PERSON
          - EMAIL_ADDRESS
          - CREDIT_CARD
          - CRYPTO
          - DATE_TIME
          - IBAN_CODE
          - IP_ADDRESS
          - NRP
          - LOCATION
          - MEDICAL_LICENSE
          - IP_ADDRESS
  input:
    flows:
      - mask sensitive data on input
  output:
    flows:
      - mask sensitive data on output
```

### prompts.yml

Custom prompts for self-check operations:

```yaml
prompts:
  - task: self_check_input
    content: >
      Your task is to check if the user message complies with the policy.

      Policy for user messages:
      - should not contain harmful data
      - should not use abusive language
      - should not contain explicit content

      User message: "{{ user_input }}"

      Answer: [Yes/No]

  - task: self_check_output
    content: >
      Your task is to determine whether the bot response meets the
      moderation policy.

      User input: "{{ user_input }}"
      Bot response: "{{ bot_response }}"

      Should this response be blocked?
      Answer [Yes/No]:
```

### Colang Files (\*.co)

Dialogue flow definitions using the Colang language:

```colang
define user ask jailbreak
  "ignore previous instructions"
  "bypass safety"
  "act as DAN"
  "developer mode"

define bot refuse jailbreak_attempt
  "I can't help with requests that try to bypass my guidelines."

define flow validate user message
  user ask jailbreak
  bot refuse jailbreak_attempt
  stop
```

---

## API Reference

### Health Check

```bash
curl http://localhost/proxy/guardrails/health
  -H "Authorization: Bearer <token>" 
```

Response:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "runtime_ready": true,
  "current_revision": 1
}
```

### Configuration Management

#### Create Configuration

```bash
curl -X POST http://localhost/proxy/guardrails/configs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "production-config",
    "description": "Production guardrails configuration",
    "config_yaml": "models:\n  - type: main\n    engine: ollama\n    model: llama3.2:latest",
    "prompts_yaml": "",
    "colang": "define flow greeting\n  user express greeting\n  bot express greeting"
  }'
```

#### List Configurations

```bash
curl http://localhost/proxy/guardrails/configs
```

#### Create Version

```bash
curl -X POST http://localhost/proxy/guardrails/configs/{config_id}/versions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "v1.0.0",
    "description": "Initial release"
  }'
```

#### Activate Version

```bash
curl -X POST http://localhost/proxy/guardrails/versions/{version_id}/activate \
  -H "Authorization: Bearer <token>" 
```

#### Reload Runtime

Force reload the active configuration:

```bash
curl -X POST http://localhost/proxy/guardrails/reload \
  -H "Authorization: Bearer <token>" 
```

---

## Version Management

The Guardrails Service uses a version control system for safe deployments:

1. **Create Config:** Define your guardrail rules as a draft configuration
2. **Create Version:** Snapshot the configuration into an immutable version
3. **Test Version:** Verify the version works correctly
4. **Activate Version:** Promote the version to production

Only one version can be active at a time. This ensures atomic switching between configurations and enables instant rollback if issues occur.

### Version Workflow

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Config     │────▶│   Version    │────▶│   Active     │
│   (Draft)    │     │  (Snapshot)  │     │  (Runtime)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
    Editable           Immutable            Hot-reload
```

---

## Default Configuration

On startup, if no configuration exists in the database, the service automatically initializes from the `./rails` directory:

- `config.yml` - Main configuration
- `prompts.yml` - Prompt templates
- `*.co` - Colang flow definitions

This provides a seamless out-of-the-box experience for development.

---

## Built-in Safety Rails

The default configuration includes comprehensive safety rails:

### Input Validation Rails

- **Empty/Invalid Messages:** Rejects empty or malformed input
- **Jailbreak Detection:** 50+ patterns for jailbreak attempts
- **Prompt Injection:** Blocks system prompt manipulation
- **Toxicity Filter:** Detects abusive and offensive language
- **Restricted Topics:** Blocks illegal, harmful, and dangerous content
- **Bias Detection:** Identifies gender, racial, religious, and age bias
- **Political/Personal:** Declines political and belief-related questions

### Output Validation Rails

- **Hallucination Detection:** Flags overconfident or uncertain statements
- **Unsafe Content:** Blocks violence, explicit content, and PII
- **Bias Prevention:** Filters biased statements in responses
- **Restricted Topics:** Prevents generation of dangerous content

---

## Integration with Cube AI

The Guardrails Service integrates with the Cube AI proxy:

1. **Request Flow:** Client → Proxy → Guardrails → LLM Backend
2. **Authentication:** Inherits domain-based authentication from Cube Proxy
3. **TEE Protection:** Runs inside the Trusted Execution Environment

---

## Best Practices

### Configuration

- Use descriptive names for configurations and versions
- Create versions before deploying to production
- Test new versions in a staging environment first
- Keep rollback versions available

### Safety Rules

- Start with the default rails and customize as needed
- Add domain-specific rules for your use case
- Test rails with adversarial inputs

---

## Troubleshooting

### Runtime Not Ready

If the health check shows `runtime_ready: false`:

1. Check if an active version exists
2. Verify database connectivity
3. Check logs for configuration loading errors
4. Try reloading: `POST /guardrails/reload`

### Configuration Not Loading

If configurations fail to load:

1. Validate YAML syntax in config_yaml
2. Check Colang syntax in colang field
3. Verify prompts_yaml format
4. Review error logs for specific issues

### PII Detection Issues

If PII is not being detected:

1. Verify `sensitive_data_detection` is enabled in config
2. Check score_threshold (lower = more sensitive)
3. Ensure required entities are listed
4. Verify spaCy model is installed (`en_core_web_lg`)
