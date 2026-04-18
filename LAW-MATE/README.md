# LAW-MATE: AI + ML Legal Assistant Platform

A comprehensive full-stack legal assistant platform combining AI chat capabilities with advanced machine learning analytics for legal case analysis.

## 🚀 Features

### 🤖 AI Assistant (Gemini Integration)
- Interactive legal chatbot powered by Google's Gemini AI
- Contextual legal advice and guidance
- Real-time conversation interface

### 📊 ML Insights Dashboard
- **Legal Case Classification**: Automatically categorize legal issues
- **Severity Prediction**: Assess case urgency and risk levels
- **Case Similarity Search**: Find precedents and similar cases
- **Dataset Analytics**: Real-time insights with interactive charts
- **Explainability**: Keyword analysis for prediction transparency

### 🏛️ Real-World Legal Datasets
- **15,000+ Indian legal cases** from multiple court levels
- **Supreme Court judgments**
- **High Court cases**
- **District Court records**
- **FIR/Crime data**
- **Real-time data simulation**

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML Service    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Flask)       │
│                 │    │                 │    │                 │
│ • ML Dashboard  │    │ • API Routes    │    │ • Classification │
│ • Chat Interface│    │ • Dataset Stats │    │ • Severity Pred │
│ • Analytics     │    │ • Data Proxy    │    │ • Similarity    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Clear Separation of Concerns
- **AI Assistant**: Pure conversational AI (Gemini)
- **ML Insights**: Pure analytical ML (no chat integration)
- **Dataset Layer**: Real-time legal data processing

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Sequelize ORM** for database
- **CORS** enabled for cross-origin requests

### ML Service
- **Flask** web framework
- **scikit-learn** for ML algorithms
- **pandas** for data processing
- **TF-IDF vectorization**
- **Real-time dataset processing**

### AI Integration
- **Google Generative AI (Gemini)**
- **Contextual legal conversations**

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd law-mate

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install ML service dependencies
cd ml_service
pip install -r requirements.txt
cd ..
```

### 2. Dataset Processing

```bash
cd ml_service
python run_dataset_processing.py
```

This generates:
- 15,000+ processed legal cases
- Training data splits
- Dataset statistics

### 3. Train ML Models

```bash
cd ml_service
python train_classifier.py
python train_severity.py
python train_similarity.py
```

### 4. Start Services

#### Terminal 1: ML Service
```bash
cd ml_service
python ml_service.py
```
Runs on `http://localhost:8000`

#### Terminal 2: Backend API
```bash
cd backend
npm start
```
Runs on `http://localhost:5001`

#### Terminal 3: Frontend
```bash
npm run dev
```
Runs on `http://localhost:5173`

#### Alternative: Start all services
```bash
npm run dev:all
```

## 🎯 Usage

### ML Insights Dashboard
Navigate to `/ml-insights` for:
- **Case Analysis**: Input legal case descriptions
- **Real-time Predictions**: Instant classification and severity
- **Similarity Search**: Find related cases
- **Dataset Insights**: View analytics and statistics

### AI Chat Assistant
Use the main interface for:
- Legal consultations
- General legal advice
- Document analysis
- Case strategy discussions

## 📊 ML Pipeline

### Data Processing
1. **Dataset Integration**: Combine multiple Indian legal sources
2. **Text Cleaning**: Remove duplicates, normalize text
3. **Feature Engineering**: TF-IDF vectorization (max 1000 features)
4. **Label Encoding**: Categorical variables for classification

### Model Training
1. **Classification**: Logistic Regression on TF-IDF features
2. **Severity**: Random Forest regression for risk scoring
3. **Similarity**: Cosine similarity on TF-IDF vectors

### Real-time Inference
1. **Input Processing**: Text → TF-IDF transformation
2. **Model Prediction**: Parallel inference across models
3. **Result Aggregation**: Combined analytics output

## 🔧 API Endpoints

