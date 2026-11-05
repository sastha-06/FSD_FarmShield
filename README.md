# 🌾 FarmShield – AI-Powered Farmer Support & Decision Platform

> **"Smarter Farming Starts with Better Decisions."**  
> Empowering agricultural producers with AI-powered crop disease detection, smart crop planning, and context-aware agricultural advisory.

---

## 🚀 Standout Features

### 1. Context-Aware Crop Diagnosis & Advisory
Unlike standard crop disease detection applications that only classify an isolated leaf photo, **FarmShield** synthesizes the computer vision diagnosis with the farmer's registered agricultural context:
- **Field Agronomic Profile:** Soil type (Alluvial, Black, Red, Loamy, Clay, etc.) and irrigation method (Drip, Sprinkler, Flood, Rainfed).
- **Nutritional History:** Fertilizer application logs with dates (Urea, DAP, NPK balance).
- **Crop Lifecycle:** Automatic calculation of days elapsed since sowing and growth stage estimation (Germination, Seedling, Vegetative, Flowering, Fruiting, Maturity).
- **Meteorological Conditions:** Real-time regional ambient temperature, relative humidity, and rainfall via Open-Meteo meteorological stations.

The platform produces a structured 4-part advisory report:
1. **AI Image Prediction:** Detected disease condition, model name, and confidence score.
2. **Possible Contributing Factors:** Grounded environmental, water management, fertilizer history, growth stage, and soil considerations (clearly distinguished from confirmed causes).
3. **Personalized Precautions:** Safe field practices, canopy moisture reduction, and preventive measures.
4. **Recommended Next Steps:** Actionable field scouting instructions, tissue sample checks, and agronomist extension consultation guidelines.

### 3. Multi-Factor Smart Crop Planning & Weather Intelligence
FarmShield features an enterprise-grade agronomic decision support engine designed to recommend crops based on the actual agricultural conditions of the farmer's plot, not just soil type:
- **8-Factor Configurable Recommendation Scoring:**
  - **Location & Agro-Climatic Suitability (15%):** GPS coordinates, agro-climatic zones (TNAU / ICAR), regional crop calendars.
  - **Season & Planting Window (15%):** Sowing seasons (Kharif, Rabi, Zaid) and Tamil Nadu regional pattams (Kuruvai, Samba, Thaladi, Navarai, Chithirai pattam, Adipattam).
  - **Weather & Climate Suitability (15%):** Open-Meteo real-time temperature, 7-day forecast, and regional climate normal baselines.
  - **Soil Type & Drainage (10%):** Geological texture and drainage tolerance (Well-drained, Moderate, Poor/Waterlogged, Excessive).
  - **Soil Nutrients & pH (15%):** Soil pH, Available Nitrogen (N), Phosphorus (P), Potassium (K), Organic Carbon (OC %), Electrical Conductivity (EC dS/m), and Micronutrients (Zinc, Iron, Boron).
  - **Water Availability & Source (15%):** Water source (Borewell, Canal, River, Tank, Rainfed) and availability level (High, Moderate, Low). Enforces **Critical Water Constraints** (e.g. high-water crops like Rice/Sugarcane receive a critical veto if water is Low).
  - **Irrigation Compatibility (5%):** Method alignment (Drip, Sprinkler, Flood, Rainfed).
  - **Previous Crop & Rotation Benefit (5%):** Nitrogen-fixing pulse succession, pest break cycles, and monocropping avoidance.
- **Data Completeness & Transparent Explanations:**
  - Calculates a separate 0-100% data completeness rating.
  - Transparently labels recommendations as **Provisional** when soil tests or water data are missing, without assuming false ideal conditions.
  - Detailed factor-by-factor breakdown, positive reasons, potential field risks, and practical precautions.
- **Interactive Crop Profitability & Economics Estimator:**
  - Cultivation cost per acre breakdown (seeds, fertilizers, plant protection, labour, irrigation/power).
  - Expected yield range and benchmark market selling prices (TNAU / e-NAM benchmarks).
  - Farmer-adjustable market price input with dynamic revenue, net profit, and break-even calculations.
- **Farm Climate Risk Alerts:**
  - Automated risk detection from Open-Meteo 7-day forecasts: Heat stress (>37°C), heavy rainfall (>35mm), dry spells, and foliar disease weather windows (high humidity + moderate warmth).

### 4. DIGIPIN & Interactive Field Geo-Location
Precision agricultural planning requires authentic geographic location. FarmShield features a complete, native digital addressing & interactive GIS mapping module:
- **Official India Post / IIT Hyderabad DIGIPIN Integration:**
  - 10-character alphanumeric grid dividing India into $\sim3.8\text{m} \times 3.8\text{m}$ micro-plots (e.g. `39J-49L-L8T4`).
  - Native mathematical decoder and encoder (Bounding box: Lat `2.5°N` - `38.5°N`, Lon `63.5°E` - `99.5°E`).
  - No synthetic or fabricated DIGIPINs; uses the authentic 16-symbol alphabet (`23456789CFJKLMPT`).
