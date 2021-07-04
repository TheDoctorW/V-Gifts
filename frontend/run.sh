#!/bin/sh

# How to run?
# sh run.sh [BACKEND PORT] [FRONTEND PORT]
# example: 
#   sh run.sh 5000 3000

echo "REACT_APP_BACKEND_PORT=$1" > .env
echo "PORT=$2" >> .env
npm start