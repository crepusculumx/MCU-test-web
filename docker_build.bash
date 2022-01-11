#!/bin/bash

IMAGE_NAME=mcu_test_web
IMAGE_TAG=dev

docker build -t ${PROJECT_NAME}:${IMAGE_TAG} -f dev.dockerfile .