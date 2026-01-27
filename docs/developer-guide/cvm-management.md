---
id: cvm-management
title: CVM Management
sidebar_position: 5
---

## Managing Confidential VMs

This guide explains how to start, monitor, and manage Confidential Virtual Machines (CVMs) for Cube AI using the Hardware Abstraction Layer (HAL) with Buildroot-based images and the provided management scripts.

:::info
This guide is specifically for CVM deployments using Buildroot images. For public cloud deployments using cloud-init, please refer to the separate cloud deployment documentation instead.
:::

---

## Starting a CVM

Cube provides the `qemu.sh` script to launch CVMs with different confidential computing technologies. The script wraps the full QEMU invocation so you do not have to assemble or remember long command lines for each hardware-backed mode.

### Prerequisites

Before starting a CVM, ensure the following files exist. These are the default paths the scripts expect, so missing files here will cause launch or monitor checks to fail.

- Kernel image: `/etc/cube/bzImage`
- Root filesystem: `/etc/cube/rootfs.ext4`
- OVMF firmware: `/usr/share/ovmf/OVMF.fd` (for TDX/SEV-SNP)
- QEMU binary: `/usr/bin/qemu-system-x86_64`

### Starting a Standard QEMU VM

For testing without confidential computing features, use the standard VM mode. This helps confirm that your base image, kernel, and networking all work before adding enclave-specific requirements.

```bash
cd /path/to/cube/hal/cloud
./qemu.sh start
```

This launches a standard KVM-accelerated VM with the following defaults. These settings are intended to be a reasonable baseline for development and smoke testing.

- 10GB RAM, 4 CPU cores
- Network port forwarding (SSH: 6190, Agent: 6193)
- VirtIO networking and storage

### Starting an AMD SEV-SNP CVM

For AMD Secure Encrypted Virtualization, use the SEV-SNP launch path. This mode enables hardware-backed memory protection for the guest.

```bash
./qemu.sh start_sev
```

This enables SEV-SNP memory encryption with the following configuration details. The settings align with typical SNP requirements for encrypted guest memory.

- Encrypted guest memory using `sev-snp-guest`
- Memory backend with private memfd
- vhost-vsock for secure guest-host communication

### Starting an Intel TDX CVM

For Intel Trust Domain Extensions, use the TDX launch path. This mode creates a trust domain for the guest and applies TDX-specific isolation.

```bash
./qemu.sh start_tdx
```

This launches a TDX-protected VM with the following defaults. The higher resource allocation is intended to support the services that ship with Cube AI.

- 20GB RAM, 16 CPU cores
- Intel TDX guest object for confidential computing
- Memory isolation and encrypted memory pages
- Full network port forwarding for all Cube AI services

**Port Mappings:** These host ports forward into the CVM so you can reach services from the host without additional networking setup.

- 6190 → 22 (SSH)
- 6193 → 7001 (Cube Agent)

---

## CVM Monitor Script

The `cvm-monitor.sh` script provides automated health monitoring and restart capabilities for production deployments. It is designed to keep the CVM running without manual intervention.

### What It Does

The monitor script does the following. Together, these actions keep the VM available and provide basic observability for troubleshooting.

- Continuously checks if the CVM is running
- Automatically restarts the CVM if it crashes or stops
- Logs all events and state changes
- Runs detached from the terminal for production use

### Configuration

Edit these variables at the top of `cvm-monitor.sh` to customize behavior. Small changes here control how frequently the monitor checks the VM and where it writes logs.

```bash
VM_NAME="cube-ai-vm"                        # VM identifier
CHECK_INTERVAL=30                           # Health check interval (seconds)
LOG_DIR="/tmp/cube-logs"                    # Log file directory
QEMU_SCRIPT="/path/to/cube/hal/cloud/qemu.sh"  # Path to QEMU launch script
```

### Basic Usage

#### Start CVM Once

Launch the CVM without monitoring. This is useful if you only want a one-off run and do not need automatic restarts.

```bash
./cvm-monitor.sh start
```

#### Run with Background Monitor

Production mode - start CVM with monitor running detached in background. Use this when you want the monitor to persist across terminal sessions and auto-restart the CVM on failure.

```bash
./cvm-monitor.sh start -d
```

#### Stop CVM and Monitor

Stops both the CVM and any running monitors. This is the clean shutdown path for both the VM and the monitor process.

```bash
./cvm-monitor.sh stop
```

#### Check CVM Status

View current CVM state and process information. This command reports whether the VM is running and what PID the monitor sees.

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

Tail the monitor log file in real-time. This is the fastest way to see restarts or error messages as they occur.

```bash
./cvm-monitor.sh logs
```

#### Check System Requirements

