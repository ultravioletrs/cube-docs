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
