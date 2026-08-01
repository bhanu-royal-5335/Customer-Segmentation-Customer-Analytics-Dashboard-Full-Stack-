# Customer Segmentation & Customer Analytics Dashboard (Full Stack) 🚀

An end-to-end, production-ready AI-powered Customer Segmentation Dashboard. Businesses can upload customer datasets (CSV/Excel), store records in MongoDB Atlas, run K-Means Clustering Machine Learning algorithms via a Python microservice, and explore visual analytics & automated marketing recommendations.

---

## 🌟 Key Features

- **JWT Authentication & Security**: Register, Login, Token authorization, bcrypt hashing, Helmet security, Rate limiting, CORS, and Input Validation.
- **Dataset Upload & Automatic Column Mapping**: Drag-and-drop CSV/Excel file upload with progress tracking and header normalization.
- **K-Means Machine Learning (Python)**:
  - StandardScaler feature scaling.
  - Automatic optimal cluster determination via Silhouette / Elbow method.
  - Serialized model saving (`joblib`).
  - Automated persona classification (High-Value Premium, Loyal Frequent, Potential High Spender, Budget Sensitive, At-Risk Churn).
- **Interactive Analytics Dashboard**:
  - 8+ KPI Stat Cards (Total Customers, Active, Premium, Budget, Avg Income, Spend, Frequency, CLV).
  - 6+ Recharts visualizations (Bar Chart, Pie Chart, Line Chart, Scatter Plot, Donut Chart, Radar Chart, Correlation Heatmap).
- **Customer Directory & Filtering**: Multi-criteria filters (Gender, City, Category, Cluster, Income, Age) and instant search.
- **Customer Detail Modal**: Individual profile inspection, demographic breakdown, RFM metrics, and AI next-best-action recommendations.
- **Executive Reporting & Export**: Download PDF Executive Reports, Excel Master Workbooks, raw CSVs, or print optimized views.

---

## 🛠️ Technology Stack

### Frontend (`/frontend`)
- **Framework**: React.js + TypeScript + Vite
- **Styling**: Tailwind CSS + Glassmorphism SaaS UI + Dark/Light Mode
- **Icons**: Lucide React
- **Charts**: Recharts
- **Exporting**: jsPDF, autoTable, XLSX

### Backend (`/backend`)
- **Runtime**: Node.js + Express.js (TypeScript)
- **Database**: MongoDB Atlas via Mongoose ODM (with automatic fallback to in-memory dataset)
- **Authentication**: JWT & bcryptjs
- **File Upload**: Multer, PapaParse, XLSX

### Machine Learning Microservice (`/python`)
- **Language**: Python 3.10+
- **API Framework**: Flask & Flask-CORS
- **Libraries**: Scikit-Learn, Pandas, NumPy, Joblib, Matplotlib, Seaborn

---

## 📁 Project Folder Structure

```
customer-segmentation/
├── sample_customers.csv
├── docker-compose.yml
├── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/       # StatCard, ChartsSection, ClusterSummaryCard, AIInsightsCard
│   │   │   ├── customers/       # CustomerTable, CustomerFilters
│   │   │   ├── upload/          # FileDropzone
│   │   │   └── layout/          # Navbar, Sidebar
│   │   ├── pages/               # Dashboard, UploadPage, CustomersPage, CustomerDetailPage, SegmentsPage, ReportsPage, Login, Register
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── services/            # api.ts (Axios REST client)
│   │   └── types/               # index.ts (TypeScript interfaces)
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/              # db.ts (MongoDB Atlas connection)
│   │   ├── controllers/         # authController, customerController, analyticsController, mlController
│   │   ├── middleware/          # auth.ts, upload.ts
│   │   ├── models/              # User.ts, Customer.ts, Dataset.ts
│   │   ├── routes/              # authRoutes, customerRoutes, analyticsRoutes
│   │   └── utils/               # columnMapper.ts, mockData.ts
│   ├── package.json
│   └── tsconfig.json
│
└── python/
    ├── app.py                   # Flask REST API
    ├── model.py                 # CustomerSegmentationModel (K-Means & StandardScaler)
    ├── train.py                 # Training script
    ├── predict.py               # Prediction script
    └── requirements.txt
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0+
- **Python**: v3.9+
- **MongoDB**: Local instance or MongoDB Atlas Connection URI

---

### 2. Python ML Microservice Setup

```bash
cd python
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*The Python ML service will run on `http://localhost:5001`.*

---

### 3. Express Backend Setup

```bash
cd backend
npm install
npm run dev
```
*The Express server will run on `http://localhost:5000`.*

---

### 4. React Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🔗 REST API Endpoint Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new analyst account |
| `POST` | `/api/auth/login` | Login and obtain JWT token |
| `POST` | `/api/upload` | Upload CSV/Excel dataset & trigger ML segmentation |
| `GET` | `/api/customers` | Get paginated customer records with search & filters |
| `GET` | `/api/customer/:id` | Get individual customer profile |
| `POST` | `/api/customer` | Add new customer record & run prediction |
| `PUT` | `/api/customer/:id` | Update customer details |
| `DELETE` | `/api/customer/:id` | Delete customer record |
| `GET` | `/api/dashboard` | Get KPI metrics and top city/category summary |
| `GET` | `/api/analytics` | Get chart data series (Bar, Donut, Scatter, Line, Radar, Heatmap) |
| `GET` | `/api/insights` | Get AI business insights & campaign playbooks |
| `POST` | `/api/train` | Retrain K-Means ML Model on current dataset |
| `GET` | `/api/clusters` | Get ML cluster personas and statistics |

---

## 🌐 Deployment Guide

### Deploying Frontend to Vercel
1. Push project to GitHub.
2. Connect repository to Vercel.
3. Set Root Directory to `frontend`.
4. Build command: `npm run build`, Output Directory: `dist`.

### Deploying Backend & ML API to Render
1. Create a Web Service on Render for `/backend` (Node.js).
2. Create a Web Service on Render for `/python` (Python 3).
3. Set environment variable `PYTHON_API` on backend to point to Python Render URL.
