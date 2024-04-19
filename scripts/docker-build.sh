#!/bin/bash

prefix=${PREFIX:-localhost:5000/}
startpath=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source $startpath/parse_yaml.sh

function get_value() {
  local key=$1
  parse_yaml $startpath/../helm/values.yaml | awk -F = "\$1 ~ /$key/ { print substr(\$2, 2, length(\$2) - 2); }"
}

function tag_and_push() {
  local tag=$(get_value containers_${1}_tag)
  local fulltag=${prefix}${1}:${tag}
  echo $fulltag
  docker tag trieve/$1 $fulltag
  docker push $fulltag
}

function docker_build() {
  docker build --progress=plain $*
}

function build_images() {

  cd $startpath/../docker/keycloak
  docker_build -t trieve/keycloak .
  cd $startpath/../docker/minio
  docker_build -t trieve/minio .
  cd $startpath/../docker/postgres
  docker_build -t trieve/postgres .
  cd $startpath/../docker/qdrant
  docker_build -t trieve/qdrant .
  cd $startpath/../docker/tika
  docker_build -t trieve/tika .
  cd $startpath/../docker/mc
  docker_build -t trieve/mc .
  cd $startpath/../server
  docker_build -t trieve/server -f Dockerfile.no-ocr . 
  docker_build -t trieve/ingest -f Dockerfile.microservice .
}

function tag_images() {
  tag_and_push keycloak
  tag_and_push minio
  tag_and_push postgres
  tag_and_push qdrant
  tag_and_push tika
  tag_and_push mc
  tag_and_push server
  tag_and_push ingest
}

build_images
tag_images
