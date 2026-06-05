---
id: cloud-init
title: Cloud-Init
sidebar_position: 5
---

## Cloud-Init

Cube AI can be deployed on standard Ubuntu cloud images using [cloud-init](https://cloud-init.io/) for automated provisioning. This approach uses a pre-built Ubuntu base image and configures the Cube AI stack (Cube Agent, Ollama, TLS certificates) at first boot via cloud-init user-data.

:::info
This guide covers the cloud-init based deployment using Ubuntu. For building minimal custom images from source, see the [HAL](/developer-guide/hal) guide.
:::

## Overview

The cloud-init approach provisions a standard Ubuntu Noble (24.04) cloud image with:

- Cube Agent built from source at first boot
- Ollama LLM backend installed via official installer
- Self-signed TLS certificates for mTLS
- Systemd services for Cube Agent and Ollama
- Default LLM models pulled in the background
- Support for Intel TDX confidential VMs

## Cloud-Init vs Buildroot

| Aspect | Cloud-Init (Ubuntu) | Buildroot (HAL) |
| --- | --- | --- |
| Base image | Ubuntu Noble cloud image | Custom minimal Linux |
| Build time | Minutes (downloads pre-built image) | ~1 hour (compiles everything from source) |
| Agent install | Built from source at first boot | Pre-compiled into the image |
| Internet required | Yes, at first boot | No, fully self-contained |
| Image size | Larger (full Ubuntu) | Minimal |
| Best for | Development and cloud deployments | Production and embedded deployments |

## Prerequisites

Before running the cloud-init deployment, ensure you have:

- A Linux host machine with KVM support
- At least 35GB free disk space
- QEMU installed (`qemu-system-x86_64`)
- `cloud-image-utils` package (provides `cloud-localds`)
- `wget` for downloading the base image
- OVMF firmware (`/usr/share/OVMF/OVMF_CODE.fd` and `OVMF_VARS.fd`)

Install dependencies on Ubuntu/Debian:

```bash
sudo apt-get install qemu-system-x86 cloud-image-utils wget ovmf
```

## Steps

### 1. Clone the Cube Repository

```bash
git clone https://github.com/ultravioletrs/cube.git
cd cube/hal/ubuntu
```

### 2. Launch the VM

The `qemu.sh` script automates the entire process — downloading the Ubuntu base image, generating cloud-init configuration, creating the seed image, and launching QEMU:

```bash
sudo ./qemu.sh
```

The script performs the following:

1. Downloads the Ubuntu Noble server cloud image (if not already cached)
2. Creates a QCOW2 overlay image with 35GB disk
3. Generates cloud-init user-data and meta-data
4. Creates a seed ISO image with `cloud-localds`
5. Detects TDX support and configures QEMU accordingly
6. Launches the VM

### 3. First Boot Provisioning

On first boot, cloud-init automatically:

1. Creates the `ultraviolet` user with sudo access
2. Creates the `ollama` system user
3. Installs packages: `curl`, `git`, `golang-go`, `build-essential`
4. Generates TLS certificates (CA, server, and client certificates for mTLS)
5. Installs Ollama from the official installer
6. Clones the Cube repository and builds the agent from source
7. Starts Ollama and Cube Agent systemd services
8. Pulls default LLM models in the background (`llama3.2:3b`, `starcoder2:3b`, `nomic-embed-text:v1.5`)

:::note
First boot provisioning takes several minutes as it installs packages, builds the Cube Agent, and pulls LLM models. You can monitor progress via the console output or check `/var/log/cloud-init-output.log` inside the VM.
:::

### 4. Access the VM

Once the VM is running, connect via SSH:

```bash
ssh -p 6190 ultraviolet@localhost
```

Default credentials:

- **Username:** `ultraviolet`
- **Password:** `password`

### 5. Verify Services

Check that both services are running:

```bash
systemctl status cube-agent.service
systemctl status ollama.service
```

Check model pull progress:

```bash
tail -f /var/log/ollama-pull.log
```

## Configuration

### Cloud-Init User-Data

The cloud-init configuration is embedded in `qemu.sh` as a heredoc. It uses the standard `#cloud-config` format with the following sections:

**Users:**

```yaml
users:
  - name: ultraviolet
    plain_text_passwd: password
    lock_passwd: false
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
  - name: ollama
    system: true
    home: /var/lib/ollama
    shell: /usr/sbin/nologin
```

**Cube Agent Environment** (`/etc/cube/agent.env`):

```bash
UV_CUBE_AGENT_LOG_LEVEL=info
UV_CUBE_AGENT_HOST=0.0.0.0
UV_CUBE_AGENT_PORT=7001
UV_CUBE_AGENT_INSTANCE_ID=cube-agent-01
UV_CUBE_AGENT_TARGET_URL=http://localhost:11434
UV_CUBE_AGENT_SERVER_CERT=/etc/cube/certs/server.crt
UV_CUBE_AGENT_SERVER_KEY=/etc/cube/certs/server.key
UV_CUBE_AGENT_SERVER_CA_CERTS=/etc/cube/certs/ca.crt
UV_CUBE_AGENT_CA_URL=https://prism.ultraviolet.rs/am-certs
```

To modify agent configuration, edit the `write_files` section for `/etc/cube/agent.env` in `qemu.sh` before launching, or edit `/etc/cube/agent.env` inside the VM and restart the service:

```bash
sudo systemctl restart cube-agent.service
```

### TLS Certificates

Cloud-init generates self-signed certificates at first boot:

| File | Description |
| --- | --- |
| `/etc/cube/certs/ca.key` / `ca.crt` | CA private key and certificate |
| `/etc/cube/certs/server.key` / `server.crt` | Server key and certificate (for Cube Agent) |
| `/etc/cube/certs/client.key` / `client.crt` | Client key and certificate (for mTLS) |

Key files are set to `600` permissions, certificates to `644`.

For production deployments, replace these with certificates from a trusted CA or configure the `UV_CUBE_AGENT_CA_URL` to fetch certificates at runtime from the [Certs Service](https://github.com/absmach/certs).

### VM Resources

The default VM resources are defined at the top of `qemu.sh`:

| Parameter | Default | Description |
| --- | --- | --- |
| `DISK_SIZE` | `35G` | Disk size for the QCOW2 image |
| `RAM` | `16384M` | VM memory allocation |
| `CPU` | `8` | Number of vCPUs |

Modify these variables in `qemu.sh` before launching to adjust resources.

## CVM Support

### Intel TDX

The script auto-detects Intel TDX support on the host. TDX mode can be controlled via the `ENABLE_CVM` environment variable:

```bash
# Auto-detect (default)
sudo ENABLE_CVM=auto ./qemu.sh

# Force TDX mode
sudo ENABLE_CVM=tdx ./qemu.sh

# Disable CVM (regular VM)
sudo ENABLE_CVM=none ./qemu.sh
```

When TDX is enabled, the script:

- Configures memory backend with `memfd` and `share=true`
- Adds the `tdx-guest` object with quote generation socket (vsock port 4050, CID 2)
- Uses `q35` machine with `confidential-guest-support=tdx0`
- Enables IOMMU platform for virtio devices
- Installs a TDX-capable kernel from the Ubuntu `kobuk-team/intel-tdx` PPA

### Port Forwarding

The VM exposes services via QEMU port forwarding:

| Host Port | Guest Port | Service |
| --- | --- | --- |
| `6190` | `22` | SSH |
| `6191` | `80` | HTTP |
| `6192` | `443` | HTTPS |
| `6193` | `7001` | Cube Agent API |

## Post-Boot Setup

### Local Development

For local development with the Cube UI, update `docker/.env` with the VM's IP address:

```bash
UV_CUBE_NEXTAUTH_URL=http://<vm-ip-address>:${UI_PORT}
```

### Adding Custom Models

Pull additional models inside the VM:

```bash
ollama pull <model-name>
```

## Next Steps

- [Manage CVMs](/developer-guide/cvm-management) - Start, monitor, and manage confidential VMs
- [Upload Private Models](/developer-guide/private-model-upload) - Add custom models to your CVM
- [Test with Chat UI](/developer-guide/chat-ui) - Interact with models through the web interface
