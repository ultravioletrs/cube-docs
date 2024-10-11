# Developer Guide

This guide will help you get started with developing, deploying, and running Cube AI.

## Cloning the Repository

```bash
git clone https://github.com/ultravioletrs/cube.git
cd cube
```

## Pulling Docker Images

```bash
cd cube/docker/
docker compose pull
```

## Running Services with Docker Compose

You can run/start Cube AI services using Docker Compose as described in [this guide](https://github.com/ultravioletrs/cube/blob/main/hal/ubuntu/README.md).

To properly access Cube AI UI deployed on a different server, update the IP address entries in `docker/.env` as described in the above guide to point to your server IP address. The Cube AI UI can then be accessed through your browser at:

```bash
http://<your-server-ip-address>:3001
```

For example, if you have deployed locally, use:

```bash
http://localhost:3001
```

## Open Web UI Integration

Open Web UI is integrated into Cube AI to help in debugging and monitoring key performance metrics of the models, including response token/s, prompt token/s, total duration, and load duration. For more detailed setup and configuration instructions, refer to the [Open Web UI documentation](https://docs.openwebui.com/).

To access Open Web UI, once Cube AI services are up and running, open your browser and navigate to:

```bash
http://<your-server-ip-address>:3000
```

While it should work out of the box, occasionally, when you submit a prompt through the Open Web UI, you might encounter an error like this:

```bash
Ollama: 400, message='Bad Request', url='http://ollama:11434/api/chat'
```

To resolve the error:

- Click on your **profile icon** in the top-right corner of the Open Web UI interface.
- Navigate to **Settings**.
- Select **Admin Settings**.
- In the **Admin Panel**, select **Connections** from the sidebar.
- Under the **Ollama API** section, click the **refresh** icon next to the Ollama API URL (`http://ollama:11434`).
- After refreshing, you should see a confirmation message stating **"Server connection verified"**. This should reset the connection to the Ollama service and resolve the "Bad Request" error.

## Building Docker Images

You can build the Docker images for Cube AI and related services using the `make` command in the project's root directory.

To build the production Docker image, use:

```bash
make docker
```

For the development Docker image, use:

```bash
make docker-dev
```

## Hardware Abstraction Layer (HAL) for Confidential Computing

For detailed instructions on setting up and building Cube HAL, please refer to [this guide](https://github.com/ultravioletrs/cube/blob/main/hal/buildroot/README.md). It covers:

- Cloning the Buildroot and Cube repositories
- Configuring and building Cube HAL
- Running Cube HAL in a virtual machine

## Cleaning up your Dockerized Cube AI Setup

If you want to stop and remove the Cube AI services, volumes, and networks created during the setup, follow these steps:

First, stop all running containers:

```bash
docker compose down
```

Remove volumes and vetworks:

```bash
docker compose down --volumes --remove-orphans
```

To clean up the build artifacts and remove compiled files, use:

```bash
make clean
```
