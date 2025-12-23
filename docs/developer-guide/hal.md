---
id: hal
title: Hardware Abstraction Layer (HAL)
sidebar_position: 4
---

## Hardware Abstraction Layer (HAL)

Cube HAL provides the confidential-computing runtime environment for Cube AI using Buildroot to create custom Linux images optimized for confidential computing.

:::info
This guide covers HAL image creation using Buildroot. For managing already-built HAL images and CVMs, see the [CVM Management](/developer-guide/cvm-management) guide.
:::

## Overview

The HAL uses Buildroot to create a minimal Linux environment that includes:

- Linux kernel optimized for confidential computing
- Cube Agent for secure workload management
- Required runtime dependencies (Ollama, vLLM, etc.)
- Embedded certificates and configuration
- Support for Intel TDX and AMD SEV-SNP

## Prerequisites

Before building HAL images, ensure you have:

- A Linux development machine with at least 20GB free disk space
- Build essentials (`build-essential`, `gcc`, `make`, etc.)
- Git for cloning repositories
- Sufficient RAM (8GB+ recommended for parallel builds)

## Steps

### 1. Clone Repositories

Clone the Cube HAL repository and its Buildroot submodule:

```bash
git clone https://github.com/ultravioletrs/cube-hal.git
cd cube-hal
git submodule update --init --recursive
```

### 2. Configure Buildroot for HAL Image

Buildroot configuration defines which packages, kernel options, and system settings are included in the final image.

#### Load HAL Configuration

Navigate to the Buildroot directory and load the Cube-specific configuration:

```bash
cd buildroot
make cube_defconfig
```

This loads the pre-configured settings optimized for Cube AI confidential computing.

#### Customize Configuration (Optional)

To modify the configuration, use Buildroot's menu interface:

```bash
make menuconfig
```

Navigate to `Target packages` → `Cube packages` → `cube-agent` to configure the Cube Agent settings:

![Cube Agent Configuration](/img/buildroot-cube-agent-config.png)
*Cube Agent configuration in Buildroot menuconfig showing all available settings*

**Key Cube Agent Configuration Options:**

- **cube-agent** - Enable the Cube Agent package (must be checked)
- **Agent Instance ID** - Unique identifier for this agent instance (e.g., `cube-agent-01`)
- **Agent Host** - Network interface to bind to (typically `0.0.0.0` for all interfaces)
- **Agent Port** - Port for agent API (default: `7001`)
- **Log Level** - Logging verbosity: `debug`, `info`, `warn`, or `error`
- **LLM Backend** - Choose between `Ollama` or `vLLM` for model inference
- **Agent OS Build** - OS build identifier (e.g., `UVC`)
- **Agent OS Distro** - Distribution name (e.g., `UVC`)
- **Agent OS Type** - OS type identifier (e.g., `UVC`)
- **Agent VMPL** - VM Privilege Level for SEV-SNP (typically `2`)
- **Agent CA URL** - URL of the Certificate Authority for obtaining certificates (leave empty if using pre-embedded certs)
- **Enable Attested TLS** - Enable mutual TLS with attestation (recommended for production)
- **Server CA Certificates File** - Path to CA certificate file (default: `/etc/cube/certs/ca.pem`)
- **Server Certificate File** - Path to server certificate (default: `/etc/cube/certs/server.crt`)
- **Server Key File** - Path to server private key (default: `/etc/cube/certs/server.key`)
- **Client CA Certificates File** - Path to client CA certificates (default: `/etc/cube/certs/client_ca.pem`)
- **Certs Token** - Authentication token for certificate operations (required if using CA URL)
- **CVM ID** - Confidential VM identifier (optional, auto-generated if empty)

**Ollama Configuration:**

- **ollama** - Ollama package dependency (automatically required when selected as LLM backend)
- **Install default models** - Pre-install common models during build
- **Custom models to install** - Specify additional models to include (comma-separated)
- **Enable GPU support** - Enable GPU acceleration (requires compatible hardware)

**Important Notes:**

- If **Agent CA URL** is configured, the agent will fetch certificates from the CA at runtime using the **Certs Token** for authentication
- If **Agent CA URL** is empty, certificates must be pre-embedded in the filesystem overlay at `/etc/cube/certs/`
- The **Certs Token** is required when using a CA URL and should be treated as sensitive credential
- Certificate paths are baked into the image and measured as part of the attestation process

#### Save Configuration

After customizing, save the configuration:

```bash
make savedefconfig
```

This updates the defconfig file with your changes.

### 3. Build the Image

Start the Buildroot build process:

```bash
make -j$(nproc)
```

**Build Time:** Expect 30-60 minutes for a full build depending on your system.

**Output Files:**

- Kernel: `output/images/bzImage`
- Root filesystem: `output/images/rootfs.ext4`
- Firmware: OVMF files for UEFI boot

These files are used by the CVM management scripts to launch confidential VMs.

### 4. Deploy Built Images

Copy the built images to the expected locations:

```bash
sudo mkdir -p /etc/cube
sudo cp output/images/bzImage /etc/cube/
sudo cp output/images/rootfs.ext4 /etc/cube/
```

### 5. Boot Inside an SEV-SNP CVM

Use the provided scripts to launch a CVM with your HAL image:

```bash
# For AMD SEV-SNP
./qemu.sh start_cvm

# For Intel TDX
./qemu.sh start_tdx
```

See the [CVM Management](/developer-guide/cvm-management) guide for detailed CVM launch and monitoring instructions.

### 6. Run the Cube AI Stack

Once the CVM boots, the Cube AI stack should start automatically via systemd services. Connect to verify:

```bash
# SSH into the CVM
ssh -p 6190 root@localhost

# Check Cube Agent status
systemctl status cube-agent

# Verify Ollama is running
curl http://localhost:11434/api/tags
```

## Updating HAL Images

To update the HAL image with new certificates, packages, or configurations:

1. Update the overlay directory: `cube-hal/overlay/`
2. Modify Buildroot configuration if needed: `make menuconfig`
3. Rebuild: `make -j$(nproc)`
4. Redeploy the new images to `/etc/cube/`
5. Restart CVMs to use the updated image

## Troubleshooting

### Build Fails with Missing Dependencies

Install required build tools:

```bash
sudo apt-get update
sudo apt-get install build-essential gcc make git bc cpio \
    unzip rsync wget python3 libncurses-dev
```

### Kernel Build Errors

Ensure kernel configuration is compatible with your target platform (TDX or SEV-SNP). Check `configs/kernel-config` for required options.

### Out of Disk Space

Buildroot builds require significant space. Clean previous builds:

```bash
make clean
```

Or start fresh:

```bash
make distclean
make cube_defconfig
```

## Next Steps

- [Manage CVMs](/developer-guide/cvm-management) - Learn to start, monitor, and manage CVMs
- [Upload Private Models](/developer-guide/private-model-upload) - Add custom models to your CVM
- [Test with Chat UI](/developer-guide/chat-ui) - Interact with models through the web interface
