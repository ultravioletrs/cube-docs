---
id: custom-model-deployment
title: Deploying Custom Models
sidebar_position: 6
---

## Deploying Custom Models with HAL and Cloud-Init

Cube AI supports deploying custom LLM models into Confidential VMs (CVMs) through two approaches: **Buildroot HAL images** and **Ubuntu cloud-init**. This guide covers both paths for Ollama and vLLM backends.

:::info
For basic model file transfer into a running CVM, see [Private Model Upload](/developer-guide/private-model-upload). This guide covers full deployment workflows including build-time configuration and automated provisioning.
:::

---

## Approach 1: Buildroot HAL (Build-Time)

The Buildroot HAL embeds model configuration directly into the CVM image. Models are pulled automatically on first boot based on settings configured during the build.

### Ollama Custom Models

#### Configure via Menuconfig

During HAL image configuration (see [HAL guide](/developer-guide/hal)), navigate to:

**Target packages → Cube packages → ollama**

Enable these options:

- **Install default models** — Pulls `llama3.2:3b`, `starcoder2:3b`, and `nomic-embed-text:v1.5` on first boot
- **Custom models to install** — Space-separated list of additional Ollama models

For example, to add `llama2:7b` and `mistral:7b`:

```
Custom models to install: llama2:7b mistral:7b codellama:13b
```

#### Configure via Defconfig

Alternatively, set models directly in the Buildroot defconfig or via `make menuconfig` save:

```bash
BR2_PACKAGE_OLLAMA_MODELS=y
BR2_PACKAGE_OLLAMA_CUSTOM_MODELS="llama2:7b mistral:7b codellama:13b"
```

Then rebuild the image:

```bash
make -j$(nproc)
```

#### How It Works

The Ollama package installs a model-pull script at `/usr/libexec/ollama/pull-models.sh` that runs after the Ollama service starts. The script retries each model pull up to 20 times with 5-second intervals, handling temporary network issues during boot.

#### GPU Support

Enable GPU acceleration in menuconfig under **ollama → Enable GPU support**, then select the GPU type:

- **NVIDIA GPU** — Requires NVIDIA drivers and CUDA
- **AMD GPU (ROCm)** — Requires ROCm drivers

### vLLM Custom Models

#### HuggingFace Models

Set the model identifier in menuconfig under **Target packages → Cube packages → vllm**:

- **Model to use** — HuggingFace model ID (e.g., `meta-llama/Llama-2-7b-hf`)
- **GPU Memory Utilization** — Fraction of GPU memory (default: `0.85`)
- **Maximum Model Length** — Max sequence length (default: `1024`)

Or via defconfig:

```bash
BR2_PACKAGE_VLLM_MODEL="meta-llama/Llama-2-7b-hf"
BR2_PACKAGE_VLLM_GPU_MEMORY="0.90"
BR2_PACKAGE_VLLM_MAX_MODEL_LEN="2048"
```

The model is downloaded from HuggingFace on first boot and cached at `/var/lib/vllm/`.

#### Local Model Files

To embed model files directly into the image instead of downloading them:

1. Set the **Custom model path** to a directory on your build machine containing the model files:

```bash
BR2_PACKAGE_VLLM_CUSTOM_MODEL_PATH="/path/to/local/model"
```

2. The build system copies the model files into `/var/lib/vllm/models/` in the image and automatically configures vLLM to use the local path.

### Cube Agent Backend Selection

The Cube Agent must be configured to point to the correct backend. In menuconfig under **Target packages → Cube packages → cube-agent → LLM Backend**:

| Backend | Target URL | When to Use |
| --- | --- | --- |
| Ollama | `http://localhost:11434` | Default, lightweight models |
| vLLM | `http://localhost:8000` | GPU-accelerated production workloads |
| Custom URL | User-defined | External or custom backend |

---

## Approach 2: Ubuntu Cloud-Init

