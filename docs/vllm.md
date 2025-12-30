# vLLM Inference Engine

Cube AI integrates **vLLM** as a high-performance inference backend for serving large language models (LLMs).  
vLLM runs as a dedicated **inference server**, while Cube AI provides security, isolation, and access control.

This separation of concerns allows Cube AI to combine **state-of-the-art inference performance** with **strong confidentiality and trust guarantees**.

---

## What Is vLLM

**vLLM** is an optimized inference engine designed specifically for serving LLMs at scale.  
It focuses on maximizing GPU utilization while minimizing latency under concurrent workloads.

Key characteristics of vLLM include:

- High-throughput, low-latency text generation
- Efficient GPU memory usage
- Support for concurrent and streaming requests
- OpenAI-compatible HTTP API

---

## Core Concepts

vLLM implements several internal optimizations to handle large models efficiently and serve multiple concurrent requests.  
From Cube AI’s perspective, vLLM is treated as a **runtime inference service** accessed via HTTP API.

### Continuous Batching

vLLM uses **continuous batching**, which allows:

- New requests to be added while other requests are still generating tokens
- Ongoing batches to be extended dynamically
- Reduced tail latency under load

This makes vLLM particularly suitable for interactive APIs and real-time applications.

---

## vLLM Deployment in Cube AI

In Cube AI, vLLM is deployed as a **dedicated inference service** using the official OpenAI-compatible vLLM runtime.  

The service is started via container-based deployment and configured for GPU acceleration.

Key deployment characteristics include:

- GPU passthrough using the NVIDIA runtime
- Controlled GPU memory utilization
- Persistent model and cache storage
- Configurable model selection via environment variables
- Runs as a **server process** accessible by Cube AI Local Proxy or API

vLLM is treated as a runtime component and is not modified internally by Cube AI.

---

## Model Configuration and Execution

vLLM is configured at startup using runtime parameters, including:

- Model identifier (e.g., Hugging Face model name)
- Maximum context length
- GPU memory utilization limits
- Network binding and service port

Models are loaded once and kept in GPU memory for efficient reuse across requests.

---

## Security and Confidentiality Context

When deployed inside Cube AI’s confidential computing environment, vLLM benefits from:

- Memory encryption provided by the underlying hardware
- Isolation from the host operating system and hypervisor
- Protection against infrastructure-level access

All sensitive inputs, intermediate states, and outputs are processed only within the trusted execution environment.  
vLLM itself remains unaware of these guarantees and operates as a standard inference engine.

---

## Why Cube AI Uses vLLM

By integrating vLLM, Cube AI achieves:

- High-throughput and low-latency inference
- Efficient and predictable GPU memory usage
- Scalable handling of concurrent requests
- Compatibility with OpenAI-style APIs

Combined with Cube AI’s attestation and proxy-based security model, this enables production-grade AI inference with both **performance** and **trust**.
