# Cube AI Documentation

This repo collects the collaborative work on Cube AI documentation.

Documentation is auto-generated from Markdown files in this repo using [Docusaurus](https://docusaurus.io/).

## Installation

Doc repo can be fetched from GitHub:

```bash
git clone https://github.com/ultravioletrs/cube-docs.git
cd cube-docs
```

Install dependencies:

```bash
npm install
```

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window at [http://localhost:3000](http://localhost:3000). Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

You can also manually deploy using:

```bash
npm run serve
```

This serves the production build locally for testing before deployment.
