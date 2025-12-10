---
id: attestation
title: Attestation
sidebar_position: 4
---

# Attestation

Attestation is a security process used to verify that a system is running trusted software inside a trusted environment.  
In Cube AI, attestation ensures that the confidential computing environment (CVM) has not been tampered with before Cube AI services start running.

Cube AI currently performs attestation **internally**, during the boot sequence of the confidential virtual machine (CVM).  
This ensures that all code, configuration, and infrastructure components are validated *before* any user operations or AI model execution happen.

User-facing or developer-accessible attestation APIs are **not yet exposed**.

---

## How Cube AI Uses Attestation Today

Cube AI runs inside **AMD SEV-SNP–based Confidential VMs (CVMs)**.  
SEV-SNP provides:

- Full memory encryption  
- Protection from a malicious hypervisor or cloud provider  
- Integrity verification of the VM state  
- Hardware-enforced measurement of what software boots inside the VM

During startup:

1. The CVM performs **hardware attestation** using the AMD SEV-SNP attestation report.
2. Measurements are validated internally before Cube AI components start.
3. If the environment does not match expected measurements, the system refuses to start.

Because this attestation happens before any workloads run, Cube AI ensures that:

- The AI backend (Ollama or vLLM) is running on trusted code  
- The proxy and API services are verified  
- Sensitive data and model prompts are protected from host-level access  

At this time, these attestation details remain **internal to Cube AI**.

---

## Why Attestation Matters

Confidential Computing provides strong isolation, but attestation ensures:

- The VM truly has SEV-SNP protections enabled  
- The system hasn’t been modified by the cloud provider  
- No unauthorized code is executed inside the enclave  
- All model prompts and responses remain protected even from the host  

This is essential for:

- Enterprise deployments  
- Regulated industries (healthcare, finance, defense, R&D)  
- Zero-trust security architectures  
- Protecting sensitive AI inputs and outputs  

---

## Future Roadmap (User-Facing Attestation)

Cube AI will introduce **public attestation verification** features, allowing applications to verify that they are interacting with a trusted instance.

Planned enhancements include:

### 🔹 API Endpoint for Attestation Reports
Applications will be able to request:
```
GET /attestation/report
```

### 🔹 Measurement Verification
Clients will be able to verify:
- Hashes of Cube AI binaries  
- Security policy configuration  
- Enclave identity / platform certificates  

### 🔹 Automatic Verification in SDKs
The Cube AI SDKs will automatically validate attestation before sending sensitive prompts.

### 🔹 UI Display of Attestation Status
The dashboard will show:
- Platform identity  
- Measurement hashes  
- Attestation freshness  

---

## Summary

Today:
- Attestation is **fully implemented internally**
- It protects Cube AI’s confidential computing environment from tampering
- It ensures all workloads run inside a trusted CVM
- It is **not yet exposed** to users

Future versions will add:
- User-downloadable attestation reports  
- SDK validation  
- Transparency features in the Cube AI UI  
- Full remote attestation workflows  

Confidential computing is foundational to Cube AI’s security, and attestation is a critical part of that foundation.
