#!/bin/bash
git pull origin master
docker stop react-admin-app || true
docker rm react-admin-app || true
docker rmi react-admin-app-image || true
docker build -t react-admin-app-image .
docker run -d --name react-admin-app -p 3000:80 react-admin-app-image
