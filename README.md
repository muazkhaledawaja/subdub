# SubDub – Subscription Tracker API

SubDub is a backend-only API built with Node.js and MongoDB.  
It allows users to track recurring subscriptions, calculate renewal dates, and receive reminder emails before their subscriptions renew.  
This repository contains the backend logic only (no frontend).

---

## 🚀 Features

- Create, read, update, and delete subscriptions  
- Auto-calculate renewal dates (daily / weekly / monthly / yearly)  
- Send reminder emails using Nodemailer  
- Scheduled background jobs using Upstash Workflow  
- Date handling with DayJS  
- API protection using Arcjet  
- MongoDB database using Mongoose  

---

## 🛠️ Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **Nodemailer**
- **DayJS**
- **JWT (optional)**
- **bcryptjs (optional)**
- **Upstash Workflow**
- **Arcjet**
- **dotenv**

---

## 📦 Installation

```bash
git clone https://github.com/muazkhaledawaja/subdub.git
cd subdub
npm install
