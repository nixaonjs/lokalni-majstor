# Lokalni Majstor

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node-dot-js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

Lokalni Majstor is a full-stack web application designed to connect local handymen and service providers with users who need quick and reliable assistance.  
The goal of the project is to offer a clean, fast and modern marketplace where anyone can create service listings, browse available offers, save favorites, and manage their profile with ease.

This project is currently in active development.

---

## 🚀 Tech Stack

### **Frontend**
- React (Vite)
- React Router
- Axios
- TailwindCSS (custom UI enhancements)
- Hot Toast notifications
- LocalStorage state persistence
- Responsive design (mobile-first)

### **Backend**
- Node.js + Express
- PostgreSQL + pg
- JWT authentication
- Multer image uploading
- REST API architecture

---

## ✨ Features Implemented

### **🔐 Authentication**
- User registration and login
- JWT-based session handling stored in localStorage
- Protected routes on backend + frontend

### **👤 User Profile**
- User info display
- List of user's own published ads
- Ability to edit or delete each ad
- Proper backend filtering by `owner_id`

### **📢 Ads System**
- Create new ads with:
  - title  
  - description  
  - category  
  - location  
  - price  
  - image upload  
- Edit existing ads
- Delete ads
- Server-side image storage with Multer
- Clean and optimized SQL queries

### **🔍 Search & Filtering**
- Keyword search (accent-insensitive)
- Category filtering
- City filtering
- Pagination (page, limit)
- Search tokens processed to handle multi-word queries

### **❤️ Favorites System**
- Add or remove favorites with a single click
- Animated heart icon
- Hot Toast success messages
- Favorites stored in database per user
- Persistent across refresh and sessions
- Proper syncing on login/logout
- Dedicated endpoint:  
  - `GET /api/favorites`
  - `POST /api/favorites/:id`
  - `DELETE /api/favorites/:id`

### **🖼 Ad Details Page**
- Full-screen lightbox image viewer
- Carousel navigation (keyboard + arrows)
- Clean UI layout
- Share/copy link support
- Displays:
  - owner details  
  - contact button  
  - formatted date  
  - dynamic “time ago”  

### **🌐 Main Homepage**
- Grid layout for ads
- Category shortcuts
- Search bar
- Pagination buttons
- Responsive design for mobile

### **📱 Mobile Navigation**
- Slide-down menu with:
  - My Ads  
  - Favorites  
  - Profile  
  - Logout  
- Hamburger menu animation

---

## 🚀 Installation & Setup Guide

Follow the steps below to run the project locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/andjelicn/lokalni-majstor.git
```

```bash
cd lokalni-majstor
```

2️⃣ Backend Setup

```bash
cd backend
```
Install dependencies

```bash
npm install
```
Create a .env file (copy from .env.example):

```bash

``PORT=5000
DB_USER=your-postgres-username
DB_HOST=localhost
DB_NAME=lokalni_majstor
DB_PASSWORD=your-postgres-password
DB_PORT=5432
JWT_SECRET=your-secret-key``
```
Run database migrations or create required tables manually if 
needed.

Start the backend server: 

```bash
npm start
```

The backend should now be running on:

``http://localhost:5000``

3️⃣ Frontend Setup

Open a new terminal and navigate into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a .env file:

``VITE_API_URL=http://localhost:5000/api``

Start the development server:

```bash
npm run dev
```

Your frontend should now be available at:

``http://localhost:5173``

4️⃣ Login & Usage

	•	Register a new account from the frontend.
   
	•	Log in to receive a JWT token.
   
	•	Tokens are automatically saved and attached to authenticated requests.
   
	•	You can now create ads, edit them, delete them, and add/remove favorites.
