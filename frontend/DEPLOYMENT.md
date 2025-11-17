# Frontend Deployment Guide

## API Endpoint Configuration

Frontend sudah dikonfigurasi untuk mudah mengganti endpoint backend.

### Cara Mengganti Endpoint Backend

#### 1. **Development (Local)**
- Tidak perlu setup apapun
- Vite proxy otomatis mengarahkan `/api` ke `http://localhost:5000`
- File `vite.config.js` sudah dikonfigurasi

#### 2. **Production (Vercel/Deployment)**
- Buat file `.env` di folder `frontend/` (atau set di Vercel Environment Variables)
- Tambahkan:
  ```env
  VITE_API_URL=https://your-backend.vercel.app
  ```
- Ganti `https://your-backend.vercel.app` dengan URL backend Anda

### Cara Setup di Vercel

1. **Deploy Frontend ke Vercel:**
   - Connect repository ke Vercel
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

2. **Set Environment Variable:**
   - Di Vercel dashboard, buka project settings
   - Masuk ke "Environment Variables"
   - Tambahkan:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://your-backend.vercel.app`
     - **Environment:** Production, Preview, Development (sesuai kebutuhan)

3. **Redeploy:**
   - Setelah set environment variable, redeploy project

### File yang Sudah Diupdate

Semua file yang menggunakan axios sudah diupdate untuk menggunakan `apiClient`:
- ✅ `src/pages/Home.jsx`
- ✅ `src/pages/Level.jsx`
- ✅ `src/pages/Dinoku.jsx`
- ✅ `src/utils/axios.js` (file baru)

### Cara Kerja

1. **File `src/utils/axios.js`:**
   - Membuat axios instance dengan `baseURL` dari environment variable
   - Jika `VITE_API_URL` tidak ada, menggunakan empty string (relative path)
   - Di development, Vite proxy akan handle routing

2. **Semua API calls:**
   - Menggunakan `apiClient` dari `utils/axios.js`
   - Otomatis menggunakan baseURL yang sudah dikonfigurasi

### Contoh Penggunaan

```javascript
// Sebelum (hardcoded):
import axios from 'axios';
const res = await axios.get('/api/player');

// Sesudah (configurable):
import apiClient from '../utils/axios';
const res = await apiClient.get('/api/player');
```

### Testing

1. **Development:**
   ```bash
   cd frontend
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Proxy otomatis mengarahkan `/api` ke backend

2. **Production:**
   - Set `VITE_API_URL` di environment variable
   - Build: `npm run build`
   - Deploy ke Vercel

### Catatan Penting

- ✅ Semua endpoint sudah menggunakan `apiClient`
- ✅ Mudah mengganti endpoint dengan environment variable
- ✅ Tidak perlu ubah code, cukup set `VITE_API_URL`
- ✅ Development tetap menggunakan Vite proxy (tidak perlu setup)

