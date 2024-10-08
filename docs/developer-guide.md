# Developer Guide

This guide will help you get started with developing, deploying, and running Cube AI.

## Cloning the Repository

In order to pull Cube AI Docker images and code from GitHub, you will need to generate a personal access token. Make sure to grant the following permissions to the token:

- **`repo`**: Full control of private repositories (to clone and pull private code).
- **`read:packages`**: Download and install Docker images from the GitHub Container Registry.

Follow [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to create a token with these permissions.

Once you have the token, log in to the Docker registry:

```bash
docker login ghcr.io
```

- **Username**: Your GitHub username
- **Password**: The personal access token you generated.

Clone the repository:

```bash
git clone https://github.com/ultravioletrs/cube.git
```

Use your GitHub username and the personal access token when prompted for credentials.

## Pulling Pre-built Docker Images

To pull all necessary Docker images for Cube AI from the container registry, use the following command:

```bash
cd cube/docker
docker compose pull
```

## Building Docker Images

The Docker images for Cube AI can be built using the following commands in the project's root directory:

1. **Build the Cube Proxy image**:
   Navigate to the `proxy` directory and run:

   ```bash
   cd proxy
   make latest
   ```

2. **Building development Docker images**:
   For a development build of the Docker images, use the following command:

   ```bash
   make docker-dev
   ```

## Running Services with Docker Compose

To run the Cube AI services using Docker Compose, ensure you have your environment variables set in the `docker/.env` file and run:

```bash
docker-compose up -d
```

This will start up all the core services such as NATS, Jaeger, SpiceDB, Auth, Users, Invitations, and the Cube UI.

To properly access Cube AI UI locally, you need to update the IP address entries in `docker/.env` to point to your server IP address. Replace the following entries as follows:

```bash
UV_CUBE_UI_BASE_URL=http://localhost:3001
UV_CUBE_NEXTAUTH_URL=http://localhost:3001/api/auth
UV_CUBE_PUBLIC_BASE_URL=http://localhost:3001
```

The Cube AI UI can then be accessed through your browser at:

```bash
http://localhost:3001
```

## Hardware Abstraction Layer (HAL) for Confidential Computing

For detailed instructions on setting up and building Cube HAL, please refer to the [HAL Buildroot README](https://github.com/ultravioletrs/cube/blob/d995e64e43eeb51cb0c50481cc9bbc0e619e3a6d/buildroot/linux/README.md). This document covers:

- Cloning the Buildroot and Cube repositories
- Configuring and building Cube HAL
- Running Cube HAL in a virtual machine

## Cleaning up your Dockerized Cube AI Setup

If you want to stop and remove the Cube AI services, volumes, and networks created during the setup, follow these steps:

### Stop and Remove Running Containers

First, stop all running containers:

```bash
docker-compose down
```

### Remove Volumes and Networks

```bash
docker-compose down --volumes --remove-orphans
```

### Remove Images (Optional)

If you also want to remove the Docker images you pulled or built, run:

```bash
docker rmi $(docker images -q ghcr.io/ultravioletrs/cube/*)
```

### Clean Build Artifacts

To clean up the build artifacts and remove compiled files, use:

```bash
make clean
```
