# 🌾 AgriSense MVP

> **AI-Powered Voice-Based Agricultural Field Data Collection for Low-Literacy Workers**

AgriSense is an offline-first mobile web application that empowers agricultural field workers to report crop issues, pest outbreaks, weather alerts, and irrigation problems using voice in their native language (English, Hindi, Tamil). The platform automatically classifies reports, extracts key information, and generates bilingual summaries for decision-makers.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 Problem Statement

Rural agricultural workers face challenges reporting field observations due to:
- Low literacy rates limiting text-based reporting
- Limited internet connectivity in rural areas
- Language barriers with English-only systems
- Time-consuming manual data entry

**AgriSense solves this** with a single-button voice interface that works offline and supports regional languages.

---

## ✨ Key Features

### 🎙️ **Voice-First Interface**
- One-tap recording button
- Real-time speech recognition using Web Speech API
- Supports Hindi (हिंदी), Tamil (தமிழ்), English

### 🌐 **Offline-First Architecture**
- Works without internet connection
- Stores up to 10 reports locally (IndexedDB)
- Auto-syncs when connection restored
- Progressive Web App (PWA) ready

### 🤖 **Intelligent Processing**
- **Domain Classification**: Automatically categorizes into 6 agricultural domains
- **Entity Extraction**: Identifies crops, pests, diseases, locations
- **Severity Detection**: Assigns priority (Low/Medium/High/Critical)
- **Bilingual Summaries**: Generates local language + English summaries

### 📍 **Geo-Tagging**
- Automatic GPS coordinate capture (high accuracy)
- Enables spatial analysis of pest/disease outbreaks
- Location displayed in reports for field mapping

### 🌏 **Multilingual UI**
- Entire app interface adapts to selected language
- No mixed-language clutter
- Native language experience for workers

---

## 🌾 Agricultural Domains

| Domain | Icon | Examples |
|--------|------|----------|
| **Pest Outbreak** | 🐛 | Locust swarms, caterpillar damage, aphid infestation |
| **Crop Disease** | 🦠 | Blight, fungal infections, leaf rust, wilt |
| **Water Stress** | 💧 | Drought, irrigation shortage, moisture deficit |
| **Soil Issue** | 🌱 | Erosion, salinity, nutrient deficiency, compaction |
| **Weather Alert** | 🌤️ | Storm, hail, extreme heat/cold, frost |
| **Irrigation Problem** | 💦 | Pump failure, canal blockage, pipe leak |

## 📁 Project Structure

```
GramSense/
├── client/              # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Home.tsx      # Record button screen
│   │   │   └── Summary.tsx   # Review/edit screen
│   │   └── main.tsx
│   └── core/            # Core business logic
│       ├── types.ts     # TypeScript definitions
│       ├── pipeline.ts  # Main processing pipeline
│       ├── asr.ts       # Speech recognition (Whisper)
│       ├── domain.ts    # Domain classifier
│       ├── nlu.ts       # NLU engine
│       └── storage.ts   # IndexedDB wrapper
├── backend/             # Backend API (FastAPI)
│   ├── api/
│   │   └── routes.py    # API endpoints
│   ├── core/
│   │   ├── models.py    # Pydantic models
│   │   └── database.py  # Data layer
│   └── main.py          # FastAPI app
├── ml/                  # ML models (future)
│   ├── asr/             # Whisper ONNX models
│   └── nlu/             # NLU models
├── security/            # Encryption utilities
│   ├── crypto.ts        # Client-side crypto
│   └── crypto.py        # Backend crypto
├── infra/               # Infrastructure
│   └── Dockerfile.client
└── docs/                # Documentation

```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.11+
- Docker & Docker Compose (optional)

### Local Development

#### 1. Install Client Dependencies

```bash
npm install
```

#### 2. Start Frontend

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

#### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### 4. Start Backend

```bash
cd backend
python main.py
```

Backend API will be available at `http://localhost:8000`

### Docker Deployment

```bash
docker-compose up -d
```

This starts both frontend and backend services.

## 🎙️ User Flow

1. **Home Screen**: User sees one large record button
2. **Recording**: User presses button and speaks in their language
3. **Processing**: Automatic transcription, classification, and summary generation
4. **Summary Screen**: User sees bilingual summary with:
   - Domain category
   - Severity level
   - Local language summary
   - English summary
   - Extracted entities
5. **Edit/Confirm**: User can edit summaries or confirm submission
6. **Storage**: Report saved locally (auto-sync when online)

## 🧠 AI Pipeline

```
Audio Blob
    ↓
[PCM Conversion]
    ↓
[Whisper ASR] → Transcription + Language Detection
    ↓
[Domain Classifier] → Agriculture/Water/Waste/Health/Infrastructure/Sanitation
    ↓
[NLU Engine] → Extract: Issue, Severity, Location, Entities
    ↓
[Summary Generator] → Bilingual Summaries
    ↓
Report Object → IndexedDB
```

### ASR Engine (`client/core/asr.ts`)

- **Input**: Audio Blob (WebM/Opus)
- **Processing**: 
  - Convert to PCM 16kHz mono
  - Extract mel spectrogram
  - Run Whisper Small/Base (ONNX quantized)
  - Language detection (hi/ta/en)