Verify all dependencies and files are present. This performs the same checks the monitor relies on before launching a VM.

```bash
./cvm-monitor.sh check
```

---

## Production Deployment Workflow

For production systems, use this recommended workflow. It ensures that prerequisites are validated and monitoring is enabled from the start.

### 1. Verify Requirements

```bash
./cvm-monitor.sh check
```

Ensure the output shows all of the expected checks passing. Each item corresponds to a required file or capability.

- ✓ Kernel image found
- ✓ Root filesystem found
- ✓ Certificates directory found
- ✓ QEMU binary found
- ✓ KVM support available

### 2. Start CVM with Monitor

```bash
./cvm-monitor.sh start -d
```

This starts the CVM and enables auto-restart on failure. Once running, the monitor will continue to manage the process in the background.

### 3. Verify CVM is Running

```bash
./cvm-monitor.sh status
```

### 4. Monitor Logs

```bash
./cvm-monitor.sh logs
```

Press Ctrl+C to stop tailing logs; the monitor continues running. This lets you exit the log view without disrupting the VM.

### 5. Access CVM Services

Connect to services via the forwarded ports. These examples assume the default host-to-guest port mappings.

```bash
# SSH into CVM
ssh -p 6190 user@localhost

# Access Cube Agent API
curl http://localhost:6193/health
```

---

## Troubleshooting

### CVM Fails to Start

Check the monitor logs first. The log often includes the exact failure point and reason.

```bash
./cvm-monitor.sh logs
```

Common issues include the following. Each one typically prevents QEMU from starting or keeping the VM alive.

- Missing kernel or rootfs files
- Insufficient permissions on `/dev/kvm`
- Port conflicts (another process using 6190 or 6193)

**Solution:** Add user to `kvm` group. This grants permission to access KVM acceleration devices.

```bash
sudo usermod -aG kvm $USER
newgrp kvm
```

### Monitor Doesn't Detect Running CVM

The monitor checks for these signals to decide if the VM is running. If any check does not match, it will report the VM as down.

- Process named `cube-ai-vm`
- QEMU running with `/etc/cube/bzImage` and `rootfs.ext4`

If detection fails, verify your QEMU launch uses these exact paths. The monitor will not infer alternate paths or filenames.

### CVM Keeps Restarting

Check logs for crash reasons. This usually points to a configuration mismatch or missing host capability.

```bash
tail -n 100 /tmp/cube-logs/cube-cvm-monitor.log
```

Common causes include the following. These are frequent sources of repeated restarts.

- Insufficient memory (TDX requires 20GB)
- CPU feature incompatibility
- Kernel or firmware issues

### Stopping All Processes

Force stop everything. This is a last resort and should be used if the monitor or VM is unresponsive.

```bash
./cvm-monitor.sh stop
pkill -f qemu-system-x86_64
pkill -f cvm-monitor.sh
```

---

## Security Considerations

### Certificate Management

Certificates can be rotated on a running CVM by connecting via SSH, regenerating the certificates, and restarting the relevant services.

- Located at `/etc/cube/certs/` inside the CVM
- Can be updated by SSH into the VM and regenerating certs
- Restart services after certificate rotation to apply changes

### Network Isolation

CVMs use user-mode networking with port forwarding. This keeps the network surface narrow and predictable from the host side.

- Only specified ports are accessible from the host
- No direct network access to host resources
- DNS configured to use public resolvers (8.8.8.8)

### Memory Protection

TDX CVMs provide the following protections. These capabilities are part of the hardware-backed TDX feature set.

- Encrypted memory pages
- DMA protection
- Attestation capabilities for remote verification

---

## Advanced Configuration

### Custom Memory and CPU Allocation

Edit `qemu.sh` to adjust resources for `start_tdx`. This is the primary way to tune performance characteristics of the VM.

```bash
-m 20G -smp cores=16,sockets=1,threads=1
```

Increase memory and cores based on workload requirements. Heavier models or more concurrent traffic will typically need more resources.

### Additional Port Forwarding

Add more forwarded ports to the `-netdev` line. Keep the existing ports intact and append new ones as needed.

```bash
-netdev user,id=nic0_td,hostfwd=tcp::6196-:8080,...
```

### Monitor Check Interval

Reduce or increase monitoring frequency by editing `CHECK_INTERVAL` in `cvm-monitor.sh`. Shorter intervals check more often but create more log activity.

```bash
CHECK_INTERVAL=60  # Check every 60 seconds
```

---

## Next Steps

After starting your CVM, continue with these follow-on guides to configure services and validate functionality:

- [Configure the Cube Agent](/developer-guide/hal)
- [Upload Private Models](/developer-guide/private-model-upload)
- [Test with the Chat UI](/developer-guide/chat-ui)
