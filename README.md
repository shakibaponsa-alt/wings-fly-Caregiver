# Wings Fly Caregiver Academy - Management System

A modern, feature-rich web application for managing Wings Fly Caregiver Academy operations including student registrations, finance tracking, and administrative tasks.

## 🚀 Features

### ✅ Completed Modules
- **Dashboard**: Overview with statistics, target progress, recent activities
- **Students Management**: Complete CRUD operations, search, filter, profile viewer
- **Finance**: Income/expense tracking, transaction management
- **Accounts**: Cash management, bank accounts, mobile banking (bKash, Nagad, etc.)

### 🔄 Coming Soon
- Attendance tracking
- Exams management
- Visitors log
- HR/Staff management
- ID card generation
- Google Sheets sync

## 📊 Current Data

- **175 Students** imported from CSV
- **6 Courses** available
- Sample finance data included
- Bank accounts auto-detected from student data

## 🎨 Design Features

- Premium dark theme with glassmorphism effects
- Smooth animations and micro-interactions
- Fully responsive (mobile, tablet, desktop)
- Bengali & English language support
- Modern gradient accents

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage**: LocalStorage (offline-first)
- **Icons**: Font Awesome 6
- **Fonts**: Inter, Noto Sans Bengali

## 📁 File Structure

```
e:\caregiver\
├── index.html              # Main HTML structure
├── styles.css              # Premium CSS design system
├── app.js                  # Core application logic
├── dashboard.js            # Dashboard module
├── students.js             # Student management
├── finance.js              # Finance & accounts
├── data-importer.js        # CSV data import
├── logo.jpeg               # Academy logo
└── Copy of Fainal Wings Fly Caregiver (web app) - Form Responses 1.csv
```

## 🚀 How to Use

### Method 1: Local (Easiest)
1. Open `e:\caregiver\index.html` in your browser
2. That's it! The app will work offline.

### Method 2: GitHub Pages (Recommended for sharing)
1. Create a GitHub account (if you don't have one)
2. Create a new repository named "wings-fly-academy"
3. Upload all files to the repository
4. Go to Settings → Pages → Enable GitHub Pages
5. Your app will be live at: `https://[username].github.io/wings-fly-academy/`

### Method 3: Google Apps Script (For Google Sheets integration)
1. Open Google Sheets
2. Extensions → Apps Script
3. Copy the files and deploy as web app
4. Follow the deployment guide below

## 📱 Usage Guide

### Adding Students
1. Click "Students" in sidebar
2. Click "Add New Student" button
3. Fill in the form
4. Click "Save Student"

### Managing Finance
1. Click "Finance" in sidebar
2. Click "Add Transaction" to add income/expense
3. View all transactions in the table

### Viewing Accounts
1. Click "Accounts" in sidebar
2. See Cash, Bank Accounts, and Mobile Banking
3. Update cash amount as needed

## 🔄 Google Sheets Sync (Future Feature)

The app is ready for Google Sheets integration. When you're ready:
1. Create Google Sheets for Students and Finance
2. We'll add sync functionality
3. Real-time data sync between app and sheets

## 💾 Data Management

### Export Data
- Click the export button to download data as CSV
- All student and transaction data will be saved

### Import Data
- Data automatically imports from CSV on first load
- Future: Manual import/export options

## 🎯 Keyboard Shortcuts

- `Ctrl/Cmd + K`: Focus search bar
- `Escape`: Close any open modal

## 🌐 Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Any modern browser with ES6 support

## 📞 Support

For any issues or questions:
- Email: support@wingsflyacademy.com
- Phone: [Your contact number]

## 📝 Notes

- All data is stored locally in browser (LocalStorage)
- No data is sent to any server (100% offline)
- Clear browser data will reset the app
- Backup your data regularly using export

## 🔐 Security

- No external API calls
- No tracking or analytics
- All data stays on your device
- Safe for sensitive student information

---

**Wings Fly Caregiver Academy** © 2026  
*Empowering caregivers, enriching lives*
