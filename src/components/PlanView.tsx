import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Flame,
  Search,
  Edit3,
  Cpu,
  HardDrive,
  Network,
  Terminal,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import type { Pillar, DayStatus, PlanDay } from '../types/dashboard';

const PILLARS: Pillar[] = [
  'Compute & GPU Sizing',
  'Enterprise Storage & IOPS',
  'Network Fabric (Spine-Leaf / EVPN-VXLAN)',
  'Kubernetes & IaC (Terraform)',
  'Security Architecture',
  'CXO BOQ & Capstone',
];

const pillarMeta: Record<Pillar, { icon: typeof Cpu; color: string; badge: string }> = {
  'Compute & GPU Sizing': {
    icon: Cpu,
    color: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  'Enterprise Storage & IOPS': {
    icon: HardDrive,
    color: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  'Network Fabric (Spine-Leaf / EVPN-VXLAN)': {
    icon: Network,
    color: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  'Kubernetes & IaC (Terraform)': {
    icon: Terminal,
    color: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  'Security Architecture': {
    icon: ShieldCheck,
    color: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
  'CXO BOQ & Capstone': {
    icon: FileCheck,
    color: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
};

export default function PlanView() {
  const { planDays, updatePlanDayStatus, updatePlanDayNotes } = useDashboard();

  const [selectedPillar, setSelectedPillar] = useState<'all' | Pillar>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | DayStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing notes state
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const masteredCount = useMemo(
    () => planDays.filter(d => d.status === 'mastered').length,
    [planDays]
  );
  const inProgressCount = useMemo(
    () => planDays.filter(d => d.status === 'in_progress').length,
    [planDays]
  );
  const notStartedCount = useMemo(
    () => planDays.filter(d => d.status === 'not_started').length,
    [planDays]
  );
  const progressPercent = Math.round((masteredCount / planDays.length) * 100);

  const filteredDays = useMemo(() => {
    return planDays.filter(day => {
      if (selectedPillar !== 'all' && day.pillar !== selectedPillar) return false;
      if (selectedStatus !== 'all' && day.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = day.title.toLowerCase().includes(q);
        const matchNotes = day.notes.toLowerCase().includes(q);
        const matchPillar = day.pillar.toLowerCase().includes(q);
        const matchResources = day.resources.some(r => r.toLowerCase().includes(q));
        if (!matchTitle && !matchNotes && !matchPillar && !matchResources) return false;
      }
      return true;
    });
  }, [planDays, selectedPillar, selectedStatus, searchQuery]);

  const startEditNotes = (day: PlanDay) => {
    setEditingDay(day.day);
    setNotesInput(day.notes);
  };

  const saveNotes = (dayNum: number) => {
    updatePlanDayNotes(dayNum, notesInput.trim());
    setEditingDay(null);
  };

  return (
    <div className="space-y-8">
      {/* ── Header & Progress ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
              30-Day Solution Architect Mastery Plan
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
            Daily Learning & Architecture Roadmap
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Intensive 30-day curriculum across 6 core infrastructure pillars.
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] shadow-sm">
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">Curriculum Progress</div>
            <div className="text-xl font-bold font-mono text-emerald-500">
              {masteredCount} / {planDays.length}{' '}
              <span className="text-xs text-slate-400 font-normal">({progressPercent}%)</span>
            </div>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                className="stroke-slate-100 dark:stroke-[#182032]"
                strokeWidth="3.5"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="3.5"
                strokeDasharray="88"
                strokeDashoffset={88 - (88 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* ── KPI Pillar Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PILLARS.map(p => {
          const meta = pillarMeta[p];
          const Icon = meta.icon;
          const daysInPillar = planDays.filter(d => d.pillar === p);
          const masteredInPillar = daysInPillar.filter(d => d.status === 'mastered').length;
          const isSelected = selectedPillar === p;

          return (
            <div
              key={p}
              onClick={() => setSelectedPillar(isSelected ? 'all' : p)}
              className={`rounded-xl border p-3.5 cursor-pointer transition-all ${isSelected
                  ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500'
                  : 'border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] hover:border-slate-300 dark:hover:border-slate-600'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={meta.color} />
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {masteredInPillar}/5
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                {p}
              </h4>
              <div className="h-1 rounded-full bg-slate-100 dark:bg-[#182032] overflow-hidden mt-2">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(masteredInPillar / 5) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters & Search ── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search curriculum by topic, architecture concept, notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] overflow-x-auto">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${selectedStatus === 'all'
                  ? 'bg-cyan-500/10 text-cyan-500 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              All Days ({planDays.length})
            </button>
            <button
              onClick={() => setSelectedStatus('mastered')}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${selectedStatus === 'mastered'
                  ? 'bg-emerald-500/10 text-emerald-500 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              Mastered ({masteredCount})
            </button>
            <button
              onClick={() => setSelectedStatus('in_progress')}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${selectedStatus === 'in_progress'
                  ? 'bg-amber-500/10 text-amber-500 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setSelectedStatus('not_started')}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${selectedStatus === 'not_started'
                  ? 'bg-slate-500/10 text-slate-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              Pending ({notStartedCount})
            </button>
          </div>
        </div>

        {selectedPillar !== 'all' && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Filtering by pillar:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {selectedPillar}
            </span>
            <button
              onClick={() => setSelectedPillar('all')}
              className="text-cyan-500 hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* ── 30-Day Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDays.map(day => {
          const meta = pillarMeta[day.pillar];
          const isMastered = day.status === 'mastered';
          const isInProgress = day.status === 'in_progress';
          const isEditingNotes = editingDay === day.day;

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all bg-white dark:bg-[#0D1526] shadow-sm ${isMastered
                  ? 'border-slate-200 dark:border-slate-800 hover:border-slate-700'
                  : isInProgress
                    ? 'border-amber-500/50 ring-1 ring-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-[#0D1526]/50'
                }`}
            >
              <div>
                {/* Header: Day Number + Pillar */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-mono font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                    DAY {day.day.toString().padStart(2, '0')}
                  </span>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded border truncate max-w-[200px] ${meta.badge}`}
                  >
                    {day.pillar.split('(')[0]}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {day.title}
                </h3>

                {/* Notes Section */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-semibold text-slate-300">Architecture Notes</span>
                    {!isEditingNotes && (
                      <button
                        onClick={() => startEditNotes(day)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-1"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                    )}
                  </div>

                  {isEditingNotes ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={notesInput}
                        onChange={e => setNotesInput(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-lg border border-cyan-500 bg-slate-50 dark:bg-[#182032] text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingDay(null)}
                          className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveNotes(day.day)}
                          className="px-3 py-1 rounded text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-[#121C30] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      {day.notes || 'No notes recorded yet. Click Edit to add key architectural takeaways.'}
                    </p>
                  )}
                </div>

                {/* Resources */}
                {day.resources.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {day.resources.map(res => (
                      <span
                        key={res}
                        className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-[#182032] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1F2937]"
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#1F2937] flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Status:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updatePlanDayStatus(day.day, 'mastered')}
                    className={`px-2 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${isMastered
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <CheckCircle2 size={12} /> Mastered
                  </button>

                  <button
                    onClick={() => updatePlanDayStatus(day.day, 'in_progress')}
                    className={`px-2 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${isInProgress
                        ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <Flame size={12} /> Active
                  </button>

                  <button
                    onClick={() => updatePlanDayStatus(day.day, 'not_started')}
                    className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${!isMastered && !isInProgress
                        ? 'bg-slate-500/20 text-slate-400 font-bold border border-slate-500/30'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