- **Interactive Leaflet + OpenStreetMap Map:**
  - Search any Indian village, mandal, taluk, town, or district.
  - Interactive clickable map with draggable custom seedling marker for fine-tuning plot boundaries.
  - Automatic reverse geocoding via OpenStreetMap Nominatim.
- **On-Demand Device GPS:**
  - One-click "Use My Current Location" button requesting browser permission strictly on user action.
- **Field-Level Isolation & Non-Destructive Edits:**
  - Each field maintains its own exact coordinates, DIGIPIN, village, district, state, and location source (`DIGIPIN`, `GPS`, `MAP`).
  - Editing agronomic details (fertilizers, irrigation, crop variety) safely preserves existing location data.
- **Hyper-Local Meteorological Precision:**
  - Saved plot coordinates feed directly into Open-Meteo weather lookups, providing hyper-local climate intelligence for crop planning and disease diagnostics.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend** | React.js 18 (ES6+ JavaScript, JSX only — *no TypeScript*), Tailwind CSS, React Router DOM v6, Axios, Lucide React, Recharts |
| **Backend** | Node.js (v22), Express.js (ES Modules), REST APIs, Multer (Leaf Image Processing), CORS |
| **Database** | MongoDB & Mongoose (with automated fallback to persistent JSON storage engine for zero-configuration local runs) |
| **AI / Computer Vision** | DINOv2-small Quantized ONNX (`rodynaemad/plant-disease-dinov2-small`, ~24MB), `onnxruntime-node`, `sharp` image preprocessing, 38 PlantVillage condition classes across 14 crops, 768-dim embedding centroid Out-Of-Distribution (OOD) leaf detection |
| **Authentication** | JSON Web Tokens (JWT), bcrypt password hashing, Protected Routes |
| **Weather** | Open-Meteo Meteorological API (live, keyless, non-blocking) |

---

## 🎨 Nature-Inspired Premium AgriTech SaaS Design System

| Color Name | Hex Code | Purpose |
|---|---|---|
| **Forest Green** | `#174C35` | Primary buttons, active navigation, brand headers |
| **Fresh Green** | `#65A66B` | Secondary accents, positive growth indicators, badges |
| **Light Sage** | `#DCEBDD` | Highlights, subtle backgrounds, active pills |
| **Soft Cream** | `#F5F7EF` | Main page background |
| **White** | `#FFFFFF` | Cards, forms, modals |
| **Deep Charcoal** | `#26352D` | Main text headings & body |
| **Muted Green** | `#78857B` | Secondary text, helper labels |
| **Border Green** | `#E4EAE2` | Subtle dividers, container borders |
| **Warning Amber** | `#D99B37` | Cautions, estimated stage indicators |
| **Error Red** | `#C65D52` | Critical alerts, validation errors |

**Typography:** *Plus Jakarta Sans* for headings, *Inter* for body text, inputs, and forms.

---

## 📁 Project Architecture

```
FARM_Shield/
├── client/                     # React Frontend (JavaScript / JSX)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Sidebar, Header, Modal, Badge, Card, Alert, Button)
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, DashboardPage,
│   │   │                       # MyFieldsPage, CropPlanningPage, CropAnalysisPage,
│   │   │                       # AnalysisHistoryPage, ProfilePage
│   │   ├── services/           # Axios API client
│   │   ├── App.jsx             # React Router structure & protected layouts
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind CSS directives & custom styling
│   ├── index.html              # HTML shell with Google Fonts
│   ├── tailwind.config.js      # Custom theme color palette & border radiuses
│   └── vite.config.js          # Vite configuration with API proxy
│
├── server/                     # Node.js & Express REST Backend
│   ├── src/
│   │   ├── config/             # Database connection (MongoDB / Persistent Engine)
│   │   ├── controllers/        # Auth, Field, Crop, Analysis, Advisory, Profile, Stats controllers
│   │   ├── middleware/         # JWT verification (`auth.js`), Multer upload (`upload.js`)
│   │   ├── models/             # Mongoose Schemas (Farmer, Field, FertilizerRecord, DiseaseAnalysis, Advisory)
│   │   ├── routes/             # REST API routes
│   │   ├── services/           # Crop rules engine, AI service runner, Context-Aware advisory engine, Weather service
│   │   └── server.js           # Express application & SPA production server
│   └── uploads/                # Crop leaf image upload storage
│
├── ai_service/                 # Python Computer Vision / AI Module
│   ├── plantvillage_mobilenet.onnx # PlantVillage Crop Disease ONNX Model
│   ├── build_model.py          # Model architecture generator
│   ├── predict.py              # Botanical validation & ONNX inference script
│   └── requirements.txt        # Python dependencies (pillow, numpy, onnxruntime)
│
├── test_e2e_native.js          # Automated 10-step full-stack verification script
└── package.json                # Root orchestration scripts
```

---

## ⚡ Quick Start & Execution

