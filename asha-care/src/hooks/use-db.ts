import { useState, useEffect, useCallback } from 'react';
import { 
  Patient, AppSettings, getPatients, getPatient, savePatient, 
  deletePatient, markAllSynced, getSettings, saveSettings, seedDBIfEmpty 
} from '../lib/db';

export function useDB() {
  const [isReady, setIsReady] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const loadData = useCallback(async () => {
    const pts = await getPatients();
    const sets = await getSettings();
    setPatients(pts.sort((a, b) => b.updatedAt - a.updatedAt));
    setSettings(sets);
  }, []);

  useEffect(() => {
    seedDBIfEmpty().then(() => {
      loadData().then(() => setIsReady(true));
    });
  }, [loadData]);

  const addOrUpdatePatient = async (patient: Patient) => {
    patient.updatedAt = Date.now();
    patient.syncedAt = null; // Needs sync
    await savePatient(patient);
    await loadData();
  };

  const removePatient = async (id: string) => {
    await deletePatient(id);
    await loadData();
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    await saveSettings(newSettings);
    await loadData();
  };

  const syncData = async () => {
    await markAllSynced();
    await loadData();
  };

  return {
    isReady,
    patients,
    settings,
    addOrUpdatePatient,
    removePatient,
    updateSettings,
    syncData,
    refresh: loadData
  };
}
