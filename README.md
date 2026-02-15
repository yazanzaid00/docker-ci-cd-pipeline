# Docker CI/CD Pipeline

CI/CD with GitHub Actions → Docker Hub → Watchtower auto-deploy (multi-arch)

## Overview

This project demonstrates a complete CI/CD pipeline using:
- **GitHub Actions** - Build and push Docker images on GitHub-hosted runners
- **Docker Hub** - Store and distribute container images
- **Watchtower** - Automatically update containers when new images are pushed
- **Multi-architecture support** - Build for both AMD64 and ARM64

## Architecture

1. **Build & Push** (GitHub Actions on GitHub-hosted runner)
   - Triggered on push to main/master branch
   - Builds multi-arch Docker image (amd64, arm64)
   - Pushes to Docker Hub

2. **Auto-Deploy** (Watchtower on target machine)
   - Monitors Docker Hub for image updates
   - Automatically pulls and restarts containers with new images
   - Runs every 5 minutes by default

## Prerequisites

- Docker and Docker Compose installed on your target machine
- Docker Hub account
- GitHub repository with Actions enabled

## Setup Instructions

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token

### 2. Push Code to GitHub

Push this repository to your GitHub account. The GitHub Actions workflow will automatically:
- Build the Docker image
- Push it to Docker Hub with the `latest` tag

### 3. Deploy on Target Machine

On your target machine (server, VM, etc.):

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/docker-ci-cd-pipeline.git
   cd docker-ci-cd-pipeline
   ```

2. Create a `.env` file with your Docker Hub username:
   ```bash
   cp .env.example .env
   # Edit .env and set DOCKER_USERNAME=your-dockerhub-username
   ```

3. Start the services:
   ```bash
   docker-compose up -d
   ```

This will start:
- Your application container (pulled from Docker Hub)
- Watchtower container (monitors for updates)

### 4. Verify Deployment

Check that the application is running:
```bash
curl http://localhost:3000
```

View logs:
```bash
docker-compose logs -f
```

## How It Works

### GitHub Actions Workflow

The workflow (`.github/workflows/docker-build-push.yml`):
- Runs on GitHub-hosted Ubuntu runner
- Uses Docker Buildx for multi-platform builds
- Pushes to Docker Hub on successful builds
- Only pushes on push events (not PRs)

### Docker Compose

The `docker-compose.yml` defines:

**App Service:**
- Pulls image from Docker Hub
- Exposes port 3000
- Labeled for Watchtower monitoring
- Restarts automatically unless stopped

**Watchtower Service:**
- Monitors labeled containers
- Checks for updates every 5 minutes (300 seconds)
- Automatically pulls new images and restarts containers
- Cleans up old images

### Watchtower Configuration

Key environment variables:
- `WATCHTOWER_CLEANUP=true` - Remove old images after updating
- `WATCHTOWER_POLL_INTERVAL=300` - Check every 5 minutes
- `WATCHTOWER_LABEL_ENABLE=true` - Only monitor labeled containers
- `WATCHTOWER_INCLUDE_RESTARTING=true` - Include restarting containers

## Workflow

1. **Developer pushes code** to GitHub
2. **GitHub Actions** automatically builds and pushes Docker image to Docker Hub
3. **Watchtower** detects the new image on Docker Hub
4. **Watchtower** pulls the new image and restarts the container
5. **Application** is automatically updated with zero manual intervention

## Customization

### Change Update Frequency

Edit `WATCHTOWER_POLL_INTERVAL` in `docker-compose.yml`:
```yaml
- WATCHTOWER_POLL_INTERVAL=60  # Check every 60 seconds
```

### Add More Services

Add additional services to `docker-compose.yml` and label them for Watchtower:
```yaml
labels:
  - "com.centurylinklabs.watchtower.enable=true"
```

### Modify the Application

Edit `index.js` to customize the application behavior. Changes will automatically deploy when pushed to GitHub.

## Testing Locally

Build and run the Docker image locally:
```bash
docker build -t docker-ci-cd-pipeline .
docker run -p 3000:3000 docker-ci-cd-pipeline
```

## Troubleshooting

**Containers not updating:**
- Check Watchtower logs: `docker logs watchtower`
- Verify image was pushed to Docker Hub
- Ensure labels are correct on containers

**Build failing:**
- Check GitHub Actions logs
- Verify Docker Hub credentials in GitHub Secrets
- Check Dockerfile syntax

**Application not accessible:**
- Check container is running: `docker ps`
- Check logs: `docker logs docker-ci-cd-app`
- Verify port 3000 is not in use

## License

MIT
