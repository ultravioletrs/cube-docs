---
id: attestation
title: Attestation
sidebar_position: 4
---

# Attestation

Attestation is a process of verifying the integrity and authenticity of software or hardware components. In the context of Cube AI, attestation is used to verify the integrity of the Cube AI API and the Ollama instances.

## Runtime Encryption

Cube AI runs inside AMD SEV-SNP based confidential virtual machines (CVMs). The CVMs are secured using AMD SEV-SNP, which provides a secure enclave for running applications. With SEV-SNP, the memory of the CVM is encrypted, ensuring that the data is not accessible to the host operating system or other applications running on the host. This ensures that the data is not accessible to unauthorized users. The encryption keys are generated using a hardware-based key management system, ensuring that the keys are not accessible to unauthorized users. Even if an attacker gains access to the hypervisor, they will not be able to read the encrypted data or access the encryption keys.
