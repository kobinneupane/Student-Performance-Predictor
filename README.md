# 📊 Student Performance Predictor

A full-stack application to predict student performance (Pass/Fail) using **Machine Learning + MERN Stack**.  

---

## 📌 Tech Stack
- **Frontend** → React.js  
- **Backend** → Node.js + Express.js  
- **Database** → MongoDB  
- **Machine Learning** → Python (scikit-learn, XGBoost, SVM, CNN)  

---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/student-performance-predictor.git
cd student-performance-predictor

Backend Setup (Node.js + Express + MongoDB)
cd backend
npm install

Create a .env file inside the backend folder with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Run the backend server:
npm start
server runs at: http://localhost:5000

Frontend Setup (React.js)

Open a new terminal and run:

cd frontend
npm install
npm start

Machine Learning Setup (Python)
cd ml
pip install -r requirements.txt
jupyter notebook



student-performance-predictor/
│── backend/              # Node.js + Express + MongoDB code
│   ├── routes/
│   ├── models/
│   ├── server.js
│   └── package.json
│
│── frontend/             # React.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
│── ml/                   # ML notebooks & datasets
│   ├── dataset.csv
│   ├── model_training.ipynb
│   └── requirements.txt
│
│── docs/                 # Reports, diagrams, PPTs
│── .gitignore
│── README.md