The Ubuntu cloud-init approach uses a `user-data` configuration file to provision a VM with custom models during first boot. This is the recommended path for development and when using Ubuntu-based CVMs.

### Overview

The cloud-init script in `hal/ubuntu/qemu.sh` generates a full VM that:

1. Installs Ollama from the official installer
2. Builds the Cube Agent from source
3. Creates systemd services for both
4. Pulls configured models on first boot

### Customizing Models in Cloud-Init

Edit the `user-data` section in `hal/ubuntu/qemu.sh` to change which models are pulled.

#### Default Models

The default configuration pulls these models:

```yaml
write_files:
  - path: /usr/local/bin/pull-ollama-models.sh
    content: |
      #!/bin/bash
      for i in $(seq 1 60); do
        if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
          break
        fi
        sleep 2
      done
      /usr/local/bin/ollama pull tinyllama:1.1b
      /usr/local/bin/ollama pull starcoder2:3b
      /usr/local/bin/ollama pull nomic-embed-text:v1.5
    permissions: '0755'
```

#### Adding Custom Models

To deploy different models, modify the `pull-ollama-models.sh` content in the `write_files` section:

```yaml
write_files:
  - path: /usr/local/bin/pull-ollama-models.sh
    content: |
      #!/bin/bash
      for i in $(seq 1 60); do
        if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
          break
        fi
        sleep 2
      done
      # Default models
      /usr/local/bin/ollama pull tinyllama:1.1b
      # Custom models
      /usr/local/bin/ollama pull llama2:7b
      /usr/local/bin/ollama pull mistral:7b
      /usr/local/bin/ollama pull codellama:13b
    permissions: '0755'
```

#### Using a Custom Modelfile

To deploy a model from a custom Modelfile (for fine-tuned or customized models), add it to the `write_files` section and create it during `runcmd`:

```yaml
write_files:
  - path: /etc/cube/custom-model/Modelfile
    content: |
      FROM llama2:7b
      PARAMETER temperature 0.7
      PARAMETER top_p 0.9
      SYSTEM "You are a helpful coding assistant."
    permissions: '0644'

runcmd:
  # ... (after ollama is installed and running)
  - /usr/local/bin/ollama create my-custom-model -f /etc/cube/custom-model/Modelfile
```

#### Configuring the Cube Agent

The agent configuration is set via cloud-init in `/etc/cube/agent.env`:

```yaml
write_files:
  - path: /etc/cube/agent.env
    content: |
      UV_CUBE_AGENT_LOG_LEVEL=info
      UV_CUBE_AGENT_HOST=0.0.0.0
      UV_CUBE_AGENT_PORT=7001
      UV_CUBE_AGENT_INSTANCE_ID=cube-agent-01
      UV_CUBE_AGENT_TARGET_URL=http://localhost:11434
      UV_CUBE_AGENT_SERVER_CERT=/etc/cube/certs/server.crt
      UV_CUBE_AGENT_SERVER_KEY=/etc/cube/certs/server.key
      UV_CUBE_AGENT_SERVER_CA_CERTS=/etc/cube/certs/ca.crt
      UV_CUBE_AGENT_CA_URL=https://prism.ultraviolet.rs/am-certs
    permissions: '0644'
```

To use vLLM instead of Ollama, change the target URL:

```bash
UV_CUBE_AGENT_TARGET_URL=http://localhost:8000
```

### Launching the Cloud-Init VM

Run the script from the `hal/ubuntu/` directory:

```bash
cd cube/hal/ubuntu
sudo bash qemu.sh
```

The script:

1. Downloads the Ubuntu Noble cloud image (if not already present)
2. Creates a QCOW2 overlay disk
3. Generates a cloud-init seed image from the `user-data` configuration
4. Detects TDX support and launches the VM accordingly

**Port mappings:**

| Host Port | Guest Port | Service |
| --- | --- | --- |
| 6190 | 22 | SSH |
| 6191 | 80 | HTTP |
| 6192 | 443 | HTTPS |
| 6193 | 7001 | Cube Agent |

