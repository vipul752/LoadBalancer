# 📚 Load Balancer Project - Simple Explanation

## What is This Project?

Imagine you have a popular restaurant. Every customer who comes in needs to be served. If only one waiter exists, they'll get overwhelmed and customers will wait forever.

**The Solution?** Hire multiple waiters and have a manager (receptionist) distribute customers to them evenly.

That's exactly what this **Load Balancer** project does, but with web servers instead of waiters!

---

## 🎯 The Main Idea

```
Customers (Users)
        ↓
   Load Balancer (Port 8080)
   [Distributes Requests]
        ↓
   ┌────┴────┬─────────┐
   ↓         ↓         ↓
Server 1  Server 2  Server 3
(Port 3000) (Port 3000) (Port 3000)
```

When you visit the load balancer, it sends your request to one of the 3 backend servers, making sure each server doesn't get overloaded.

---

## 📁 Project Structure

```
loadBalancer/
├── backend/
│   ├── server.js        ← Backend server code
│   └── Dockerfile       ← How to package backend
├── loadBalancer/
│   ├── loadBalancer.js  ← Load balancer code
│   └── Dockerfile       ← How to package load balancer
├── docker-compose.yml   ← Run everything together
├── package.json         ← Project dependencies
└── README.md            ← Original documentation
```

---

## 🔧 What Each Part Does

### 1. **Backend Servers** (`backend/server.js`)

These are the **actual workers** that handle your requests.

**Key Features:**

- Simple Node.js + Express server
- 3 copies run at the same time
- Each one is identical and independent
- Tells you which server handled your request

**Endpoints:**

```
GET /           → Returns "Handled by container: [container-id]"
GET /health     → Returns "OK" (used to check if server is alive)
```

**Example:**

```
User visits Load Balancer
→ Request goes to Backend Server 2
→ Backend Server 2 responds: "Handled by container: abc123xyz"
```

---

### 2. **Load Balancer** (`loadBalancer/loadBalancer.js`)

This is the **traffic director** that distributes requests to backend servers.

**Key Features:**

- Listens on port 8080 (main entry point)
- Forwards requests to one of 3 backend servers
- Tracks statistics (metrics)
- Handles errors gracefully

**Endpoints:**

```
GET /           → Forwards your request to a backend server
GET /health     → Returns "OK"
GET /metrics    → Shows statistics (JSON format)
GET /dashboard  → Shows live visual dashboard
```

**What It Tracks:**

- **Total Requests**: How many requests it has handled total
- **Active Requests**: How many requests are being processed right now
- **Total Errors**: How many errors occurred
- **Average Response Time**: How long requests take on average

**Error Handling:**

- If a backend is down → Returns 502 (Bad Gateway)
- If request takes too long → Returns 504 (Gateway Timeout)
- Logs errors for debugging
- Continues working even if something breaks

---

### 3. **Docker Compose** (`docker-compose.yml`)

This is the **recipe** that tells Docker how to run everything.

**What It Does:**

1. Builds the backend server image
2. Runs 3 copies of the backend server
3. Builds the load balancer image
4. Runs 1 load balancer
5. Connects them all together in a network

**In Simple Terms:**
Instead of running things manually, Docker does it all automatically!

---

## 🚀 How to Run It

### Option 1: Using Docker (Easiest)

```bash
# Go to project folder
cd /Users/vipulkumar/Desktop/loadBalancer

# Start everything
docker compose up --build
```

This command:

1. Builds the Docker images
2. Starts 3 backend servers
3. Starts 1 load balancer
4. Connects them all

**Output Example:**

```
loadbalancer-1 | Load Balancer is running on port 8080
backend-1      | Server is running on port 3000
backend-2      | Server is running on port 3000
backend-3      | Server is running on port 3000
```

### Option 2: Stop Everything

```bash
docker compose down
```

---

## 🧪 Testing It Out

Once running, try these in your browser or terminal:

**1. Test the main endpoint:**

```bash
curl http://localhost:8080/
```

**Response:** `Handled by container: [some-id]`

Refresh multiple times - you'll see different containers handling requests!

**2. Check load balancer health:**

```bash
curl http://localhost:8080/health
```

**Response:** `OK`

**3. View metrics (statistics):**

```bash
curl http://localhost:8080/metrics
```

**Response:**

```json
{
  "totalRequests": 42,
  "activeRequests": 0,
  "totalErrors": 0,
  "averageResponseTimeMs": "5.23"
}
```

**4. View live dashboard:**
Open your browser and go to:

```
http://localhost:8080/dashboard
```

You'll see a beautiful dashboard showing:

- Real-time request count
- Active connections
- Error rate
- Response time graph

---

## 🎓 How Does Load Balancing Work?

### Without Load Balancer ❌

```
User 1 ─┐
User 2 ─┼──→ Only Server (OVERLOADED!)
User 3 ─┘
```

Problems:

- One server gets all traffic
- Server gets slow or crashes
- Users experience delays

### With Load Balancer ✅

```
User 1 ──┐
         ├──→ Load Balancer → Distributes to →  Server 1
User 2 ──┤                                    Server 2
         ├──→                                 Server 3
User 3 ──┘
```

Benefits:

- Traffic is spread evenly
- Servers don't get overloaded
- Better performance
- If one server fails, others still work

---

## 💡 Real-World Example

**Scenario:** You're running an online store, and you have 1 million visitors per day.

Without Load Balancer:

- One server tries to handle 1 million requests
- Server crashes or becomes very slow
- Customers leave your site

With Load Balancer:

- 1 million requests distributed to 3 servers (≈ 333k each)
- Servers handle their portion easily
- Website stays fast
- If one server fails, 2 still serve customers

---

## 📊 Project Dependencies

From `package.json`:

- **express**: Framework for building the web servers
- **docker-compose**: Tool to manage Docker containers

---

## 🔍 Technology Stack

| Component        | Technology           |
| ---------------- | -------------------- |
| Language         | Node.js (JavaScript) |
| Framework        | Express.js           |
| Containerization | Docker               |
| Orchestration    | Docker Compose       |
| Port (LB)        | 8080                 |
| Port (Backend)   | 3000                 |

---

## 🎯 Summary

**In One Sentence:**
This project shows how a **Load Balancer** distributes incoming requests to multiple backend servers to prevent any single server from getting overloaded.

**The 3 Main Parts:**

1. **Backend Servers** - Do the actual work (3 copies)
2. **Load Balancer** - Distributes requests (1 copy)
3. **Docker Compose** - Runs everything together

**What You Can Do:**

- Visit `/` to see which server handled your request
- Visit `/metrics` to see statistics
- Visit `/dashboard` to see a live visual dashboard
- Run everything with just one command: `docker compose up --build`

---

## ✨ Key Takeaway

This is a practical example of **horizontal scaling** - instead of buying one super-powerful server, you use multiple regular servers and distribute the load. It's how Netflix, YouTube, and Amazon handle millions of users! 🚀
