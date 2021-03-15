#!/bin/bash -eu
IMAGE=crypto-tracker
CONTAINER=crypto

echo "Rebuilding image"
yarn build
docker build -t $IMAGE .

echo "Stopping and removing container"
docker stop $CONTAINER || true
docker rm $CONTAINER || true

echo "Restarting container with new image"
docker run -d \
    --name $CONTAINER \
    -p 8080:3000 \
    $IMAGE
echo "Starting on http://localhost:8080"