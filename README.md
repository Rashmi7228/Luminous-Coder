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

## 🤔 Why We Built This
During our hackathon, we focused on real challenges faced by ASHA workers in rural areas.  
We identified that unreliable internet connectivity and manual record-keeping were the biggest bottlenecks.

So instead of building a typical online system, we designed a solution that works **completely offline first**, ensuring uninterrupted usage in low-resource environments.

---

## 🚀 Key Features

### 📱 Mobile App (React Native)
- Offline data entry using SQLite
- Simple UI designed for non-technical users
- Sync button for uploading data
- Works without internet

### 🧠 Risk Detection
Rule-based logic implemented directly in the mobile app:
- Blood Pressure > 140 → **High Risk**
- Missed Vaccination → **Medium Risk**
- TB Symptoms → **High Risk**

### 🌐 Backend (Node.js + Express)
- REST APIs for syncing patient data
- Centralized storage in MongoDB
- Handles multiple records efficiently

### 💻 Web Dashboard
- View all patient records
- Highlight high-risk cases
- Filter by date and risk level

### 📊 Reports
- Generate downloadable CSV reports
- Useful for administrative and government use

---

## 🧠 Our Approach
We followed an **offline-first architecture**:

- Data is first stored locally using SQLite
- Each record is tagged with a sync status (`pending` / `synced`)
- A manual sync button uploads only unsynced data
- Risk detection is performed on-device

This ensures the system works even with zero internet connectivity.

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
1. ASHA worker enters patient data  
2. Data is stored locally in SQLite  
3. Risk level is calculated instantly  
4. Record is marked as **pending**  
5. On internet availability → user clicks Sync  
6. Data is sent to backend API  
7. Stored in MongoDB and displayed in dashboard  

---

## ⚙️ Key Implementation Details
- Used **UUIDs** to uniquely identify each patient record  
- Implemented **sync mechanism** to avoid duplicate uploads  
- Designed **lightweight UI** for ease of use  
- Applied **rule-based risk detection** locally on device  

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
