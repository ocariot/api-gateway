# Docker


##  How to install

Follow all the steps present in the [official documentation](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) starting from the **Install Docker CE** chapter


## Building the project container image


``docker build -t IMAGE_NAME:IMAGE_VERSION DOCKERFILE_PATH``

Example:

``docker build -t haniot-api-gateway:v0.1 .``

## Set the environment variables

You can set directly on ``Dockerfile`` or in ``Docker-Compose`` file

## Executing the project container image

``docker run -p HOST_PORT:CONTAINER_PORT -it IMAGE_NAME:IMAGE_VERSION``

Example:

``docker run -p 9876:9876 -it haniot-api-gateway:v0.1``

## Access API


``http://localhost:9876``