- **Output**: Transcription + Language + Confidence

### Domain Classifier (`client/core/domain.ts`)

- **Method**: Rule-based keyword matching
- **Keywords**: Multilingual dictionaries for 6 domains
- **Output**: Domain + Confidence

### NLU Engine (`client/core/nlu.ts`)

- **Entity Extraction**: Pattern matching for domain-specific entities
- **Severity Detection**: Keyword-based urgency classification
- **Location Extraction**: Pattern matching for place mentions
- **Summary Generation**: Template-based bilingual summaries

## 📡 API Endpoints

### Backend API (`http://localhost:8000`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Detailed health status |
| `/api/reports` | POST | Submit a new report |
| `/api/reports` | GET | Get all reports |
| `/api/reports/{id}` | GET | Get specific report |
| `/api/analytics` | GET | Get analytics dashboard |

### Example: Submit Report

```bash
curl -X POST http://localhost:8000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": 1700000000000,
    "audio_duration": 15.5,
    "language": "hi",
    "transcription": "खेत में पानी नहीं आ रहा है",
    "domain": "agriculture",
    "severity": "high",
    "issue": "खेत में पानी नहीं आ रहा है",
    "location": "गांव के पास",
    "entities": ["पानी", "खेत"],
    "summary_local": "गंभीर समस्या: खेत में पानी नहीं आ रहा है",
    "summary_en": "Critical issue: Water not reaching the farm"
  }'
```

## 🔐 Security

### Client-Side Encryption (`security/crypto.ts`)

- **Algorithm**: AES-256-GCM
- **Key Management**: Web Crypto API
- **Use Cases**: Sensitive data encryption in IndexedDB

### Backend Security (`security/crypto.py`)

- **Algorithm**: AES-256-GCM (cryptography library)
- **Hashing**: SHA-256 for data integrity
- **Use Cases**: Report encryption, integrity verification

## 💾 Storage

### IndexedDB Schema (`client/core/storage.ts`)

- **Store**: `reports`
- **Key**: `id` (string)
- **Indexes**: 
  - `by-timestamp`: Sort by timestamp
  - `by-synced`: Filter unsynced reports
- **Max Records**: 10 (oldest auto-deleted)

### Storage API

```typescript
import { saveReport, getReports, deleteReport } from '@core/storage';

// Save report
await saveReport(report);

// Get all reports
const reports = await getReports();

// Delete report
await deleteReport(reportId);
```

## 🌐 Offline Capabilities

- **Audio Recording**: No network required
- **ASR Processing**: Local Whisper ONNX model (to be integrated)
- **Domain Classification**: Local rule-based system
- **NLU**: Local pattern matching
- **Storage**: IndexedDB (persistent)
- **Sync**: Background sync when online

## 🎨 UI Design Principles

1. **Minimal Interaction**: One button to start
2. **Large Touch Targets**: 160px record button
3. **Visual Feedback**: Clear recording/processing states
4. **Bilingual Text**: Local language + English everywhere
5. **Simple Colors**: High contrast for outdoor visibility
6. **No Typing Required**: Voice-first, edit optional

## 📱 Mobile Optimization

- **Responsive**: Works on all screen sizes
- **Touch-Optimized**: Large buttons (140-160px)
- **PWA-Ready**: Can be installed as app
- **Offline-First**: Works without connectivity
- **Low Bandwidth**: Minimal network usage

## 🔧 Configuration

### Frontend (`vite.config.ts`)

```typescript
{
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': './client/src',
      '@core': './client/core'
    }
  }
}
```

### Backend (`.env`)

```bash
ENV=production
SECRET_KEY=your-secret-key
```

## 🧪 Testing

### Test Audio Recording

1. Open `http://localhost:3000`
2. Click the red record button
3. Speak clearly in Hindi/Tamil/English
4. Click stop
5. View generated summary

### Test Backend API

```bash
# Health check
curl http://localhost:8000/health

# Get analytics
curl http://localhost:8000/api/analytics
```

## 📊 Analytics Dashboard

Access `/api/analytics` for:

- Total reports count
- Distribution by domain
- Distribution by severity
- Distribution by language
- Recent reports (last 10)

## 🚧 Future Enhancements

### Phase 2: Production ML Models

- [ ] Integrate actual Whisper ONNX models
- [ ] Optimize model size (quantization)
- [ ] Add VAD (Voice Activity Detection)
- [ ] Fine-tune for Indian English/Hindi/Tamil accents

### Phase 3: Advanced Features

- [ ] GPS location capture
- [ ] Photo attachment
- [ ] Offline maps
- [ ] Multi-user support
- [ ] Admin dashboard
- [ ] Heatmap visualization

### Phase 4: Scalability

- [ ] PostgreSQL database
- [ ] Redis caching
- [ ] Load balancing
- [ ] CDN for static assets
- [ ] S3 for audio storage

## 🐛 Troubleshooting

### Issue: Microphone not accessible

**Solution**: Grant microphone permissions in browser settings

### Issue: TypeScript errors

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Backend not starting

**Solution**:
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Issue: Docker build fails

**Solution**:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Core Team: GramSense Development Team
- Submission: GHCI Innovation Challenge


---

**Built with ❤️ for rural India**
