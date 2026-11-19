import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileSpreadsheet,
  Plus,
  Search,
  Calendar,
  MapPin,
  CheckCircle2,
  Edit3,
  Trash2,
  X,
  Cpu,
  HardDrive,
  Network,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import type { FieldEntry, FieldType } from '../types/dashboard';

const FIELD_TYPES: FieldType[] = ['Customer Meeting', 'BOQ'];

const typeMeta: Record<
  FieldType,
  { label: string; icon: typeof Users; color: string; badge: string; border: string }
> = {
  'Customer Meeting': {
    label: 'Customer Meeting',
    icon: Users,
    color: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    border: 'border-cyan-500/30',
  },
  'BOQ': {
    label: 'BOQ Assistance',
    icon: FileSpreadsheet,
    color: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    border: 'border-amber-500/30',
  },
};

export default function FieldOpsView() {
  const { fieldEntries, addFieldEntry, updateFieldEntry, deleteFieldEntry } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | FieldType>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FieldEntry | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<FieldEntry, 'id'>>({
    type: 'Customer Meeting',
    title: '',
    organization: '',
    date: '2026-10',
    location: '',
    oemTags: [],
    summary: '',
    keyTakeaways: [],
  });
  const [tagsInput, setTagsInput] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    fieldEntries.forEach(e => (e.oemTags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [fieldEntries]);

  // Counts by type
  const typeCounts = useMemo(() => {
    const counts: Record<FieldType, number> = {
      'Customer Meeting': 0,
      'BOQ': 0,
    };
    fieldEntries.forEach(e => {
      if (counts[e.type] !== undefined) counts[e.type]++;
    });
    return counts;
  }, [fieldEntries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return fieldEntries.filter(entry => {
      if (selectedType !== 'all' && entry.type !== selectedType) return false;
      if (selectedTag !== 'all' && !(entry.oemTags || []).includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = entry.title.toLowerCase().includes(q);
        const matchOrg = entry.organization.toLowerCase().includes(q);
        const matchSummary = entry.summary.toLowerCase().includes(q);
        const matchLocation = entry.location?.toLowerCase().includes(q) || false;
        const matchTags = (entry.oemTags || []).some(t => t.toLowerCase().includes(q));
        const matchTakeaways = entry.keyTakeaways.some(t => t.toLowerCase().includes(q));
        if (
          !matchTitle &&
          !matchOrg &&
          !matchSummary &&
          !matchLocation &&
          !matchTags &&
          !matchTakeaways
        ) {
          return false;
        }
      }
      return true;
    });
  }, [fieldEntries, selectedType, selectedTag, searchQuery]);

  const openAddModal = () => {
    setEditingEntry(null);
    setFormData({
      type: 'Customer Meeting',
      title: '',
      organization: '',
      date: '2026-10',
      location: '',
      oemTags: [],
      summary: '',
      keyTakeaways: [],
    });
    setTagsInput('');
    setTakeawaysInput('');
    setIsFormOpen(true);
  };

  const openEditModal = (entry: FieldEntry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      title: entry.title,
      organization: entry.organization,
      date: entry.date,
      location: entry.location || '',
      oemTags: entry.oemTags || [],
      summary: entry.summary,
      keyTakeaways: entry.keyTakeaways,
    });
    setTagsInput((entry.oemTags || []).join(', '));
    setTakeawaysInput(entry.keyTakeaways.join('\n'));
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const parsedTakeaways = takeawaysInput
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingEntry) {
      updateFieldEntry(editingEntry.id, {
        type: formData.type,
        title: formData.title.trim(),
        organization: formData.organization.trim(),
        date: formData.date.trim(),
        location: formData.location?.trim() || undefined,
        oemTags: parsedTags,
        summary: formData.summary.trim(),
        keyTakeaways: parsedTakeaways,
      });
    } else {
      const newEntry: FieldEntry = {
        id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: formData.type,
        title: formData.title.trim(),
        organization: formData.organization.trim(),
        date: formData.date.trim(),
        location: formData.location?.trim() || undefined,
        oemTags: parsedTags,
        summary: formData.summary.trim(),
        keyTakeaways: parsedTakeaways,
      };
      addFieldEntry(newEntry);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Presales Consulting & Solution Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
              6 Customer Engagements
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
            Customer Meetings & Sizing Reviews
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Direct client architecture reviews, storage & GPU compute sizing, 15-year DC P2V migration audits, and institutional BOQs.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Customer Meeting
        </button>
      </div>

      {/* ── Key Architecture Highlights Banner ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent p-5 dark:bg-[#0D1526] shadow-sm">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
            <Cpu size={16} /> Compute, GPU & SAS Sizing
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
            Air Water India
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            Scoped NVIDIA GPU acceleration with RAID 10 internal SAS storage (20TB expandable to 50TB), Dual 1 GbE, and 5-yr HPE iLO management.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent p-5 dark:bg-[#0D1526] shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-2">
            <Network size={16} /> Storage Fabric Advisory
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
            Bazar Kolkata
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            Advised client against 2-port direct HBA attachment; recommended installing a SAN switch to seamlessly route traffic across multiple arrays.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent p-5 dark:bg-[#0D1526] shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
            <HardDrive size={16} /> 15-Yr DC P2V Modernization
          </div>
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
            The Indian Express
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            Evaluated legacy IBM V7000 SAN & NetBackup. Architected 15-20 physical server P2V migration comparing 3-Tier vs Nutanix AHV HCI.
          </p>
        </div>
      </div>

      {/* ── Summary Counters ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-4 text-center">
          <span className="text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400 font-semibold">Total Accounts</span>
          <div className="text-2xl font-extrabold font-mono mt-1 text-slate-900 dark:text-white">
            {fieldEntries.length}
          </div>
          <span className="text-[11px] font-mono text-cyan-400">100% Verified Scope</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-4 text-center">
          <span className="text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400 font-semibold">Customer Meetings</span>
          <div className="text-2xl font-extrabold font-mono mt-1 text-cyan-400">
            {typeCounts['Customer Meeting']}
          </div>
          <span className="text-[11px] font-mono text-slate-400">Technical Reviews</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-4 text-center">
          <span className="text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400 font-semibold">BOQ Formulations</span>
          <div className="text-2xl font-extrabold font-mono mt-1 text-amber-400">
            {typeCounts['BOQ']}
          </div>
          <span className="text-[11px] font-mono text-slate-400">CDOT & IIT Kharagpur</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-4 text-center">
          <span className="text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400 font-semibold">Sizing Coverage</span>
          <div className="text-2xl font-extrabold font-mono mt-1 text-emerald-400">
            100%
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Compute, SAN, HCI</span>
        </div>
      </div>

      {/* ── Toolbar: Search & Filter Pills ── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search customer meetings by account (Air Water, Bazar Kolkata, Indian Express, Century Ply, CDOT, IIT KGP)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
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

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526]">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                selectedType === 'all'
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All Accounts ({fieldEntries.length})
            </button>
            {FIELD_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {typeMeta[type].label} ({typeCounts[type]})
              </button>
            ))}
          </div>
        </div>

        {/* Technology Tag Chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1">
              Filter by Tech:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2 py-0.5 rounded text-xs font-mono font-medium transition-colors ${
                selectedTag === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-[#182032] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Tech
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${
                  selectedTag === tag
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── High-Readability Customer Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEntries.map((entry, index) => {
          const meta = typeMeta[entry.type] || typeMeta['Customer Meeting'];
          const Icon = meta.icon;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-6 hover:border-cyan-500/40 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-slate-100 dark:bg-[#182338] text-cyan-400">
                      <Icon size={18} />
                    </span>
                    <div>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {entry.organization}
                      </span>
                      {entry.location && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <MapPin size={11} /> {entry.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${meta.badge}`}
                    >
                      {entry.type}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {entry.date}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {entry.title}
                </h3>

                {/* Executive Summary */}
                <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed font-normal">
                  {entry.summary}
                </p>

                {/* Key Architecture Takeaways Box */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#121C30] border border-slate-200 dark:border-slate-800/80 mb-4 space-y-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Key Presales Takeaways ({entry.keyTakeaways.length}):
                  </span>
                  {entry.keyTakeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-100 font-medium">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Tech Tags & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(entry.oemTags || []).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-[#182338] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(entry)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Customer Meeting"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete meeting record for ${entry.organization}?`)) {
                        deleteFieldEntry(entry.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <Users size={32} className="mx-auto text-slate-400 mb-2" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No customer meetings match your filter
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting your search query or selecting "All Accounts".
          </p>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingEntry ? 'Edit Customer Meeting' : 'Add New Customer Meeting'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as FieldType })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Customer Meeting">Customer Meeting</option>
                      <option value="BOQ">BOQ Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Customer / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Air Water India"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Storage Expansion & SAN Fabric Routing Advisory"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Date (YYYY-MM) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2026-10"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Noida / Kolkata / Remote"
                      value={formData.location || ''}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Technologies / Architecture Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="SAN Switch, RAID 10, NVIDIA GPU, HPE iLO, Nutanix AHV"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Executive Architecture Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Brief architectural overview of customer requirements and presales recommendations..."
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Key Presales Takeaways (one per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Compute & GPU Sizing: Scoped dedicated NVIDIA GPU...&#10;Storage Topology: Internal SAS drives over SAN..."
                    value={takeawaysInput}
                    onChange={e => setTakeawaysInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121C30] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    {editingEntry ? 'Save Changes' : 'Add Meeting'}
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
