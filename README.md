# Docker


##  How to install

Follow all the steps present in the [official documentation](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) starting from the **Install Docker CE** chapter

## Login to Docker Hub

```sh
 $ sudo docker login --username=myusername --password=mypassword
 ```

## Building the project docker image

Go to the folder where is located the Dockerfile and execute:

```sh
 $ docker build -t $DOCKER_ACC/$DOCKER_REPO:$IMG_TAG .
 ```

 DOCKER_ACC is the name of your account $DOCKER_REPO is your image name and $IMG_TAG is your tag. The ``.`` indicates that ``Dockerfile`` is at the current path. If the ``Dockerfile`` is in another path you can specify using: 

```sh
 $ sudo docker build -t $DOCKER_ACC/$DOCKER_REPO:$IMG_TAG $DOCKERFILE_PATH
 ```

### Example

```sh
 $ sudo docker build -t ocariot/api-gateway:v0.1 .
 ```

## Pushing image to Docker Hub
Firstly you have to login to Docker Hub using your credentials and build the docker image, as described above. So execute the following command:
```sh
 $ sudo docker push $DOCKER_ACC/$DOCKER_REPO:$IMG_TAG
 ```

 ### Example

```sh
 $ sudo docker push ocariot/api-gateway:v0.1
 ```

## Set the environment variables

You can set directly on ``Dockerfile`` or in ``Docker-Compose`` file

## Executing the project container image

``docker run -p HOST_PORT:CONTAINER_PORT -it IMAGE_NAME:IMAGE_VERSION``

Example:

``docker run -p 9876:9876 -it ocariot-api-gateway:v0.1``

## Access API


``http://localhost:9876``
