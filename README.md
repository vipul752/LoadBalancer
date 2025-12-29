# Load Balancer Project

## What is This Project?

This is a **Load Balancer** - think of it like a receptionist at a busy office. When customers (users) call, the receptionist doesn't handle everything themselves. Instead, they distribute the calls to multiple workers (backend servers) so no single person gets overwhelmed.

In this project:

- **Users send requests** to the Load Balancer (on port 8080)
- **The Load Balancer distributes** these requests to multiple backend servers
- **Multiple backend servers** (3 of them) handle the actual work
- **Requests are spread evenly** so no server gets overloaded

---

## Project Structure

```
loadBalancer/
├── backend/               # The actual work servers
│   ├── server.js         # Node.js server code
│   └── Dockerfile        # How to package the backend
├── lb/                    # The Load Balancer
│   ├── loadBalancer.js   # Load Balancer code
│   └── Dockerfile        # How to package the load balancer
├── docker-compose.yml    # Instructions to run everything together
├── package.json          # Project dependencies
└── README.md            # This file
```

---

## What Each Part Does

### 1. Backend Servers (`backend/server.js`)

- Simple Node.js Express server
- Runs 3 copies at the same time
- Each copy listens on port 3000 (inside Docker containers)
- When you visit it, it tells you which server handled your request

**What it does:**

- `/` - Shows which container handled the request
- `/health` - Responds with "OK" (for health checks)

### 2. Load Balancer (`lb/loadBalancer.js`)

- The "traffic director" of the project
- Listens on port 8080 (the main entry point)
- Sends requests to backend servers
- Tracks metrics in real-time

**Endpoints:**

- `/` - Proxies to backend
- `/health` - Health check
- `/metrics` - Returns JSON metrics (requests, errors, response time)
- `/dashboard` - Live visual dashboard with real-time statistics

**What it Tracks:**

- Total requests processed
- Currently active requests
- Total errors
- Average response time in milliseconds

**Error Handling:**

- If a backend server fails, it returns error 502 (Bad Gateway)
- If the request takes too long, it returns error 504 (Gateway Timeout)
- Logs all errors for debugging
- Handles unexpected crashes gracefully

### 3. Docker Compose (`docker-compose.yml`)

- A recipe that says: "Run all this together in containers"
- Creates 3 copies of the backend server automatically
- Creates 1 load balancer that connects to all 3 servers
- Makes everything work as a single system

---

## How to Run It

### Option 1: Using Docker (Recommended)

```bash
cd /Users/vipulkumar/Desktop/loadBalancer
docker compose up --build
```

This will:

1. Build the Docker images
2. Start 3 backend servers
3. Start 1 load balancer
4. Connect them all together

### Option 2: Running Locally

```bash
# Terminal 1 - Start backend server 1
PORT=3001 node backend/server.js

# Terminal 2 - Start backend server 2
PORT=3002 node backend/server.js

# Terminal 3 - Start backend server 3
PORT=3003 node backend/server.js

# Terminal 4 - Start load balancer
node lb/loadBalancer.js
```

---

## How to Test It

Once everything is running, open your browser or use `curl`:

```bash
# Visit the load balancer
curl http://localhost:8080/

# Check if it's healthy
curl http://localhost:8080/health

# View live metrics dashboard
open http://localhost:8080/dashboard

# Get metrics as JSON
curl http://localhost:8080/metrics
```

### Metrics Dashboard

Visit `http://localhost:8080/dashboard` to see a **live dashboard** showing:

- **Total Requests** - How many requests have been processed
- **Active Requests** - How many requests are currently being handled
- **Total Errors** - How many requests failed
- **Average Response Time** - How fast requests are answered (in milliseconds)

The dashboard updates automatically every second!

### Load Testing

Test the system with high traffic using autocannon:

```bash
# Run 400 concurrent connections for 20 seconds
autocannon -c 400 -d 20 http://localhost:8080

# Or test with different settings
autocannon -c 100 -d 30 http://localhost:8080
```

---

## Key Features

✅ **Round-Robin Distribution** - Requests are shared equally  
✅ **Error Handling** - Catches and logs all errors  
✅ **Health Checks** - Backend has a `/health` endpoint  
✅ **Docker Support** - Easy deployment with Docker  
✅ **Timeout Protection** - Handles slow requests  
✅ **Request Logging** - See what's happening in the console  
✅ **Live Metrics** - `/metrics` endpoint with JSON data  
✅ **Visual Dashboard** - `/dashboard` shows real-time statistics  
✅ **Performance Tracking** - Monitor response times and active requests

---

## Real-World Uses

This project demonstrates how companies handle millions of users:

- **Netflix** - Distributes video requests across servers
- **Google** - Spreads search requests to thousands of machines
- **Amazon** - Balances shopping requests during sales
- **Any busy website** - Uses load balancers to stay fast

---

## Technologies Used

- **Node.js** - Server runtime
- **Express** - Web framework
- **Docker** - Container system (packaging)
- **Docker Compose** - Multi-container orchestration

---

## Troubleshooting

| Problem                       | Solution                                                  |
| ----------------------------- | --------------------------------------------------------- |
| "Cannot connect to port 8080" | Make sure load balancer is running                        |
| "Backend Down" error          | Check if backend servers are running                      |
| Containers won't start        | Run `docker compose down` first, then `docker compose up` |
| Port already in use           | Change port numbers in docker-compose.yml                 |

---

## Future Improvements

- Add health checks (remove dead servers)
- Use weighted load balancing (some servers handle more)
- Add sticky sessions (same user → same server)
- Monitor server performance
- Add authentication/security

---

## Author Notes

This is a learning project to understand how load balancing works. In production, use proven tools like:

- **Nginx** - Industry standard
- **HAProxy** - High availability
- **AWS ELB** - Amazon's load balancer
- **Kubernetes** - Automatic scaling
