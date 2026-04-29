# Luminous-Coder
Offline-first digital assistant for ASHA workers to collect patient data, detect health risks, and sync with a central system for monitoring and reporting.

# Village Health Worker Digital Assistant

## Problem
In rural India, ASHA workers collect critical health data such as pregnancy details, vaccinations, and TB follow-ups using paper registers. This leads to delayed reporting, missed high-risk cases, manual errors, data loss, and poor coordination with healthcare officials.

## Solution
This project provides an offline-first digital system that enables ASHA workers to collect patient data through a mobile application, detect high-risk cases instantly, work without internet connectivity, and synchronize data with a central server when connectivity becomes available.

## Why We Built This
During the hackathon, we focused on real-world challenges faced by ASHA workers in rural areas. The major issue identified was unreliable internet access combined with manual record keeping. To address this, we designed a system that functions completely offline and ensures continuous usability in low-resource environments.

## Key Features

### Mobile App (React Native)
- Offline data entry using SQLite
- Simple interface designed for non-technical users
- Manual sync option to upload data
- Fully functional without internet

### Risk Detection
Rule-based logic implemented within the mobile app:
- Blood Pressure greater than 140 is marked as High Risk
- Missed vaccination is marked as Medium Risk
- TB-related symptoms are marked as High Risk

### Backend (Node.js and Express)
- REST APIs for syncing patient data
- Centralized data storage using MongoDB
- Efficient handling of multiple records

### Web Dashboard
- View all patient records
- Highlight high-risk cases
- Filter data by date and risk level

### Reports
- Generate downloadable CSV reports
- Useful for administrative and government purposes

## Our Approach
The system follows an offline-first architecture. Data is first stored locally using SQLite. Each record is tagged with a sync status such as pending or synced. A manual sync operation uploads only unsynced records to the backend. Risk detection is performed on the device itself, ensuring uninterrupted usage without internet.

## Architecture

Mobile App (Offline First)  
Local SQLite Database  
Node.js Backend (API)  
MongoDB Database  
Web Dashboard  

## Data Flow
1. Data is entered in the mobile application  
2. Stored locally in SQLite  
3. Risk level is calculated immediately  
4. Record is marked as pending  
5. When internet is available, user initiates sync  
6. Data is sent to backend API  
7. Stored in MongoDB and displayed on dashboard  

## Key Implementation Details
- UUIDs are used to uniquely identify patient records  
- Sync mechanism prevents duplicate uploads  
- Lightweight UI designed for ease of use  
- Risk detection is performed locally on the device  

## Tech Stack
- Mobile: React Native  
- Web: React.js  
- Backend: Node.js, Express  
- Database: SQLite (local), MongoDB (server)  

## Setup Instructions

### Clone Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
