#!/bin/sh

BACKEND_PORT=3000 node backend/server.js &
BACKEND_PORT=3000 node backend/server.js &
BACKEND_PORT=3000 node backend/server.js &

node loadBalancer/loadBalancer.js
