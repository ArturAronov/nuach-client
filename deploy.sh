#!/bin/sh

DATE_TAG=$(date '+%d%m%Y-%H%M')
AWS_AC=$(aws sts get-caller-identity --query Account --output text --profile personal)
IMAGE="${AWS_AC}.dkr.ecr.ap-northeast-1.amazonaws.com/nuach/client:${DATE_TAG}"

aws ecr get-login-password --region ap-northeast-1 --profile personal | docker login --username AWS --password-stdin $AWS_AC.dkr.ecr.ap-northeast-1.amazonaws.com

echo "Building image and pulling models..."
docker build --platform linux/amd64 -t $IMAGE .

echo "Pushing image with all models to ECR..."
docker push $IMAGE
