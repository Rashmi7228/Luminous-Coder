# Luminous-Coder
Offline-first digital assistant for ASHA workers to collect patient data, detect health risks, and sync with a central system for monitoring and reporting.

# Village Health Worker Digital Assistant

## 📌 Problem
In rural India, ASHA workers collect critical health data (pregnancy, vaccinations, TB follow-ups) using paper registers. This leads to:
- Delayed reporting
- Missed high-risk cases
- Manual errors and data loss
- Poor coordination with healthcare officials

---

## 💡 Solution
An **offline-first digital system** that enables ASHA workers to:
- Collect patient data using a mobile app
- Detect high-risk cases instantly
- Work without internet connectivity
- Sync data to a central server when online

---

## 🚀 Key Features

### 📱 Mobile App (React Native)
- Offline data entry using SQLite
- Simple and user-friendly interface
- Sync button for uploading data
- Works without internet

### 🧠 Risk Detection
Rule-based logic:
- Blood Pressure > 140 → **High Risk**
- Missed Vaccination → **Medium Risk**
- TB Symptoms → **High Risk**

### 🌐 Backend (Node.js + Express)
- REST APIs for data sync
- Centralized data storage
- Handles multiple users

### 💻 Web Dashboard
- View all patient records
- Highlight high-risk cases
- Filter by date and risk level

### 📊 Reports
- Generate downloadable CSV reports
- Useful for government submission

---

## 🏗️ Architecture

Mobile App (Offline First)
        ↓
 Local SQLite Database
        ↓ (Sync when online)
 Node.js Backend (API)
        ↓
   MongoDB Database
        ↓
  Web Dashboard

---

## 🔄 Data Flow
1. Data entered in mobile app
2. Stored locally in SQLite
3. Risk level calculated instantly
4. Marked as "pending"
5. Synced to backend when internet is available
6. Stored in MongoDB
7. Displayed in dashboard

---

## 🛠️ Tech Stack
- Mobile: React Native
- Web: React.js
- Backend: Node.js, Express
- Database: SQLite (local), MongoDB (server)

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
