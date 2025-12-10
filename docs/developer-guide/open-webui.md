---
id: open-webui
title: Open Web UI Integration
sidebar_position: 2
---

## Open Web UI Integration

Open Web UI is bundled with Cube AI to help monitor and debug LLM inference.
It provides insight into runtime performance such as:

- Response time
- Prompt and completion token counts
- Token throughput
- Model load duration

## Accessing Open Web UI

Once Cube AI is running, you can access the interface here:

[http://\<your-server-ip\>:3000](http://<your-server-ip>:3000)

## Common Error: `Ollama: 400 Bad Request`

If you see an error like:

```text
Ollama: 400, message='Bad Request'