### ML Service (Port 8000)
```
GET  /health              - Service health check
POST /classify            - Case classification
POST /severity            - Severity prediction
POST /similarity          - Similar case search
POST /analyze             - Combined analysis
POST /ml/predict-type     - Classification (ML prefix)
POST /ml/predict-severity - Severity (ML prefix)
POST /ml/similar-cases    - Similarity (ML prefix)
GET  /dataset/stats       - Dataset statistics
```

### Backend API (Port 5001)
```
GET  /api/health              - Health check
GET  /api/dataset/stats       - Dataset statistics proxy
POST /api/legal/analyze       - Legal analysis (Gemini)
POST /api/legal/past-analysis - Historical case analysis
```

## 📈 Dataset Statistics

- **Total Cases**: 15,420+
- **Case Types**: 14 categories
- **Court Levels**: Supreme, High, District, Police
- **Time Range**: 2 years of historical data
- **Real-time Updates**: Simulated live data feed

### Top Case Categories
1. Criminal Law (3,240 cases)
2. Family Matters (2,890 cases)
3. Civil Disputes (2,650 cases)
4. Consumer Complaints (2,380 cases)
5. Property Disputes (2,110 cases)

## 🚀 Deployment

### Production Setup
1. Configure environment variables
2. Set up production databases
3. Deploy ML models to cloud
4. Configure load balancing
5. Set up monitoring and logging

### Docker Support (Future)
- Containerized ML service
- Orchestrated deployment
- Scalable architecture

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Indian judiciary for case data inspiration
- Google for Gemini AI integration
- Open source ML community
- Legal technology innovators

---

**LAW-MATE**: Empowering legal access through AI and ML innovation.
| Layer | Technologies |
|-------|--------------|
| Frontend | React / Next.js, TailwindCSS, shadcn UI |
| Backend | Node.js / Express or FastAPI |
| Database | Firestore |
| AI | Google Gemini |
| Hosting | Google Cloud Run |
| Storage | Firebase / Cloud Storage |

---

## 🎨 Theme & Branding

The site now uses a bold, gradient‑friendly color scheme (purple → pink → cyan) with animated backgrounds and glowing accents. The logo file lives in `public/lawmate-logo.svg`; replace it with your official mark if needed.

## ⚙️ Installation & Setup

This repo contains two parts: a React + Vite frontend and an Express + Sequelize backend.

### Backend (development)

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment**
   - **GEMINI_API_KEY** – the backend calls Google Gemini.  For local development
     you can leave this unset or set it to `your_api_key`; the server will then
     return a harmless stub response instead of failing with a 500 error.
   - **DATABASE_URL** – For simple development you don’t need a database server
     at all; the app will automatically fall back to a local SQLite file
     (`backend/database.sqlite`) if `DATABASE_URL` is not defined or is a
     placeholder.  If you do have PostgreSQL, set it to something like:
     ```env
     DATABASE_URL=postgresql://user:pass@localhost:5432/lawmate
     ```
3. **Start server**
   ```bash
   npm run dev    # from the backend/ folder
   ```
   You should see:
   > Database connection established.
   > Models synchronized.
   > Server running on port 5000
   
   If you ever hit a `500` from the frontend, check the backend console for a
   descriptive error and make sure the API key is set (or rely on the stub).
### Frontend (development)

1. **Back at the project root**, install deps and start Vite:
   ```bash
   npm install
   npm run dev
   ```
2. **Tell the client where the API lives**
   Create an env file at the project root (e.g. `.env.local`) containing:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   The app logs the computed base URL on startup (`API_BASE = …`).

### Full run

With both servers running, navigate to `http://localhost:3000` in your browser.
The legal‑assistant chat will now successfully call the backend instead of showing
"Network error...".

### Notes

- The previous README text referred to Firestore / Cloud Run etc.; that’s from an
  older template and can be ignored for local development.

---


