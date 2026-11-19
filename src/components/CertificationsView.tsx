import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Clock,
  Target,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  X,
  Layers,
  Sparkles,
  Check,
  Building2,
  BookOpen,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import type { Certification, Vendor, Domain, CertStatus } from '../types/dashboard';

const VENDORS: Vendor[] = [
  'Nutanix',
  'NetApp',
  'Cohesity',
  'Cisco',
  'Dell',
  'Lenovo',
  'IBM',
  'HPE',
  'Other',
];

const DOMAINS: Domain[] = [
  'HCI',
  'Storage',
  'Data Protection',
  'Networking',
  'Compute',
  'AI Infra',
];

export function formatCertDate(dateStr: string): string {
  if (!dateStr || !dateStr.trim()) return '';
  if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parts[2].padStart(2, '0');
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day}-${months[monthIdx]}-${year}`;
    }
  }
  return dateStr;
}

export default function CertificationsView() {
  const {
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
  } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | CertStatus>('all');
  const [selectedVendor, setSelectedVendor] = useState<'all' | Vendor>('all');
  const [selectedDomain, setSelectedDomain] = useState<'all' | Domain>('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // Quick action state for marking complete
  const [completeTargetCert, setCompleteTargetCert] = useState<Certification | null>(null);
  const [completionDateInput, setCompletionDateInput] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Quick date edit state for certs with missing date
  const [quickDateCert, setQuickDateCert] = useState<Certification | null>(null);
  const [quickDateInput, setQuickDateInput] = useState('');

  // Form state
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>({
    vendor: 'NetApp',
    title: '',
    code: '',
    status: 'completed',
    date: '',
    domain: 'Storage',
    credentialUrl: '',
  });

  const completedCerts = useMemo(
    () => certifications.filter(c => c.status === 'completed'),
    [certifications]
  );
  const upNextCerts = useMemo(
    () => certifications.filter(c => c.status === 'up_next'),
    [certifications]
  );
  const plannedCerts = useMemo(
    () => certifications.filter(c => c.status === 'planned'),
    [certifications]
  );

  const filteredCerts = useMemo(() => {
    return certifications.filter(cert => {
      if (selectedStatus !== 'all' && cert.status !== selectedStatus) return false;
      if (selectedVendor !== 'all' && cert.vendor !== selectedVendor) return false;
      if (selectedDomain !== 'all' && cert.domain !== selectedDomain) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = cert.title.toLowerCase().includes(q);
        const matchCode = cert.code.toLowerCase().includes(q);
        const matchVendor = cert.vendor.toLowerCase().includes(q);
        const matchDomain = cert.domain.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchVendor && !matchDomain) return false;
      }
      return true;
    });
  }, [certifications, selectedStatus, selectedVendor, selectedDomain, searchQuery]);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      vendor: 'NetApp',
      title: '',
      code: '',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      domain: 'Storage',
      credentialUrl: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      vendor: cert.vendor,
      title: cert.title,
      code: cert.code,
      status: cert.status,
      date: cert.date || '',
      domain: cert.domain,
      credentialUrl: cert.credentialUrl || '',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) return;

    if (editingCert) {
      updateCertification(editingCert.id, {
        vendor: formData.vendor,
        title: formData.title.trim(),
        code: formData.code.trim(),
        status: formData.status,
        date: formData.date.trim(),
        domain: formData.domain,
        credentialUrl: formData.credentialUrl?.trim() || undefined,
      });
    } else {
      const newCert: Certification = {
        id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        vendor: formData.vendor,
        title: formData.title.trim(),
        code: formData.code.trim(),
        status: formData.status,
        date: formData.date.trim(),
        domain: formData.domain,
        credentialUrl: formData.credentialUrl?.trim() || undefined,
      };
      addCertification(newCert);
    }
    setIsFormOpen(false);
  };

  const handleMarkCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTargetCert) return;
    updateCertification(completeTargetCert.id, {
      status: 'completed',
      date: completionDateInput.trim() || new Date().toISOString().split('T')[0],
    });
    setCompleteTargetCert(null);
  };

  const handleQuickDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDateCert) return;
    updateCertification(quickDateCert.id, {
      date: quickDateInput.trim(),
    });
    setQuickDateCert(null);
  };

  const vendorBadges = [
    {
      name: 'Nutanix',
      count: certifications.filter(c => c.vendor === 'Nutanix' && c.status === 'completed').length,
      upNext: certifications.filter(c => c.vendor === 'Nutanix' && c.status === 'up_next').length,
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    },
    {
      name: 'NetApp',
      displayName: 'NetApp Learning Services',
      count: certifications.filter(c => c.vendor === 'NetApp' && c.status === 'completed').length,
      upNext: certifications.filter(c => c.vendor === 'NetApp' && c.status === 'up_next').length,
      color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    },
    {
      name: 'Cohesity',
      count: certifications.filter(c => c.vendor === 'Cohesity' && c.status === 'completed').length,
      upNext: certifications.filter(c => c.vendor === 'Cohesity' && c.status === 'up_next').length,
      color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Top Header & KPI Summary ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              Presales & Solution Architect Credentials
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
            Certifications & Accreditations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enterprise OEM certification portfolio, target roadmaps, and verified badges.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-sm transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Certification
        </button>
      </div>

      {/* ── KPI Bento Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Earned / Completed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-500 dark:text-emerald-400">
              {completedCerts.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">credentials</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
            6 NetApp · 2 Nutanix · 1 Cohesity
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">In Target / Up Next</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Target size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-500 dark:text-amber-400">
              {upNextCerts.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">active targets</span>
          </div>
          <p className="text-xs text-amber-500/90 dark:text-amber-400 mt-2 font-mono">
            NCA (Nutanix) · NCTA (NetApp)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">NetApp October Sprint</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyan-500 dark:text-cyan-400">
              6
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">in Oct 2026</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
            04-Oct through 13-Oct-2026
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Domains Covered</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Layers size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-purple-500 dark:text-purple-400">
              {new Set(certifications.map(c => c.domain)).size}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">architecture pillars</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
            Storage · HCI · Data Protection
          </p>
        </div>
      </div>

      {/* ── Active Target Roadmap (Up Next Banner) ── */}
      {upNextCerts.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-500">
                <Target size={16} />
              </div>
              <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
                Immediate Exam Roadmap (Up Next)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
              {upNextCerts.length} Target Goals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upNextCerts.map(cert => (
              <div
                key={cert.id}
                className="flex items-center justify-between gap-3 p-4 rounded-lg bg-white dark:bg-[#111827] border border-amber-500/20 dark:border-amber-500/20 shadow-sm"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {cert.code}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {cert.vendor} · {cert.domain}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
                    {cert.title}
                  </h4>
                </div>

                <button
                  onClick={() => {
                    setCompleteTargetCert(cert);
                    setCompletionDateInput(new Date().toISOString().split('T')[0]);
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 transition-colors"
                >
                  <Check size={14} />
                  Mark Completed
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Search & Filter Toolbar ── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by certification title, code, vendor, domain..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] overflow-x-auto">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${selectedStatus === 'all'
                  ? 'bg-cyan-500/10 text-cyan-500'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              All ({certifications.length})
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${selectedStatus === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              Completed ({completedCerts.length})
            </button>
            <button
              onClick={() => setSelectedStatus('up_next')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${selectedStatus === 'up_next'
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              Up Next ({upNextCerts.length})
            </button>
            <button
              onClick={() => setSelectedStatus('planned')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${selectedStatus === 'planned'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              Planned ({plannedCerts.length})
            </button>
          </div>
        </div>

        {/* Vendor Chips & Domain Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Building2 size={14} /> Vendor:
            </span>
            <button
              onClick={() => setSelectedVendor('all')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${selectedVendor === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-[#182032] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              All Vendors
            </button>
            {vendorBadges.map(v => (
              <button
                key={v.name}
                onClick={() => setSelectedVendor(v.name as Vendor)}
                className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors border ${selectedVendor === v.name
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 font-bold'
                    : `${v.color} hover:bg-opacity-20`
                  }`}
              >
                <span>{v.displayName || v.name}</span>
                <span className="text-[10px] px-1 rounded bg-black/20 font-bold">
                  {v.count + v.upNext}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <BookOpen size={14} /> Domain:
            </span>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value as 'all' | Domain)}
              className="px-2.5 py-1 rounded text-xs font-mono border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Domains</option>
              {DOMAINS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Certifications Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCerts.map((cert, index) => {
          const isCompleted = cert.status === 'completed';
          const isUpNext = cert.status === 'up_next';
          const formattedDate = formatCertDate(cert.date);

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all relative overflow-hidden ${isCompleted
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  : isUpNext
                    ? 'border-amber-500/50 bg-white dark:bg-[#0D1526] shadow-md shadow-amber-500/5'
                    : 'border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-[#0D1526]/50'
                }`}
            >
              {/* Top indicator bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${isCompleted
                    ? cert.vendor === 'NetApp'
                      ? 'bg-cyan-500'
                      : 'bg-emerald-500'
                    : isUpNext
                      ? 'bg-amber-500'
                      : 'bg-slate-500'
                  }`}
              />

              <div>
                {/* Header: Vendor & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400">
                    {cert.vendor === 'NetApp' ? 'NetApp Learning Services' : cert.vendor}
                  </span>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 size={13} />
                      Completed
                    </span>
                  ) : isUpNext ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Target size={13} />
                      Up Next
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-400 border border-slate-500/30">
                      <Clock size={13} />
                      Planned
                    </span>
                  )}
                </div>

                {/* Title & Code */}
                <div className="mb-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-100 dark:bg-[#182338] text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">
                      {cert.code}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-[#182338] text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-800">
                      {cert.domain}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {cert.title}
                  </h3>
                </div>

                {/* Date / Credential Info */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-mono">
                  {formattedDate ? (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar size={14} className="text-emerald-400" />
                      <span>Completed: <strong className="text-emerald-400 font-bold">{formattedDate}</strong></span>
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        setQuickDateCert(cert);
                        setQuickDateInput('');
                      }}
                      className="inline-flex items-center gap-1.5 text-cyan-500 hover:text-cyan-400 font-medium hover:underline"
                    >
                      <Calendar size={14} />
                      <span>+ Record completion date</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <Clock size={14} />
                      <span>Active Roadmap Target</span>
                    </div>
                  )}

                  {cert.credentialUrl && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <ExternalLink size={13} className="text-cyan-400" />
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline truncate"
                      >
                        Verify Credential
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-[#1F2937]">
                {isUpNext ? (
                  <button
                    onClick={() => {
                      setCompleteTargetCert(cert);
                      setCompletionDateInput(new Date().toISOString().split('T')[0]);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 transition-colors"
                  >
                    <Check size={13} />
                    Mark Completed
                  </button>
                ) : (
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: {cert.id.replace('cert-', '')}
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    title="Edit certification"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${cert.title}"?`)) {
                        deleteCertification(cert.id);
                      }
                    }}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete certification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCerts.length === 0 && (
        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-[#1F2937] rounded-xl">
          <Award size={36} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            No certifications match the current filter
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search query, status, or vendor filter.
          </p>
        </div>
      )}

      {/* ── Add / Edit Certification Modal ── */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2937]">
                <h3 className="text-lg font-bold">
                  {editingCert ? 'Edit Certification' : 'Add New Certification'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Vendor / OEM Provider
                  </label>
                  <select
                    value={formData.vendor}
                    onChange={e =>
                      setFormData({ ...formData, vendor: e.target.value as Vendor })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] focus:outline-none focus:border-cyan-500"
                  >
                    {VENDORS.map(v => (
                      <option key={v} value={v}>
                        {v === 'NetApp' ? 'NetApp (NetApp Learning Services)' : v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Certification Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Industry Essentials: Enterprise Storage"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Code / Acronym
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ONTAP-CF, NCA, NHCF"
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Architecture Domain
                    </label>
                    <select
                      value={formData.domain}
                      onChange={e =>
                        setFormData({ ...formData, domain: e.target.value as Domain })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] focus:outline-none focus:border-cyan-500"
                    >
                      {DOMAINS.map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          status: e.target.value as CertStatus,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] focus:outline-none focus:border-cyan-500"
                    >
                      <option value="completed">Completed</option>
                      <option value="up_next">Up Next</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Completion Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026-10-04 or 04-Oct-2026"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Credential Verification URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.credentialUrl || ''}
                    onChange={e =>
                      setFormData({ ...formData, credentialUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#1F2937]">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    {editingCert ? 'Save Changes' : 'Add Certification'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mark Completed Modal ── */}
      <AnimatePresence>
        {completeTargetCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1F2937]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="font-bold text-base">Mark as Completed</h3>
                </div>
                <button
                  onClick={() => setCompleteTargetCert(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                Congratulations on mastering{' '}
                <strong className="text-cyan-500">{completeTargetCert.title}</strong> (
                {completeTargetCert.code})!
              </p>

              <form onSubmit={handleMarkCompleteSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Completion Date (e.g. 2026-11-19 or 19-Nov-2026)
                  </label>
                  <input
                    type="text"
                    required
                    value={completionDateInput}
                    onChange={e => setCompletionDateInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCompleteTargetCert(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#1F2937] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Confirm & Complete
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Quick Date Set Modal ── */}
      <AnimatePresence>
        {quickDateCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1F2937]">
                <h3 className="font-bold text-sm">Record Completion Date</h3>
                <button
                  onClick={() => setQuickDateCert(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set completion date for{' '}
                <strong className="text-slate-700 dark:text-slate-200">{quickDateCert.code}</strong>:
              </p>

              <form onSubmit={handleQuickDateSubmit} className="space-y-4 text-sm">
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-10-04 or 04-Oct-2026"
                  value={quickDateInput}
                  onChange={e => setQuickDateInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#182032] font-mono text-sm focus:outline-none focus:border-cyan-500"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickDateCert(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1F2937] text-slate-600 dark:text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs transition-colors"
                  >
                    Save Date
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
