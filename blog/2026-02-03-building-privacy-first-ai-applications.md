---
slug: building-privacy-first-ai-applications
title: "Building Privacy-First AI Applications with Cube AI: A Technical Integration Guide"
authors: [cube-team]
tags: [integration, developer-guide, openai-api, proxy, technical]
image: /img/technical-integration-guide.png
date: 2026-02-02
---

![Technical Integration Guide](/img/technical-integration-guide.png)

Integrating Large Language Models into modern backend architectures has historically presented a fundamental tension: advanced analytical capability versus stringent data privacy requirements. Standard cloud-based AI deployments rely on implicit trust, where sensitive prompts, proprietary model weights, and generated outputs are exposed to the host OS, hypervisor, and cloud provider.

**Cube AI solves this with an open-source framework that executes GPT-based applications within hardware-protected Trusted Execution Environments (TEEs).** This technical guide shows backend engineers how to integrate Cube AI into production using its OpenAI-compatible proxy.


## The Proxy Paradigm

In a typical backend architecture, Cube AI functions as a secure intermediary—a "trusted proxy"—between your application layer and inference engines. Rather than interacting directly with raw backends like Ollama or vLLM, applications communicate with the Cube Proxy.

### Key Benefits

- **Provider Abstraction**: Code remains agnostic to the specific backend (vLLM or Ollama)
- **Security Enforcement**: The proxy handles JWT validation and domain-based routing before requests reach the TEE
- **Safety Guardrails**: Integrated services provide PII detection and jailbreak protection before data reaches the model

## Architectural Overview

Cube AI is a modular ecosystem built on the [SuperMQ](https://github.com/absmach/supermq) microservices:

| Component              | Functionality                                    | Implementation Details                          |
|------------------------|--------------------------------------------------|-------------------------------------------------|
| **SuperMQ Services**   | Identity and tenant layer (Users, Auth, Domains) | Manages JWT issuance and domain-scoped policies |
| **Cube Proxy**         | Secure request gateway and entry point           | Normalizes requests to OpenAI-compatible shapes |
| **Guardrails Service** | AI safety controls                               | Sanitizes inputs/outputs; detects PII           |
| **LLM Backends**       | Inference execution (vLLM or Ollama)             | Optimized for hardware acceleration             |
| **TEE Layer**          | Hardware memory encryption                       | Utilizes AMD SEV-SNP or Intel TDX               |


### Domain-Based Multi-Tenancy

Each "Domain" in Cube AI represents an isolated tenant. The Domains Service scopes permissions, and policies to a specific domain ID. When a request hits the Proxy, it's routed based on the `domainID` in the URL path, ensuring one tenant's prompts cannot leak into another tenant's.

## Step-by-Step Integration Guide

### 1. Environment Setup

Cube AI requires hardware support for TEEs and Docker for orchestration.

```bash
# Clone and launch
git clone https://github.com/ultravioletrs/cube.git
cd cube
make up  # Starts all microservices via Docker Compose
```

**Prerequisites**: Ensure the host supports AMD SEV-SNP or Intel TDX for production-grade confidentiality.

### 2. Authentication & Domain Configuration

All protected endpoints require a valid JWT token and a domain-scoped URL.

#### Obtain a JWT Token

```bash
curl -ksSiX POST https://localhost/users/tokens/issue \
     -H "Content-Type: application/json" \
     -d '{
           "username": "admin@example.com",
           "password": "m2N2Lfno"
         }'
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_type": "Bearer"
}
```

#### Create a Secure Domain

Each domain must have a unique route and optional tags.

```bash
curl -ksSiX POST https://localhost/domains \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
     -d '{
           "name": "Production_App",
           "route": "prod_v1",
           "tags": ["healthcare", "internal"],
           "metadata": { "region": "US" }
         }'
```

> **Important**: Save the `id` from the response; it's required for the proxy URL path.

## OpenAI-Compatible API Examples

The Cube Proxy serves endpoints at `https://localhost/proxy/{domainID}/v1/`.


### cURL Example

```bash
curl -ksSiX POST https://localhost/proxy/${DOMAIN_ID}/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${CUBE_JWT_TOKEN}" \
  -d '{
    "model": "llama3:8b",
    "messages": [
      {"role": "user", "content": "Hello, Cube AI!"}
    ]
  }'
```

### Node.js Implementation

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CUBE_JWT_TOKEN,
  baseURL: `https://localhost/proxy/${process.env.CUBE_DOMAIN_ID}/v1`,
});

