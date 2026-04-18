import axios from 'axios';
import type { AnalysisResult, PastIncidentAnalysisResult } from '../types';

// Base URL for backend; configure via Vite environment variable (e.g. in .env.local).
// Vite exposes `import.meta.env.VITE_*` values at build time.  When unset we
// default to `http://localhost:5000` so that local development "just works", and
// the log below makes it easy to confirm what was used.
const API_BASE =
  (import.meta.env.VITE_API_URL as string) ||
  'http://localhost:5001';

// ML Service base URL
const ML_BASE = (import.meta.env.VITE_ML_API_URL as string) || 'http://localhost:8000';

// temporary debug; remove once requests are working
console.log('API_BASE =', API_BASE);
console.log('ML_BASE =', ML_BASE);

export async function analyzeLegal(query: string, category: string = ''): Promise<AnalysisResult> {
  const url = `${API_BASE}/api/legal/analyze`;
  try {
    const res = await axios.post(url, { query, category });
    return res.data;
  } catch (err: any) {
    // make network errors more explicit
    if (axios.isAxiosError(err) && err.message === 'Network Error') {
      throw new Error(`Network Error reaching ${url}`);
    }
    throw err;
  }
}

export async function getHistory() {
  const res = await axios.get(`${API_BASE}/api/legal/history`);
  return res.data;
}

export async function pastAnalysis(incident: string, incidentYear: number): Promise<PastIncidentAnalysisResult> {
  const res = await axios.post(`${API_BASE}/api/legal/past-analysis`, { incident, incidentYear });
  return res.data;
}

export async function checkSchemes(body: { income: number; category: string; state: string; occupation: string; }) {
  const res = await axios.post(`${API_BASE}/api/schemes/check-eligibility`, body);
  return res.data;
}

// ML Service APIs
export async function predictCaseType(text: string) {
  try {
    const res = await axios.post(`${ML_BASE}/classify`, { text });
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    if (axios.isAxiosError(err) && err.message === 'Network Error') {
      throw new Error(`ML Service unavailable at ${ML_BASE}/classify`);
    }
    throw err;
  }
}

export async function predictSeverity(text: string) {
  try {
    const res = await axios.post(`${ML_BASE}/severity`, { text });
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    if (axios.isAxiosError(err) && err.message === 'Network Error') {
      throw new Error(`ML Service unavailable at ${ML_BASE}/severity`);
    }
    throw err;
  }
}

export async function findSimilarCases(text: string, top_k: number = 5) {
  try {
    const res = await axios.post(`${ML_BASE}/similarity`, { text, top_k });
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    if (axios.isAxiosError(err) && err.message === 'Network Error') {
      throw new Error(`ML Service unavailable at ${ML_BASE}/similarity`);
    }
    throw err;
  }
}

export async function getDatasetStats() {
  try {
    const res = await axios.get(`${API_BASE}/api/dataset/stats`);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    if (axios.isAxiosError(err) && err.message === 'Network Error') {
      throw new Error(`Backend API unavailable at ${API_BASE}/api/dataset/stats`);
    }
    throw err;
  }
}
