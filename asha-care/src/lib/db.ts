import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

export type PatientType = 'pregnancy' | 'child' | 'general';

export interface Vital {
  at: number;
  systolic?: number;
  diastolic?: number;
  weight?: number; // kg
  riskScore: number; // 0=LOW, 1=MEDIUM, 2=HIGH — derived at time of recording
  note?: string;
}

export interface Patient {
  id: string;
  type: PatientType;
  name: string;
  age: number;
  village: string;
  bp: { systolic: number; diastolic: number } | null;
  pregnancyWeek: number | null;
  vaccinationStatus: { vaccine: string; given: boolean }[] | null;
  tbSymptoms: boolean;
  notes: string;
  createdAt: number;
  updatedAt: number;
  history: { at: number; change: string }[];
  vitals: Vital[];
  syncedAt: number | null;
}

export type Role = 'asha' | 'doctor' | 'supervisor' | 'portal';

export interface AppSettings {
  id: 'settings';
  currentRole: Role;
  language: string;
  ttsEnabled: boolean;
}

interface AshaCareDB extends DBSchema {
  patients: {
    key: string;
    value: Patient;
    indexes: { 'by-syncedAt': number | null };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

let dbPromise: Promise<IDBPDatabase<AshaCareDB>>;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<AshaCareDB>('asha-care-db', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
          patientStore.createIndex('by-syncedAt', 'syncedAt');
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          // v2: added vitals[] field. Clear existing patients so seed re-runs with new shape.
          if (db.objectStoreNames.contains('patients')) {
            db.deleteObjectStore('patients');
            const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
            patientStore.createIndex('by-syncedAt', 'syncedAt');
          }
        }
      },
    });
  }
  return dbPromise;
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();