**TDX mode control:**

```bash
# Auto-detect (default)
sudo ENABLE_CVM=auto bash qemu.sh

# Force TDX
sudo ENABLE_CVM=tdx bash qemu.sh

# Disable CVM (regular VM)
sudo ENABLE_CVM=none bash qemu.sh
```

---

## Runtime Model Deployment

After a CVM is running (regardless of which approach was used to create it), you can deploy additional models at runtime.

### SSH into the CVM

```bash
# Buildroot CVM
ssh -p 6190 root@localhost

# Ubuntu cloud-init CVM
ssh -p 6190 ultraviolet@localhost
# Password: password
```

### Pull Ollama Models at Runtime

```bash
# List current models
ollama list

# Pull a new model
ollama pull llama2:7b

# Create a model from a Modelfile
cat > /tmp/Modelfile << 'EOF'
FROM llama2:7b
PARAMETER temperature 0.8
SYSTEM "You are a domain-specific assistant."
EOF
ollama create my-model -f /tmp/Modelfile

# Verify the model is available
ollama list
```

### Upload Model Files via SCP

For models not available in registries:

```bash
# From the host, copy model files into the CVM
scp -P 6190 model-weights.tar.gz root@localhost:~

# Inside the CVM, extract and register
tar -xzf model-weights.tar.gz
# For Ollama, copy to model directory
cp -r extracted-model /var/lib/ollama/models/
```

### Verify Model Availability

Test that the model is accessible through the Cube Agent:

```bash
# From the host
curl http://localhost:6193/v1/models

# Or make a chat completion request
curl http://localhost:6193/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:7b",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## Comparison of Deployment Approaches

| Feature | Buildroot HAL | Cloud-Init (Ubuntu) |
| --- | --- | --- |
| Base OS | Minimal Buildroot Linux | Ubuntu Noble |
| Image size | Small (~hundreds of MB) | Larger (~GB+) |
| Build time | ~1 hour | Minutes (download-based) |
| Model config | Build-time via menuconfig | Cloud-init user-data |
| Model pull | On first boot (auto) | On first boot (auto) |
| Customization | Requires rebuild | Edit user-data file |
| GPU support | Via Buildroot packages | Via Ubuntu packages |
| Best for | Production, minimal images | Development, rapid iteration |
| TEE support | AMD SEV-SNP, Intel TDX | Intel TDX |
| Init system | SysV or systemd | systemd |

---

## Troubleshooting

### Models Fail to Pull on Boot

Check network connectivity inside the CVM:

```bash
# Test DNS resolution
ping -c 1 ollama.com

# Check Ollama service status
systemctl status ollama
# or
/etc/init.d/S96ollama status
```

For Buildroot images, the pull script retries 20 times. Check the logs:

```bash
journalctl -u ollama -f
```

### Ollama Reports Insufficient Disk Space

The default Buildroot rootfs is limited in size. Increase it during the build:

```bash
# In menuconfig: Filesystem images → ext4 root filesystem → size
# Or in defconfig:
BR2_TARGET_ROOTFS_EXT2_SIZE="30G"
```

For cloud-init VMs, the disk is controlled by `DISK_SIZE` in `qemu.sh` (default: `35G`).

### vLLM Fails to Load Model

Verify GPU is available and the model fits in memory:

```bash
# Check GPU
nvidia-smi

# Check vLLM config
cat /etc/vllm/vllm.env

# Restart with adjusted settings
systemctl restart vllm
```

### Agent Cannot Reach Backend

Verify the backend service is running and the agent's target URL matches:

```bash
# Check agent config
cat /etc/cube/agent.env

# Test backend directly
curl http://localhost:11434/api/tags   # Ollama
curl http://localhost:8000/v1/models   # vLLM

# Restart agent
systemctl restart cube-agent
```
