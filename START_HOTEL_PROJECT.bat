@echo off
title LuxeStay Hotel Booking & Management Platform
color 0E

echo ==============================================================================
echo       LUXESTAY -- LUXURY HOTEL BOOKING & HOSPITALITY MANAGEMENT PLATFORM
echo ==============================================================================
echo [1/3] Starting LuxeStay REST API Backend Server on port 5001...
start "LuxeStay Backend API (Port 5001)" cmd /k "node backend/server.js"

timeout /t 2 >nul

echo [2/3] Starting LuxeStay Frontend Vite Server on port 3000...
start "LuxeStay Frontend (Port 3000)" cmd /k "bun run dev -- --port 3000"

timeout /t 3 >nul

echo [3/3] Opening LuxeStay Platform in your default browser...
start http://localhost:3000

echo.
echo ==============================================================================
echo  LUXESTAY PLATFORM ACTIVE!
echo  Frontend URL : http://localhost:3000
echo  Backend API  : http://localhost:5001/api/health
echo.
echo  VERIFIED DEMO CREDENTIALS:
echo   - Guest Diamond VIP : arun.traveler@example.com   / Password@123
echo   - Property Manager  : manager.mumbai@luxestay.com / Password@123
echo   - Front Office Desk : frontdesk@luxestay.com      / Password@123
echo   - Platform Executive: admin@luxestay.com          / Password@123
echo ==============================================================================
echo.
pause
