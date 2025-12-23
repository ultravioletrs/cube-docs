---
id: cvm-management
title: CVM Management
sidebar_position: 5
---

## Managing Confidential VMs

This guide explains how to start, monitor, and manage Confidential Virtual Machines (CVMs) for Cube AI using the Hardware Abstraction Layer (HAL) with Buildroot-based images and the provided management scripts.

:::info
This guide is specifically for HAL-based CVM deployments using Buildroot images. For public cloud deployments using cloud-init, please refer to the separate cloud deployment documentation.
:::

---

## Starting a CVM

Cube provides the `qemu.sh` script to launch CVMs with different confidential computing technologies.

### Prerequisites

Before starting a CVM, ensure the following files exist:

- Kernel image: `/etc/cube/bzImage`
- Root filesystem: `/etc/cube/rootfs.ext4`
- OVMF firmware: `/usr/share/ovmf/OVMF.fd` (for TDX/SEV-SNP)
- QEMU binary: `/usr/bin/qemu-system-x86_64`

### Starting a Standard QEMU VM

For testing without confidential computing features:

```bash
cd /path/to/cube/hal/buildroot
./qemu.sh start
```

This launches a standard KVM-accelerated VM with:

- 10GB RAM, 4 CPU cores
- Network port forwarding (SSH: 6190, HTTP: 6191, HTTPS: 6192)
- VirtIO networking and storage

### Starting an AMD SEV-SNP CVM

For AMD Secure Encrypted Virtualization:

```bash
./qemu.sh start_cvm
```

This enables SEV-SNP memory encryption with:

- Encrypted guest memory using `sev-snp-guest`
- Memory backend with private memfd
- vhost-vsock for secure guest-host communication

### Starting an Intel TDX CVM

For Intel Trust Domain Extensions:

```bash
./qemu.sh start_tdx
```

This launches a TDX-protected VM with:

- 20GB RAM, 16 CPU cores
- Intel TDX guest object for confidential computing
- Memory isolation and encrypted memory pages
- Full network port forwarding for all Cube AI services

**Port Mappings:**

- 6190 → 22 (SSH)
- 6191 → 80 (HTTP)
- 6192 → 443 (HTTPS)
- 6193 → 7001 (Cube Agent)
- 6194 → 11434 (Ollama)
- 6195 → 8000 (vLLM)

---

## CVM Monitor Script

The `cvm-monitor.sh` script provides automated health monitoring and restart capabilities for production deployments.

### What It Does

The monitor script:

- Continuously checks if the CVM is running
- Automatically restarts the CVM if it crashes or stops
- Logs all events and state changes
- Runs detached from the terminal for production use

### Configuration

Edit these variables at the top of `cvm-monitor.sh` to customize behavior:

```bash
VM_NAME="cube-ai-vm"              # VM identifier
CHECK_INTERVAL=30                 # Health check interval (seconds)
LOG_DIR="/tmp/cube-logs"          # Log file directory
QEMU_SCRIPT="/path/to/qemu.sh"    # Path to QEMU launch script
```

### Basic Usage

#### Start CVM Once

Launch the CVM without monitoring:

```bash
./cvm-monitor.sh start
```

#### Run Monitor in Foreground

Monitor the CVM interactively (Ctrl+C stops monitoring but leaves CVM running):

```bash
./cvm-monitor.sh daemon
```

#### Run Monitor in Background

Production mode - monitor runs detached in background:

```bash
./cvm-monitor.sh background
```

#### Stop CVM and Monitor

Stops both the CVM and any running monitors:

```bash
./cvm-monitor.sh stop
```

#### Check CVM Status

View current CVM state and process information:

```bash
./cvm-monitor.sh status
```

Example output:

```text
=== CVM Status ===
✓ Cube CVM is running
Cube CVM process:
12345 qemu-system-x86_64

PID file shows: 12345
Process 12345 is alive
```

#### View Monitor Logs

Tail the monitor log file in real-time:

```bash
./cvm-monitor.sh logs
```

#### Check System Requirements

Verify all dependencies and files are present:

```bash
./cvm-monitor.sh check
```

---

## Production Deployment Workflow

For production systems, use this recommended workflow:

### 1. Verify Requirements

```bash
./cvm-monitor.sh check
```

Ensure the output shows:

- ✓ Kernel image found
- ✓ Root filesystem found
- ✓ Certificates directory found
- ✓ QEMU binary found
- ✓ KVM support available

### 2. Start Monitor in Background

```bash
./cvm-monitor.sh background
```

This starts the CVM and enables auto-restart on failure.

### 3. Verify CVM is Running

```bash
./cvm-monitor.sh status
```

### 4. Monitor Logs

```bash
./cvm-monitor.sh logs
```

Press Ctrl+C to stop tailing logs (monitor continues running).

### 5. Access CVM Services

Connect to services via the forwarded ports:

```bash
# SSH into CVM
ssh -p 6190 user@localhost

# Access Ollama API
curl http://localhost:6194/api/tags
```

---

## Troubleshooting

### CVM Fails to Start

Check the monitor logs:

```bash
./cvm-monitor.sh logs
```

Common issues:

- Missing kernel or rootfs files
- Insufficient permissions on `/dev/kvm`
- Port conflicts (another process using 6190-6195)

**Solution:** Add user to `kvm` group:

```bash
sudo usermod -aG kvm $USER
newgrp kvm
```

### Monitor Doesn't Detect Running CVM

The monitor checks for:

- Process named `cube-ai-vm`
- QEMU running with `/etc/cube/bzImage` and `rootfs.ext4`

If detection fails, verify your QEMU launch uses these exact paths.

### CVM Keeps Restarting

Check logs for crash reasons:

```bash
tail -n 100 /tmp/cube-logs/cube-cvm-monitor.log
```

Common causes:

- Insufficient memory (TDX requires 20GB)
- CPU feature incompatibility
- Kernel or firmware issues

### Stopping All Processes

Force stop everything:

```bash
./cvm-monitor.sh stop
pkill -f qemu-system-x86_64
pkill -f cvm-monitor.sh
```

---

## Security Considerations

### Certificate Management

Certificates are embedded in the filesystem image at build time:

- Located at `/etc/cube/certs/` inside the CVM
- Cannot be updated without rebuilding the rootfs
- Measured as part of the trusted compute base

To update certificates, rebuild the Buildroot image with new certificate paths in the configuration.

### Network Isolation

CVMs use user-mode networking with port forwarding:

- Only specified ports are accessible from the host
- No direct network access to host resources
- DNS configured to use public resolvers (8.8.8.8)

### Memory Protection

TDX CVMs provide:

- Encrypted memory pages
- DMA protection
- Attestation capabilities for remote verification

---

## Advanced Configuration

### Custom Memory and CPU Allocation

Edit `qemu.sh` to adjust resources for `start_tdx`:

```bash
-m 20G -smp cores=16,sockets=1,threads=1
```

Increase memory and cores based on workload requirements.

### Additional Port Forwarding

Add more forwarded ports to the `-netdev` line:

```bash
-netdev user,id=nic0_td,hostfwd=tcp::6196-:8080,...
```

### Monitor Check Interval

Reduce or increase monitoring frequency by editing `CHECK_INTERVAL` in `cvm-monitor.sh`:

```bash
CHECK_INTERVAL=60  # Check every 60 seconds
```

---

## Next Steps

After starting your CVM:

- [Configure the Cube Agent](/developer-guide/hal)
- [Upload Private Models](/developer-guide/private-model-upload)
- [Test with the Chat UI](/developer-guide/chat-ui)
