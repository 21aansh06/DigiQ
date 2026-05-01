# ⚡ DigiiQ | Real-Time B2B Queue Management SaaS

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**DigiiQ** is a sophisticated B2B SaaS platform designed to eliminate physical waiting lines. It provides a seamless, real-time bridge between service providers (Hospitals, Banks, Clinics) and their customers, allowing for virtual queueing, live tracking, and efficient service management.

---

## 🚀 Core Features

### 🏢 For Organizations (B2B)
- **Service Orchestration**: Create and manage multiple service categories (e.g., General Checkup, Emergency, Account Opening).
- **Live Queue Management**: A dynamic dashboard to update customer status (Waiting → In Progress → Completed) in real-time.
- **QR Code Integration**: Unique QR code generation for every service, enabling instant "Scan-to-Join" functionality.
- **Efficiency Metrics**: Configurable average service times to provide accurate wait estimations to customers.

### 👥 For Customers (B2C)
- **Virtual Tokens**: Join queues from anywhere without being physically present.
- **Live Status Tracking**: View real-time position in queue and estimated wait time updates via Socket.
- **History & Records**: Track past visits and service history through a dedicated user dashboard.

---

## 🛠️ Technical Architecture

DigiiQ is built with a focus on high availability, low latency, and modularity.

### **Frontend Stack**
- **Framework**: Next.js 15+ (App Router) for optimized SEO and performance.
- **State Management**: `Zustand` for lightweight, reactive global state.
- **Styling**: Tailwind CSS 4.0 & Shadcn UI for a premium, accessible interface.
- **Communication**: `Socket.io-client` for persistent bi-directional communication.

### **Backend Stack**
- **Engine**: Express 5.0 (Node.js) utilizing ES Modules.
- **Database**: MongoDB with Mongoose for flexible, document-based data modeling.
- **Real-Time**: `Socket.io` server-side integration for instant event broadcasting across namespaces.
- **Security**: JWT-based authentication with HTTP-only cookie storage for XSS/CSRF protection.
- **Integrations**: Twilio API for OTP verification and automated notifications.

---

## 🗺️ System Architecture & Flow

### 1. Logical System Design
A modular breakdown of the DigiiQ ecosystem, highlighting the separation of concerns between the client-side state, server-side logic, and the real-time event bus.

```mermaid
graph LR
    subgraph "Client Side (Next.js 15)"
        UI[Shadcn/UI Components]
        State[Zustand State Management]
        SocketC[Socket.io Client]
        API[Axios API Layer]
    end

    subgraph "Server Side (Express 5)"
        Routes[API Routes]
        Middleware[Auth & RBAC Middleware]
        Logic[Business Logic Controllers]
        SocketS[Socket.io Server]
    end

    subgraph "Infrastructure"
        DB[(MongoDB Atlas)]
        Auth[JWT / Bcrypt]
    end

    UI <--> State
    State --> API
    SocketC <--> SocketS
    API --> Routes
    Routes --> Middleware
    Middleware --> Logic
    Logic --> DB
    Logic --> SocketS
    Logic --> Auth
```

### 2. Core Business Flow: The Queue Lifecycle
This diagram illustrates the "Zero-Wait" philosophy of DigiiQ, showing how a user moves from discovery to service completion without physical friction.

```mermaid
sequenceDiagram
    autonumber
    participant U as Customer (B2C)
    participant F as Frontend (Zustand/Socket)
    participant B as Backend (Express)
    participant S as Socket.io (WSS)
    participant O as Organization (B2B)

    Note over U,O: Phase 1: Interaction & Joining
    U->>F: Scan QR / Select Service
    F->>B: POST /api/queues/join/:id
    B->>B: Validate & Generate Token
    B-->>F: Return Token + Estimate

    Note over U,O: Phase 2: Real-Time Synchronization
    B->>S: Broadcast "queue:update"
    S-->>O: Live Refresh Org Dashboard
    S-->>F: Live Update Position in UI

    Note over U,O: Phase 3: Service Fulfillment
    O->>B: PATCH /api/queues/status (Calling Next)
    B->>S: Broadcast "statusChanged"
    S-->>F: Push Alert: "It's your turn!"
    F-->>U: Notify Customer
```

---


## 🚀 My Vision & Future Roadmap

These are the features I have conceptualized and am planning to develop alongside the core product to enhance scalability and production-grade reliability:

### 1. High-Performance Caching
- **Redis Integration**: Implement Redis for storing active queue data to reduce MongoDB read/write overhead during peak hours.


### 2. Advanced Analytics & BI
- Dedicated Analytics Engine for Organizations to visualize peak traffic hours, staff efficiency, and customer drop-off rates.


### 3. Smart Notifications
- **Real-Time Alerts**: Currently, the system relies on active dashboard monitoring. I am planning to integrate native browser/mobile notifications to alert users when their turn is approaching.

### 4. Multi-Channel Notifications
- **Omnichannel Reach**: Integration of Firebase Cloud Messaging (FCM) for native push notifications and WhatsApp Business API for wider reach.

---


<p align="center">
  Built with ❤️ for a queue-free world.
</p>
