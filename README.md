# 🧠 DigiQ – Smart Digital Queue Management System

*DigiQ* is a web-based queue management platform built using the *MERN stack* (MongoDB, Express.js, React.js, Node.js).  
It replaces physical waiting lines with a *smart, digital, real-time queue tracker*, making service management faster, simpler, and more efficient.

---

## 🚀 Features

### 👩‍💼 For Service Providers (Organizations)
- Register and manage their organization (e.g., salon, clinic, café, or bank)
- Add services with estimated service durations  
  (e.g., Haircut – 10 mins, Consultation – 15 mins)
- Manage a *live queue* of customers in real-time
- Mark users as *Served* or *Skipped*
- Automatic *QR Code generation* for each organization upon registration
- QR can be printed and displayed at the shop
- When customers scan the QR, they are redirected to the organization’s page where they can *join the queue*

### 🙋‍♂ For Customers / Users
- Browse organizations based on *city or location*
- View organization details and available services
- *Join a queue* for a specific service
- See *estimated waiting time*, dynamically calculated based on:
  - The number of people ahead, and  
  - The service durations of those ahead

*Example:*  
If 3 people are in the queue —  
2 chose a 4-minute service and 1 chose a 5-minute service → *Total waiting time = 13 mins*

---

## ⚙ Core Functionalities

- 🔐 User Authentication (Sign Up / Login)
- 🏢 Organization Registration & Management
- 🧾 Add / Manage Services with Estimated Duration
- 🔄 Real-Time Queue System
- ⏱ Dynamic Wait Time Estimation
- 🌆 City-Based Organization Filtering
- 🧍 Admin Controls (Mark as Served / Skipped)
- 📱 QR Code Generation for Organizations
- 📸 QR-based Access to Organization Page & Queue Join Option

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| *Frontend* | React.js, Tailwind CSS |
| *Backend* | Node.js, Express.js |
| *Database* | MongoDB Atlas |
| *API Communication* | REST API |
| *QR Code Generation* | qrcode npm package |

---
