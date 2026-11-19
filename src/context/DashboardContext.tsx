import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { DashboardState, Certification, FieldEntry, DayStatus, Theme } from '../types/dashboard';
import { initialDashboardState } from '../data/seedData';

const STORAGE_KEY = 'learning_progress_dashboard_v6';

interface DashboardActions {
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  updatePlanDayStatus: (day: number, status: DayStatus) => void;
  updatePlanDayNotes: (day: number, notes: string) => void;
  addFieldEntry: (entry: FieldEntry) => void;
  updateFieldEntry: (id: string, updates: Partial<FieldEntry>) => void;
  deleteFieldEntry: (id: string) => void;
  toggleTheme: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  resetToSeed: () => void;
}

type DashboardContextValue = DashboardState & DashboardActions;

const DashboardContext = createContext<DashboardContextValue | null>(null);

function loadState(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DashboardState;
      if (parsed.certifications && parsed.planDays && parsed.fieldEntries) {
        // Merge any new seed entries that aren't yet in localStorage by id
        const existingFieldIds = new Set(parsed.fieldEntries.map(e => e.id));
        const missingFieldEntries = initialDashboardState.fieldEntries.filter(
          e => !existingFieldIds.has(e.id)
        );

        const existingOemIds = new Set((parsed.oemSessions || []).map(s => s.id));
        const missingOemSessions = (initialDashboardState.oemSessions || []).filter(
          s => !existingOemIds.has(s.id)
        );

        return {
          ...parsed,
          fieldEntries: [...parsed.fieldEntries, ...missingFieldEntries],
          oemSessions: [...(parsed.oemSessions || []), ...missingOemSessions],
        };
      }
    }
  } catch {
    // fall through to seed
  }
  return initialDashboardState;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const addCertification = useCallback((cert: Certification) => {
    setState(prev => ({ ...prev, certifications: [...prev.certifications, cert] }));
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<Certification>) => {
    setState(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteCertification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  }, []);

  const updatePlanDayStatus = useCallback((day: number, status: DayStatus) => {
    setState(prev => ({
      ...prev,
      planDays: prev.planDays.map(d => (d.day === day ? { ...d, status } : d)),
    }));
  }, []);

  const updatePlanDayNotes = useCallback((day: number, notes: string) => {
    setState(prev => ({
      ...prev,
      planDays: prev.planDays.map(d => (d.day === day ? { ...d, notes } : d)),
    }));
  }, []);

  const addFieldEntry = useCallback((entry: FieldEntry) => {
    setState(prev => ({ ...prev, fieldEntries: [...prev.fieldEntries, entry] }));
  }, []);

  const updateFieldEntry = useCallback((id: string, updates: Partial<FieldEntry>) => {
    setState(prev => ({
      ...prev,
      fieldEntries: prev.fieldEntries.map(e => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, []);

  const deleteFieldEntry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      fieldEntries: prev.fieldEntries.filter(e => e.id !== id),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: (prev.theme === 'dark' ? 'light' : 'dark') as Theme,
    }));
  }, []);

  const exportJSON = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importJSON = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as DashboardState;
      if (parsed.certifications && parsed.planDays && parsed.fieldEntries) {
        setState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const resetToSeed = useCallback(() => {
    setState(initialDashboardState);
  }, []);

  const value: DashboardContextValue = {
    ...state,
    addCertification,
    updateCertification,
    deleteCertification,
    updatePlanDayStatus,
    updatePlanDayNotes,
    addFieldEntry,
    updateFieldEntry,
    deleteFieldEntry,
    toggleTheme,
    exportJSON,
    importJSON,
    resetToSeed,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return ctx;
}
