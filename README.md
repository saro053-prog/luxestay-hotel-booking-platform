# LuxeStay — Luxury Hotel Booking & Hospitality Management Platform

[![React 19](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-4.22-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade luxury hotel booking and hospitality operations platform featuring a curated catalog of 108+ heritage palaces, luxury beachfront resorts, and metropolitan hotels across 15+ world destinations. Built with React 19, Tailwind CSS v4, Node.js Express REST API, a 12-table relational MySQL schema, and the **Aura Personal AI Travel Concierge** with multi-turn conversational memory.

---

## 📌 Overview

**LuxeStay** is a digital hospitality platform that seamlessly unifies the guest booking journey, property front-desk management, customer loyalty tracking, and platform-wide administrative controls into a cohesive single-page application.

---

## 🚀 Key Modules & Features

### 1. Public Guest Portal & Hotel Discovery
- **Extensive Hospitality Catalog**: 108 handpicked luxury properties, 240+ room inventory, and 520+ bookings.
- **Search & Multi-Filter Engine**: Filter by destination city, dates, guest counts, star class (3 to 5 stars), nightly price slider (₹4,000 to ₹60,000+), guest score (4.8+ Exceptional), and 8 luxury amenities (Infinity Pool, Spa, Beachfront, 24/7 Butler, etc.).
- **Interactive Reservation Modal**: Real-time room rate calculation, coupon discount codes (`LUXE20` for 20% off), 18% luxury GST breakdown, and instant stay voucher generation.

### 2. Platform Admin & Operations Console
- **Hospitality KPIs**: Gross revenue counter (₹3.48+ Cr), total bookings, occupancy rate (84.6%), ADR (Average Daily Rate: ₹22,450), and RevPAR (₹18,990).
- **Visual Performance Telemetry**: Interactive SVG charts tracking revenue and occupancy trends.
- **Bookings Operations Manager**: Search, filter, update check-in/out status, and **1-Click CSV Export** of full booking records.
- **Hotel & Guest Registries**: Real-time property inventory and VIP member rankings.

### 3. Customer Trips & Loyalty Portal
- **Digital Stay Pass**: Active stay card with assigned room number, floor, in-room VIP Wi-Fi credentials (`LUXE2026`), and concierge hotline.
- **Contactless QR Code Key**: Scannable digital pass for elevator and suite door lock access.
- **Folio Tax Invoice Generator**: Generates and prints official hospitality tax receipts with GSTIN breakdown.
- **Verified Review Publisher**: 5-star interactive rating and stay review submission.
- **Diamond VIP Rewards**: 18,400 loyalty reward points tracker and complimentary perks.

### 4. Property Manager Front-Desk Terminal
- **Dedicated Property Console**: Directly manage daily operations for *The Grand Mumbai Palace & Spa*.
- **Daily Roster**: Arrivals and departures queue with 1-click Express Check-In and Check-Out.
- **Interactive Visual Room Matrix**: Color-coded room occupancy grid (Available, Occupied, Cleaning, Maintenance) with live housekeeping status toggling.
- **Concierge Service Requests**: Queue for in-room dining, chauffeur transfers, and guest assistance.

### 5. Aura: Personal AI Travel Concierge
- **Multi-Turn Conversational Memory**: Understands sequential dialogue context (e.g., *"Find a hotel in Goa"* ➔ *"Which of those has an infinity pool?"* ➔ *"Show me the cheapest one"* ➔ *"Book it"*).
- **Direct Dataset Integration**: Searches live hotels, verifies guest booking records, and surfaces rich interactive recommendation cards with one-click booking triggers.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide React
- **Backend**: Node.js 24, Express REST API, CORS, ES Modules
- **Database**: Relational MySQL 8.0 schema (`database/schema.sql`)
- **Testing**: Vitest automated test suite (16/16 tests passing)

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Run automated test suite
bun run test

# 3. Start development server
bun run dev -- --port 3000

# 4. Start backend REST API
node backend/server.js
```

Or on Windows, simply double-click `START_HOTEL_PROJECT.bat` to launch both services and open your browser automatically.

---

## 🔑 Verified Demo Credentials

- **Guest (Diamond VIP)**: `arun.traveler@example.com` / `Password@123`
- **Property General Manager**: `manager.mumbai@luxestay.com` / `Password@123`
- **Front Office Desk**: `frontdesk@luxestay.com` / `Password@123`
- **Platform Executive Admin**: `admin@luxestay.com` / `Password@123`

---

## 📄 License

MIT License. Designed and engineered for luxury hospitality.
