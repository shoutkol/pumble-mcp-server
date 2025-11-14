#!/bin/bash

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-your-dockerhub-username}"
IMAGE_NAME="${IMAGE_NAME:-pumble-mcp-server}"
TAG="${TAG:-latest}"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker Hub username is set
if [ "$DOCKER_USERNAME" = "your-dockerhub-username" ]; then
    echo -e "${RED}Error: DOCKER_USERNAME not set!${NC}"
    echo -e "${YELLOW}Usage: DOCKER_USERNAME=your-username ./deploy-dockerhub.sh${NC}"
    echo -e "${YELLOW}Or export it: export DOCKER_USERNAME=your-username${NC}"
    exit 1
fi

echo -e "${GREEN}Building Docker image...${NC}"
docker build -t ${FULL_IMAGE_NAME} .

if [ $? -ne 0 ]; then
    echo -e "${RED}Docker build failed!${NC}"
    exit 1
fi

# Optionally tag as latest
if [ "$TAG" != "latest" ]; then
    echo -e "${GREEN}Tagging as latest...${NC}"
    docker tag ${FULL_IMAGE_NAME} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

echo -e "${GREEN}Pushing to Docker Hub...${NC}"
echo -e "${YELLOW}Make sure you're logged in: docker login${NC}"
docker push ${FULL_IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo -e "${RED}Docker push failed!${NC}"
    echo -e "${YELLOW}Make sure you're logged in: docker login${NC}"
    exit 1
fi

if [ "$TAG" != "latest" ]; then
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

echo -e "${GREEN}Push complete!${NC}"
echo -e "${YELLOW}Image: ${FULL_IMAGE_NAME}${NC}"
echo -e "${YELLOW}Run with: docker run -p 3000:3000 -e PUMBLE_API_KEY=your-key ${FULL_IMAGE_NAME}${NC}"