const SEED_PATIENTS: Patient[] = [
  {
    id: uuidv4(),
    type: 'pregnancy',
    name: 'Priya Sharma',
    age: 26,
    village: 'Rampur',
    bp: { systolic: 145, diastolic: 95 }, // HIGH risk (BP)
    pregnancyWeek: 37, // HIGH risk (>36)
    vaccinationStatus: null,
    tbSymptoms: false,
    notes: 'Complaining of slight headache. Needs immediate referral.',
    createdAt: NOW - 60 * DAY,
    updatedAt: NOW,
    history: [
      { at: NOW - 60 * DAY, change: 'Created record' },
      { at: NOW - 35 * DAY, change: 'BP slightly elevated (130/85)' },
      { at: NOW - 14 * DAY, change: 'BP rising (138/88)' },
      { at: NOW - 3 * DAY, change: 'High BP detected (145/95) — referred' },
    ],
    vitals: [
      { at: NOW - 60 * DAY, systolic: 118, diastolic: 76, riskScore: 0, note: 'Initial visit' },
      { at: NOW - 45 * DAY, systolic: 122, diastolic: 78, riskScore: 0 },
      { at: NOW - 35 * DAY, systolic: 130, diastolic: 85, riskScore: 1 },
      { at: NOW - 21 * DAY, systolic: 135, diastolic: 86, riskScore: 1 },
      { at: NOW - 14 * DAY, systolic: 138, diastolic: 88, riskScore: 1 },
      { at: NOW - 7 * DAY, systolic: 142, diastolic: 92, riskScore: 2 },
      { at: NOW - 3 * DAY, systolic: 145, diastolic: 95, riskScore: 2 },
    ],
    syncedAt: NOW,
  },
  {
    id: 'b5a03423-1d09-42b7-8db1-e6e2db7dc1d3', // Fixed ID for portal test
    type: 'general',
    name: 'Ramesh Kumar',
    age: 45,
    village: 'Rampur',
    bp: { systolic: 120, diastolic: 80 },
    pregnancyWeek: null,
    vaccinationStatus: null,
    tbSymptoms: true, // HIGH risk (TB)
    notes: 'Coughing for 3 weeks. Sputum test pending.',
    createdAt: NOW - 90 * DAY,
    updatedAt: NOW,
    history: [
      { at: NOW - 90 * DAY, change: 'Created record' },
      { at: NOW - 30 * DAY, change: 'Reported persistent cough' },
      { at: NOW - 10 * DAY, change: 'TB symptoms confirmed — sputum sent' },
    ],
    vitals: [
      { at: NOW - 90 * DAY, systolic: 118, diastolic: 78, weight: 64, riskScore: 0 },
      { at: NOW - 60 * DAY, systolic: 120, diastolic: 80, weight: 63, riskScore: 0 },
      { at: NOW - 30 * DAY, systolic: 122, diastolic: 80, weight: 61, riskScore: 1, note: 'Cough started' },
      { at: NOW - 14 * DAY, systolic: 121, diastolic: 79, weight: 59, riskScore: 2 },
      { at: NOW - 3 * DAY, systolic: 120, diastolic: 80, weight: 58, riskScore: 2 },
    ],
    syncedAt: null,
  },
  {
    id: uuidv4(),
    type: 'child',
    name: 'Baby Aarti',
    age: 1,
    village: 'Sitapur',
    bp: null,
    pregnancyWeek: null,
    vaccinationStatus: [
      { vaccine: 'Polio', given: true },
      { vaccine: 'BCG', given: true },
      { vaccine: 'Hep B', given: false }, // MEDIUM risk (1 missed)
      { vaccine: 'DPT', given: true },
      { vaccine: 'Measles', given: true },
    ],
    tbSymptoms: false,
    notes: 'Active baby. Missed one vaccine due to fever.',
    createdAt: NOW - 120 * DAY,
    updatedAt: NOW,
    history: [
      { at: NOW - 120 * DAY, change: 'Created record' },
      { at: NOW - 90 * DAY, change: 'BCG administered' },
      { at: NOW - 60 * DAY, change: 'Polio drops given' },
      { at: NOW - 30 * DAY, change: 'DPT administered' },
      { at: NOW - 14 * DAY, change: 'Hep B postponed — child had fever' },
    ],
    vitals: [
      { at: NOW - 120 * DAY, weight: 7.8, riskScore: 0 },
      { at: NOW - 90 * DAY, weight: 8.1, riskScore: 0 },
      { at: NOW - 60 * DAY, weight: 8.6, riskScore: 0 },
      { at: NOW - 30 * DAY, weight: 9.0, riskScore: 0 },
      { at: NOW - 14 * DAY, weight: 9.1, riskScore: 1, note: 'Hep B missed' },
    ],
    syncedAt: NOW,
  },
  {
    id: uuidv4(),
    type: 'general',
    name: 'Sunita Devi',
    age: 34,
    village: 'Sitapur',
    bp: { systolic: 110, diastolic: 75 },
    pregnancyWeek: null,
    vaccinationStatus: null,
    tbSymptoms: false,
    notes: 'Regular checkup. All normal.',
    createdAt: NOW - 180 * DAY,
    updatedAt: NOW,
    history: [
      { at: NOW - 180 * DAY, change: 'Created record' },
      { at: NOW - 90 * DAY, change: 'Routine checkup — normal' },
      { at: NOW - 30 * DAY, change: 'Routine checkup — normal' },
    ],
    vitals: [
      { at: NOW - 180 * DAY, systolic: 115, diastolic: 78, riskScore: 0 },
      { at: NOW - 120 * DAY, systolic: 112, diastolic: 76, riskScore: 0 },
      { at: NOW - 90 * DAY, systolic: 110, diastolic: 75, riskScore: 0 },
      { at: NOW - 60 * DAY, systolic: 113, diastolic: 76, riskScore: 0 },
      { at: NOW - 30 * DAY, systolic: 110, diastolic: 75, riskScore: 0 },
      { at: NOW - 7 * DAY, systolic: 110, diastolic: 75, riskScore: 0 },
    ],
    syncedAt: null,
  },
];

export async function seedDBIfEmpty() {
  const db = await initDB();
  const count = await db.count('patients');
  if (count === 0) {
    const tx = db.transaction('patients', 'readwrite');
    for (const p of SEED_PATIENTS) {
      tx.store.put(p);
    }
    await tx.done;
  }
  
  const settings = await db.get('settings', 'settings');
  if (!settings) {
    await db.put('settings', {
      id: 'settings',
      currentRole: 'asha',
      language: 'en-IN',
      ttsEnabled: true,
    });
  }
}

export async function getPatients(): Promise<Patient[]> {
  const db = await initDB();
  return db.getAll('patients');
}

export async function getPatient(id: string): Promise<Patient | undefined> {
  const db = await initDB();
  return db.get('patients', id);
}

export async function savePatient(patient: Patient): Promise<void> {
  const db = await initDB();
  await db.put('patients', patient);
}

export async function deletePatient(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('patients', id);
}

export async function markAllSynced(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('patients', 'readwrite');
  const index = tx.store.index('by-syncedAt');
  let cursor = await index.openCursor(null);
  const now = Date.now();
  
  while (cursor) {
    const patient = cursor.value;
    patient.syncedAt = now;
    cursor.update(patient);
    cursor = await cursor.continue();
  }
  await tx.done;
}

export async function getSettings(): Promise<AppSettings> {
  const db = await initDB();
  const s = await db.get('settings', 'settings');
  return s || { id: 'settings', currentRole: 'asha', language: 'en-IN', ttsEnabled: true };
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const db = await initDB();
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await db.put('settings', updated);
  return updated;
}