### 1. Prerequisites
- **Node.js**: v18+ (tested on v22)
- **MongoDB** *(Optional)*: Connects to MongoDB Atlas via `MONGODB_URI` in `server/.env`. If MongoDB is offline, FarmShield seamlessly activates its persistent JSON storage engine with zero configuration!
- **AI Model Assets**: Run `npm run setup-model --prefix server` to download the official 24MB quantized DINOv2 ONNX model (`model_with_features_quantized.onnx`), `centroids.f32`, and `meta.json`.

### 2. Run the Full-Stack Application

From the project root:

```bash
# Step 1: Ensure dependencies and AI model are downloaded
npm install --prefix server
npm install --prefix client
npm run setup-model --prefix server

# Step 2: Build frontend
npm run build --prefix client

# Step 3: Start the complete unified full-stack server
npm run server
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

```bash
# Option B: Run in development mode with hot-reloading
# Terminal 1 (Backend):
npm run start --prefix server

# Terminal 2 (Vite Frontend with Proxy):
npm run dev --prefix client
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Automated Verification Test Suite

FarmShield includes comprehensive test suites covering all system modules:

```bash
# 1. Run All FarmShield Test Suites (Multi-factor Unit Tests, REST API E2E, DIGIPIN E2E, DINOv2 ONNX E2E)
node test_all_suites.js

# 2. Local DINOv2 ONNX Disease Classification E2E (29 checks)
cd server; node test_local_dinov2_e2e.js

# 3. Multi-Factor Crop Recommendation & Weather Unit Tests (31 checks)
node test_multi_factor_crop_system.js

# 4. Multi-Factor REST API E2E Tests (27 checks)
node test_multifactor_api_e2e.js

# 5. DIGIPIN & Location Selection E2E Verification (7 checks)
node test_location_e2e.js
```

### Verified Multi-Factor Checks (`test_multi_factor_crop_system.js`):
- `[1/8]` Expanded 20-crop database with TNAU/ICAR agronomic parameters
- `[2/8]` Open-Meteo coordinate-based weather, 7-day forecast & regional climate normal
- `[3/8]` Scenario A: Wetland Plot (Clay soil, canal, high water -> Rice/Banana/Sugarcane)
- `[4/8]` Scenario B: Dryland Plot (Red soil, low water, rainfed -> Millets/Pulses/Groundnut)
- `[5/8]` Critical Water Deficit Veto (penalizing high-water crops under low water availability)
- `[6/8]` Soil pH sensitivity and nutrient deficiency penalty
- `[7/8]` Data Completeness scoring (0-100%) and Provisional vs Validated labeling
- `[8/8]` Interactive Crop Profitability Estimator & Farm Climate Risk Alerts

---

## 📜 API Reference Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | `POST` | Register a new farmer account |
| `/api/auth/login` | `POST` | Authenticate farmer and obtain JWT |
| `/api/auth/me` | `GET` | Get authenticated farmer profile |
| `/api/fields` | `GET`, `POST` | List all fields / Register new agricultural field with soil health & water profile |
| `/api/fields/:id` | `GET`, `PUT`, `DELETE` | Retrieve, update, or remove a registered field (non-destructive) |
| `/api/location/digipin/resolve` | `POST` | Decode 10-char DIGIPIN into coordinates & reverse geocode address |
| `/api/location/digipin/encode` | `POST` | Convert GPS latitude and longitude into official DIGIPIN |
| `/api/location/reverse-geocode` | `GET` | Reverse geocode coordinates to village, district, state & PIN |
| `/api/location/search` | `GET` | Search Indian towns, villages, and landmarks via Nominatim |
| `/api/crops/recommend` | `POST` | Multi-factor crop recommendations with factor scores & completeness |
| `/api/crops/:fieldId` | `GET` | Retrieve field recommendations or planted growth stage + risk alerts |
| `/api/crops/profitability` | `POST` | Interactive crop economics & custom market price estimation |
| `/api/analysis/predict` | `POST` | Upload leaf image, run AI model & generate context advisory |
| `/api/analysis/history` | `GET` | Retrieve past crop diagnoses for the authenticated farmer |
| `/api/analysis/:id` | `GET` | View complete diagnostic report with advisory breakdown |
| `/api/advisory/:analysisId`| `GET` | Retrieve context-aware advisory for a specific analysis |
| `/api/stats/dashboard` | `GET` | Get aggregated dashboard statistics and recent activity |
| `/api/profile` | `GET`, `PUT` | View or update farmer profile |
| `/api/profile/password`| `PUT` | Change account password securely |
| `/api/health` | `GET` | API health and database status |
| `/api/advisory/:analysisId`| `GET` | Retrieve context-aware advisory for a specific analysis |
| `/api/stats/dashboard` | `GET` | Get aggregated dashboard statistics and recent activity |
| `/api/profile` | `GET`, `PUT` | View or update farmer profile |
| `/api/profile/password`| `PUT` | Change account password securely |
| `/api/health` | `GET` | API health and database status |

---

## 🌾 Built for Sustainable & Intelligent Agriculture
Developed with care for farmers and agronomic researchers worldwide.
