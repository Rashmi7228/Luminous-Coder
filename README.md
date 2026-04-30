# Luminous Coders

## Offline-First Healthcare Assistant for ASHA Workers

## Project Overview

The Offline-First Healthcare Assistant is a mobile and web-based system designed to help ASHA workers digitize patient data, detect health risks early, and ensure continuous operation even without internet connectivity.

The system replaces paper-based records with a reliable digital workflow, improving accuracy, efficiency, and coordination with healthcare authorities.

## Problem Statement

In rural India, ASHA workers manage:

* Pregnancy records
* Child vaccinations
* TB patient monitoring

Using paper registers leads to:

* Delayed reporting
* Missed high-risk cases
* Data loss and duplication
* Lack of real-time monitoring

## Solution

We developed an offline-first system that:

* Works without internet
* Stores data locally on the device
* Detects health risks instantly
* Syncs data to a central server when online

## Key Features

### Mobile Application (React Native)

* Offline data entry using SQLite
* Simple interface for ASHA workers
* Manual sync option
* Works in low or no network areas

### Risk Detection (On-Device)

* Blood Pressure greater than 140 → High Risk
* Missed Vaccination → Medium Risk
* TB Symptoms → High Risk

### Offline-First Sync System

* Local storage using SQLite
* Records marked as pending or synced
* Only unsynced data is uploaded

### Backend (Node.js and Express)

* REST APIs for data synchronization
* Handles secure communication
* Processes incoming patient data

### Database

* Local: SQLite (Mobile)
* Server: MySQL

### Web Dashboard

* View patient records
* Highlight high-risk cases
* Filter by region, date, and risk level

### Reports

* Generate CSV reports for monitoring and analysis

### Regional Access Control

* ASHA workers login with assigned region
* Access restricted to their local patients only

### Smart Patient Identification

* Aadhaar number (mandatory)
* Ration card (optional)
* Prevents duplicate records

### Vaccination Tracking

* Track child vaccination schedules
* Alerts for upcoming and missed vaccinations
* View vaccination history

### TB Monitoring

* Detect TB risk based on symptoms
* Alert ASHA workers for early action

## Advanced Features (Planned Enhancements)

### Multilingual Voice Assistant

* Voice input in regional languages
* Responses in voice or text

### Smart Nutrition Support

* Food scan for nutrition estimation
* Diet recommendations
* Focus on pregnant women and vegetarian nutrition (Vitamin B12 awareness)

### Pregnancy Care Module

* Weekly health tips
* Diet plans
* Exercise guidance in video, voice, and text

### Prescription Validation

* Detect fake or invalid prescriptions

### Smart Alerts System

* TB alerts to supervisors or doctors
* Polio vaccination reminders

## System Architecture

Mobile App
↓
SQLite (Local Database)
↓
Backend API (Node.js and Express)
↓
MySQL Database
↓
Web Dashboard

## Data Flow

1. ASHA worker enters patient data
2. Data stored locally in SQLite
3. Risk detection performed on-device
4. Record marked as pending
5. Sync triggered when internet is available
6. Data sent to backend API
7. Stored in MySQL database
8. Displayed on web dashboard

## Tech Stack

* Mobile: React Native
* Web: React.js
* Backend: Node.js, Express
* Database: SQLite, MySQL

## Future Scope

* AI-based food recognition
* Voice-enabled healthcare assistant
* Machine learning for disease prediction
* Integration with government healthcare systems


## Output :
<img width="1600" height="850" alt="1" src="https://github.com/user-attachments/assets/18e0b24d-aec5-4bbd-9b2f-a35f388d7213" />

<img width="1600" height="850" alt="2" src="https://github.com/user-attachments/assets/1faa9422-8d4d-48e2-b5c0-7be2892b40e2" />

<img width="1600" height="850" alt="3" src="https://github.com/user-attachments/assets/bcccc19d-9f8e-4f6d-aa5b-22cc1add2344" />

<img width="1600" height="850" alt="4" src="https://github.com/user-attachments/assets/436744aa-d25f-49d0-9023-620571a175b8" />

<img width="1600" height="850" alt="5" src="https://github.com/user-attachments/assets/9e16d856-2d3e-4a54-9c7b-6658c01303fd" />

<img width="1600" height="850" alt="6" src="https://github.com/user-attachments/assets/14dd74d0-081c-4919-a817-956c9ea36473" />

<img width="1600" height="850" alt="7" src="https://github.com/user-attachments/assets/005d728e-5102-483f-977f-88f1858e09d3" />



## Conclusion

This project provides a practical solution for rural healthcare by combining offline-first architecture with real-time risk detection. It enables ASHA workers to deliver timely and accurate healthcare services even in areas with limited connectivity.
