
# 🚗 RYDIO - Car Rental System

RYDIO is a modern car rental platform built with **MERN Stack** (MongoDB, Express.js, React, Node.js).  
It allows users to book cars, manage rentals, and handle payments with wallet management.  
The project follows **SOLID principles**, clean architecture, and reusable components for scalability.

---

## ✨ Features

### 🔹 User Side
- 🚘 Browse and book cars  
- 📅 Manage booking slots (with conflict handling)  
- 💳 Wallet management & payments  
- ❤️ Wishlist cars  
- 🔔 Notifications for booking updates  
- 💬 Chat support  

### 🔹 Admin Side
- 🛠️ Manage cars, locations, and users  
- ✅ Approve or reject bookings  
- ❌ Cancel bookings with refund support  
- 💳 Wallet tracking for users  
- 📊 Dashboard with analytics  
- 🔔 Send notifications  

---

## 🏗️ Tech Stack

- **Frontend**: React, Redux, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT  
- **Deployment**: Docker, GitHub Actions (CI/CD)  

---

## 📂 Project Structure
```

RYDIO/
│── frontend/        # React + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/   # Admin, User, Wallet services
│   │   ├── pages/
│   │   └── redux/
│
│── backend/         # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── services/
│
│── docker-compose.yml
│── README.md

````

---

## ⚙️ Installation & Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/RYDIO.git
   cd RYDIO
````

2. Install dependencies

   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables

   * Create `.env` files in `frontend/` and `backend/`
   * Add values like **MongoDB URI, JWT\_SECRET, API Keys**

4. Run the project

   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start frontend
   cd frontend
   npm run dev
   ```

---

## 🧪 Testing

Run unit tests for backend:

```bash
cd backend
npm test
```

---

## 🚀 Deployment

* Backend: \[Heroku / Render / AWS / Docker]
* Frontend: \[Vercel / Netlify]
* Database: MongoDB Atlas

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Contributions are always welcome!
Fork the repo, make changes, and submit a PR 🚀

---

## 👨‍💻 Author

* **Adhil (Aadil)**
  Aspiring MERN Stack Developer 💻
  [LinkedIn](https://www.linkedin.com/in/adhil-p-a6a836311/)
