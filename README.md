🚀 Features
👤 User System

Registration & Login (JWT Auth)

Two roles:

User — can browse and contact workers

Majstor — can create and manage ads

(Admin role planned for v2)

📢 Ads (Oglasi)

Create an ad with title, description, category, city, and price

View all ads on the homepage

Filter by category or location

View detailed ad page

Edit and delete ads (soon to be implemented)

Pagination support (if implemented in backend)

Image upload for ads

📲 Contact System

Display phone number / email for contacting workers

Viber / WhatsApp link support (optional)

🏗️ Tech Stack
Backend

Node.js

Express

PostgreSQL

pg library

JWT Authentication

Bcrypt password hashing

Frontend

React (Vite)

Axios

React Router

TailwindCSS 

📁 Project Structure
lokalni-majstor/
   backend/
      src/
      package.json
   frontend/
      src/
      package.json

⚙️ How to Run Locally
Backend:
cd backend
npm install
npm start


Create .env in backend:

DATABASE_URL=your-db-url
JWT_SECRET=your-secret
PORT=5000

Frontend:
cd frontend
npm install
npm run dev

📝 Todo / Upcoming Features

 Edit ads (in progress)

 User roles: admin

 Report system for ads

 Email notification service

 Full responsive UI polish

👤 Author

Nikolaj Anđelić
Banja Luka 🇧🇦
Full-stack developer in progress.

📄 License

MIT License (free to use with credit to the author)