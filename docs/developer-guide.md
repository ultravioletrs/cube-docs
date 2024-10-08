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

You can log in using the administrator credentials.
