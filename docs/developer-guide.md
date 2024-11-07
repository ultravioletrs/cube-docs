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

## Customizing and Building the `cube-ai` UI Image

This guide covers the steps required to customize the `cube-ai` UI, build a Docker image for it, and push it to GitHub Container Registry (GHCR).

### Prerequisites

- Access to the private `magistrala-ui-new` GitHub repository.
- A GitHub Personal Access Token (PAT) with the necessary permissions to push images to `ghcr.io`.

### Required GitHub PAT Permissions

For publishing images to GHCR, the PAT should have the following permissions:

- **write:packages** – To upload and publish package versions.
- **read:packages** – To download and install packages.
- **delete:packages** – To delete packages (if cleanup is required).
- **repo** – Full control of private repositories (required for accessing private repos).

### Step 1: Clone the `magistrala-ui-new` Repository

First, clone the private `magistrala-ui-new` repository, which contains the UI source code:

```bash
git clone https://github.com/absmach/magistrala-ui-new.git
cd magistrala-ui-new
```

### Step 2: Customize the UI

Make any necessary changes to the UI, such as updating the theme, font, logos, or favicons. Ensure that all required configuration files and assets (like logos and favicons) are in the dedicated `ui` directory in `cube` repository. This directory should include:

- `config.json` – containing UI settings like theme options, logo configurations, and metadata.
- `globals.css` – defining global styles, which will be applied to the UI.
- Logo files (e.g., `defaultLogo.svg` and `altLogo.svg`) – these will be copied to the `public` directory for use across the application.
- Favicon files (e.g., `defaultFavicon.svg` and `altFavicon.svg`) – also stored in the `public` directory.

**Note:** The file names for logo and favicon files do not need to follow a specific naming convention, as long as they have the `.svg` extension. The build process will copy all `.svg` files in the configuration directory to the `public` directory. However, it’s recommended to use descriptive names (e.g., `defaultLogo.svg`, `altLogo.svg`) for clarity and ease of identification.

For detailed customization instructions, refer to the [Customization of the UI section](https://github.com/absmach/magistrala-ui-new/blob/bc3086526451a0247216ac81b4edb4b6f1e2bb02/README.md#customization-of-the-ui) in the README.

### Step 3: Set the UI Type

Update the `.env` file in the `magistrala-ui-new` directory to specify the UI type to `cube-ai`:

```env
NEXT_PUBLIC_UI_TYPE=cube-ai
```

### Step 4: Build the `cube-ai` UI Docker Image

In the `magistrala-ui-new` directory, run:

```bash
CONFIG_DIR_SOURCE=<path_to_ui_config_directory> make dockers_cube_ai
```

Replace `<path_to_ui_config_directory>` with your Cube repository’s UI config path from Step 2.

**Example:**

```bash
CONFIG_DIR_SOURCE=../cube/ui make dockers_cube_ai
```

### Step 6: Retag the Image for GHCR

Retag the image to match the repository under GHCR:

```bash
docker tag ghcr.io/absmach/magistrala-ui-new/ui-cube-ai:latest ghcr.io/ultravioletrs/cube/ui:latest
```

### Step 7: Log in to GHCR

Use your GitHub Personal Access Token (PAT) to log in to GHCR:

```bash
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Replace `YOUR_GITHUB_PAT` with your PAT and `YOUR_GITHUB_USERNAME` with your GitHub username.

### Step 8: Push the Image to GHCR

Push the tagged image to GHCR repository:

```bash
docker push ghcr.io/ultravioletrs/cube/ui:latest
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

Remove volumes and networks:

```bash
docker compose down --volumes --remove-orphans
```

To clean up the build artifacts and remove compiled files, use:

```bash
make clean
```