async function chatCompletion() {
  const completion = await client.chat.completions.create({
    model: "llama3:8b",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Explain confidential computing in simple terms." }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
  
  console.log(completion.choices[0].message.content);
}

// Streaming example
async function streamingChat() {
  const stream = await client.chat.completions.create({
    model: "llama3:8b",
    messages: [{ role: "user", content: "Write a haiku about privacy." }],
    stream: true,
  });
  
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

chatCompletion();
```

### Python Implementation

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("CUBE_JWT_TOKEN"),
    base_url=f"https://localhost/proxy/{os.getenv('CUBE_DOMAIN_ID')}/v1"
)

def chat_completion():
    """Basic chat completion example"""
    completion = client.chat.completions.create(
        model="mistral:7b",
        messages=[
            {"role": "system", "content": "You are a security expert."},
            {"role": "user", "content": "What are the benefits of TEEs?"}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    print(completion.choices[0].message.content)

def streaming_chat():
    """Streaming response example"""
    stream = client.chat.completions.create(
        model="llama3:8b",
        messages=[
            {"role": "user", "content": "Explain how Cube AI protects data."}
        ],
        stream=True
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="")

if __name__ == "__main__":
    chat_completion()
```

### Go Implementation

```go
package main

import (
    "context"
    "fmt"
    "io"
    "os"
    
    "github.com/openai/openai-go"
    "github.com/openai/openai-go/option"
)

func main() {
    client := openai.NewClient(
        option.WithAPIKey(os.Getenv("CUBE_JWT_TOKEN")),
        option.WithBaseURL(fmt.Sprintf(
            "https://localhost/proxy/%s/v1/",
            os.Getenv("CUBE_DOMAIN_ID"),
        )),
    )

    // Basic chat completion
    chatCompletion(client)
    
    // Streaming example
    streamingChat(client)
}

func chatCompletion(client *openai.Client) {
    resp, err := client.Chat.Completions.New(context.Background(),
        openai.ChatCompletionNewParams{
            Model: openai.F("tinyllama:1.1b"),
            Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
                openai.SystemMessage("You are a helpful AI assistant."),
                openai.UserMessage("What is confidential computing?"),
            }),
            Temperature: openai.Float(0.7),
            MaxTokens:   openai.Int(500),
        },
    )
    
    if err != nil {
        panic(err)
    }
    
    fmt.Println(resp.Choices[0].Message.Content)
}

func streamingChat(client *openai.Client) {
    stream := client.Chat.Completions.NewStreaming(context.Background(),
        openai.ChatCompletionNewParams{
            Model: openai.F("llama3:8b"),
            Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
                openai.UserMessage("Explain TEEs briefly."),
            }),
        },
    )
    
    for stream.Next() {
        evt := stream.Current()
        if len(evt.Choices) > 0 {
            fmt.Print(evt.Choices[0].Delta.Content)
        }
    }
    
    if err := stream.Err(); err != nil {
        panic(err)
    }
}
```

## Model Selection and Management

### Listing Available Models

```javascript
// Node.js
async function listModels() {
  const models = await client.models.list();
  
  console.log("Available models:");
  for await (const model of models) {
    console.log(`- ${model.id} (${model.owned_by})`);
  }
}
```

```python
# Python
def list_models():
    """List all available models in the domain"""
    models = client.models.list()
    
    print("Available models:")
    for model in models.data:
        print(f"- {model.id} (owned by: {model.owned_by})")
```

```bash
# cURL
curl -ksSiX GET https://localhost/proxy/${DOMAIN_ID}/v1/models \
  -H "Authorization: Bearer ${CUBE_JWT_TOKEN}"
```

### Dynamic Model Selection

```javascript
// Node.js - Select model based on task complexity
async function selectModelForTask(taskComplexity) {
  const modelMap = {
    'simple': 'tinyllama:1.1b',
    'medium': 'llama3:8b',
    'complex': 'mistral:7b'
  };
  
  const model = modelMap[taskComplexity] || 'llama3:8b';
  
  const completion = await client.chat.completions.create({
    model: model,
    messages: [{ role: "user", content: "Your prompt here" }],
  });
  
  return completion.choices[0].message.content;
}
```

## JWT Lifecycle & Token Management

### Token Refresh Pattern

Access tokens are short-lived. Use the refresh token to maintain a session.

```bash
curl -ksSiX POST https://localhost/users/tokens/refresh \
     -H "Content-Type: application/json" \
     -d '{ "token": "<YOUR_REFRESH_TOKEN>" }'
```


## Performance & Model Strategy

### Backend Selection

**vLLM**:

- High-throughput via continuous batching
- CUDA acceleration for GPU workloads
- Ideal for production inference at scale
- Supports PagedAttention for efficient memory management

**Ollama **:

- Rapid model switching
- Lower resource requirements
- Perfect for local testing and prototyping
- Easier setup for development environments

### TEE Performance Overhead

Memory encryption typically introduces marginal latency, though hardware acceleration via AMD/Intel chips minimizes this impact. For most LLM workloads, the bottleneck is model computation, not encryption overhead.


## Production Best Practices

### 1. Remote Attestation

Periodically verify that the TEE is authentic and hasn't been tampered with:

```bash
# Verify TEE attestation (example endpoint)
curl -ksSiX GET https://localhost/attestation/verify \
  -H "Authorization: Bearer ${CUBE_JWT_TOKEN}"
```

## Troubleshooting Common Issues

### 404 Not Found

**Issue**: Endpoint returns 404

**Solution**: Ensure the `domainID` is correctly placed in the proxy URL:
### Auth Failure (401 Unauthorized)

**Issue**: JWT has expired

**Solution**: Implement an interceptor to call `/users/tokens/refresh`:

### TEE Not Detected

**Issue**: Hardware TEE not available

**Solution**: 
1. Verify host drivers for AMD SEV or Intel TDX
2. For development, Cube can run in non-TEE mode by disabling the hardware check in proxy config
3. Check BIOS settings to ensure virtualization and TEE features are enabled

### Model Not Found

**Issue**: Specified model doesn't exist

**Solution**: List available models:

```bash
curl -ksSiX GET https://localhost/proxy/${DOMAIN_ID}/v1/models \
  -H "Authorization: Bearer ${CUBE_JWT_TOKEN}"
```

## Migration from OpenAI

Migrating from OpenAI to Cube AI requires minimal code changes:

```diff
  import OpenAI from "openai";

  const client = new OpenAI({
-   apiKey: process.env.OPENAI_API_KEY,
+   apiKey: process.env.CUBE_JWT_TOKEN,
+   baseURL: `https://localhost/proxy/${process.env.CUBE_DOMAIN_ID}/v1`,
  });

  const completion = await client.chat.completions.create({
-   model: "gpt-4",
+   model: "llama3:8b",
    messages: [{ role: "user", content: "Hello!" }],
  });
```

## Key Takeaways

1. **Drop-in Replacement**: Cube AI's OpenAI-compatible API allows migration in hours, not weeks
2. **Hardware-Level Security**: TEEs provide mathematical guarantees that software-based security cannot
3. **Multi-Tenant Ready**: Domain-based isolation ensures complete segregation between tenants
4. **Production-Grade**: Built on SuperMQ microservices with robust authentication and authorization
5. **Flexible Backends**: Switch between vLLM and Ollama without code changes

---

*Ready to build privacy-first AI applications? Check out our [GitHub repository](https://github.com/ultravioletrs/cube) or dive into the [full documentation](/) to get started.*
