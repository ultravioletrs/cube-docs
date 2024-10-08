# Developer Guide

This guide will help you get started with developing, deploying, and running Cube AI.

## Cloning the Repository

In order to pull Cube AI Docker images and code from GitHub, you will need to generate a personal access token. Make sure to grant the following permissions to the token:

- **`repo`**: Full control of private repositories (to clone and pull private code).
- **`read:packages`**: Download and install Docker images from the GitHub Container Registry.

Follow [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to create a token with these permissions.

Once you have the token, follow the instructions provided in [this guide](https://github.com/ultravioletrs/cube/blob/main/hal/ubuntu/README.md) to:

- Clone Cube AI repository
- Pull pre-built Cube AI Docker images
- Start Cube AI Docker containers

## Building Docker Images

Once you have cloned the repository and pulled the necessary Docker images, you can build the Docker images for Cube AI using the following commands in the project's root directory:

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

After pulling the Docker images and setting up your environment, you can run the Cube AI services using Docker Compose as described in [this guide](https://github.com/ultravioletrs/cube/blob/main/hal/ubuntu/README.md).

To properly access Cube AI UI deployed on a different server, update the IP address entries in `docker/.env` to point to your server IP address. The Cube AI UI can then be accessed through your browser at:

```bash
http://<your-server-ip-address>:3001
```

For example, if you have deployed locally, use:

```bash
http://localhost:3001
```

## Hardware Abstraction Layer (HAL) for Confidential Computing

For detailed instructions on setting up and building Cube HAL, please refer to [this guide](https://github.com/ultravioletrs/cube/blob/d995e64e43eeb51cb0c50481cc9bbc0e619e3a6d/buildroot/linux/README.md). It covers:

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
