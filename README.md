# Luminous-Coder

Offline-first digital assistant for ASHA workers to collect patient data, detect health risks, and sync with a central system for monitoring and reporting.

## Project Overview
Village Health Worker Digital Assistant is designed to support ASHA workers in rural areas by digitizing healthcare data collection and enabling real-time risk identification, even without internet connectivity.

## Problem
In rural India, ASHA workers collect critical health data such as pregnancy details, vaccinations, and TB follow-ups using paper registers. This leads to delayed reporting, missed high-risk cases, manual errors, data loss, and poor coordination with healthcare officials.

## Solution
This project provides an offline-first digital system that enables ASHA workers to collect patient data through a mobile application, detect high-risk cases instantly, work without internet connectivity, and synchronize data with a central server when connectivity becomes available.

## Why We Built This
During the hackathon, we focused on real-world challenges faced by ASHA workers in rural areas. The major issue identified was unreliable internet access combined with manual record keeping. To address this, we designed a system that functions completely offline and ensures continuous usability in low-resource environments.

## Key Features

### Mobile App (React Native)
- Offline data entry using SQLite  
- Simple interface for non-technical users  
- Manual sync option  
- Works without internet  

### Risk Detection
- Blood Pressure > 140 → High Risk  
- Missed vaccination → Medium Risk  
- TB-related symptoms → High Risk  

### Backend (Node.js and Express)
- REST APIs for syncing data  
- Centralized storage using MongoDB  

### Web Dashboard
- View patient records  
- Highlight high-risk cases  
- Filter by date and risk level  

### Reports
- Generate CSV reports  

## Our Approach
The system follows an offline-first architecture:
- Data stored locally using SQLite  
- Records tagged as pending or synced  
- Only unsynced data is uploaded  
- Risk detection is performed on-device  

## Architecture
Mobile App  
↓  
Local SQLite Database  
↓  
Backend API (Node.js)  
↓  
MongoDB Database  
↓  
Web Dashboard  

## Data Flow
1. Data entered in mobile app  
2. Stored locally  
3. Risk calculated  
4. Marked as pending  
5. Synced when internet is available  
6. Stored in database  
7. Displayed in dashboard  

## Tech Stack
- React Native  
- React.js  
- Node.js, Express  
- SQLite  
- MongoDB  

## Setup Instructions

### Clone Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
