import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Search,
  Building2,
  Layers,
  Cpu,
  Shield,
  Network,
  HardDrive,
  Factory,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
  Bot,
  Compass,
  Flame,
  Binary,
  GitBranch,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import type { OemSession, OemSessionCategory } from '../types/dashboard';

const CATEGORIES: OemSessionCategory[] = [
  'Agentic AI & MCP',
  'Data Center & Fabric',
  'Observability & SecOps',
  'Industrial & OT',
  'Cloud & Storage',
];

interface TrophyDef {
  oem: string;
  tier: string;
  title: string;
  icon: typeof Trophy;
  color: string;
  accent: string;
  bgGlow: string;
  badges: string[];
  description: string;
  metrics: { label: string; value: string }[];
}

const TROPHY_LIST: TrophyDef[] = [
  {
    oem: 'Cisco',
    tier: 'Elite Architecture Partner',
    title: 'AgenticOps, Meraki MCP & ThousandEyes AI Assurance',
    icon: Network,
    color: 'text-cyan-400',
    accent: 'border-cyan-500/30',
    bgGlow: 'from-cyan-500/10 to-transparent',
    badges: ['AgenticOps Pioneer', 'MCP Meraki Integrator', 'ThousandEyes Assurance', 'Cloud Control'],
    description:
      'Mastered the Model Context Protocol (MCP) ecosystem across Cisco Meraki, Cloud Control AI Canvas, and ThousandEyes synthetic assurance fabrics.',
    metrics: [
      { label: 'Deep-Dive Sessions', value: '4' },
      { label: 'Key Architecture', value: '5-Stage Loop & MCP' },
    ],
  },
  {
    oem: 'NetApp',
    tier: 'Enterprise Storage Master',
    title: 'ONTAP Data Management & StorageGRID Architecture',
    icon: HardDrive,
    color: 'text-blue-400',
    accent: 'border-blue-500/30',
    bgGlow: 'from-blue-500/10 to-transparent',
    badges: ['6 Accreditations (Oct 2026)', 'ONTAP Cluster Pro', 'StorageGRID Object', 'NCTA Target'],
    description:
      'Completed 6 NetApp Learning Services credentials covering ONTAP cluster administration, enterprise data protection, and StorageGRID S3 object storage.',
    metrics: [
      { label: 'Accreditations', value: '6 Earned' },
      { label: 'Target Exam', value: 'NCTA' },
    ],
  },
  {
    oem: 'Nutanix',
    tier: 'HCI Cloud Architect',
    title: 'Hybrid Cloud Fundamentals & Unified Storage Administration',
    icon: Layers,
    color: 'text-emerald-400',
    accent: 'border-emerald-500/30',
    bgGlow: 'from-emerald-500/10 to-transparent',
    badges: ['NHCF Certified', 'NUSA Certified', 'AHV Virtualization', 'NCA Target'],
    description:
      'Specialized in Nutanix Distributed Storage Fabric (DSF), AOS architecture, Prism Element/Central, and AHV migrations against traditional 3-Tier setups.',
    metrics: [
      { label: 'Credentials', value: '2 Completed' },
      { label: 'Target Exam', value: 'NCA' },
    ],
  },
  {
    oem: 'Dell',
    tier: 'AI Infrastructure Lead',
    title: 'Dell AI Factory Kiosk & Enterprise Server Sizing',
    icon: Cpu,
    color: 'text-sky-400',
    accent: 'border-sky-500/30',
    bgGlow: 'from-sky-500/10 to-transparent',
    badges: ['AI Factory Kiosk', 'PowerEdge XE9680', 'CEO Connect Demo', 'CDOT/IIT BOQ'],
    description:
      'Built live executive AI Factory demo kiosks and structured multi-OEM enterprise sizing tools featuring Dell PowerEdge and APEX consumption models.',
    metrics: [
      { label: 'Live Builds', value: '2 Interactive' },
      { label: 'BOQs Architected', value: '2' },
    ],
  },
  {
    oem: 'IBM',
    tier: 'High-Performance & Quantum Compute',
    title: 'IBM Power11, SMT8 Parallelism & FlashSystem Storage',
    icon: Binary,
    color: 'text-indigo-400',
    accent: 'border-indigo-500/30',
    bgGlow: 'from-indigo-500/10 to-transparent',
    badges: ['Power11 AI-Ready', 'Quantum-Safe Ready', 'FlashSystem', 'RISC Architecture'],
    description:
      'Evaluated IBM Power11 AI-ready architecture with 8-threads-per-core (SMT8) high parallelism, Quantum-Safe cryptographic protection, and FlashSystem Cyber Vault.',
    metrics: [
      { label: 'Architecture', value: 'RISC / SMT8' },
      { label: 'Security', value: 'Quantum-Safe' },
    ],
  },
  {
    oem: 'Arista',
    tier: 'Cloud Fabric Innovator',
    title: 'Single EOS, Merchant Silicon & Spine-Leaf Topologies',
    icon: GitBranch,
    color: 'text-amber-400',
    accent: 'border-amber-500/30',
    bgGlow: 'from-amber-500/10 to-transparent',
    badges: ['Single EOS Automator', 'Merchant Silicon', 'CLOS Architecture', 'TAC Support USP'],
    description:
      'Enablement on Arista high-speed data center fabrics, single EOS consistency across 10G-800G, and merchant silicon economics avoiding vendor lock-in.',
    metrics: [
      { label: 'OS Image', value: 'Single Binary' },
      { label: 'Fabric', value: 'Non-blocking CLOS' },
    ],
  },
  {
    oem: 'Rockwell Automation',
    tier: 'Industrial OT/IT Convergence Lead',
    title: 'Software-Defined Manufacturing & Industrial DMZ (IDMZ)',
    icon: Factory,
    color: 'text-orange-400',
    accent: 'border-orange-500/30',
    bgGlow: 'from-orange-500/10 to-transparent',
    badges: ['Cisco Joint Alliance', 'IDMZ Zoning', 'Stratix Switches', 'Edge AI Maintenance'],
    description:
      'Technical visit with Bali sir evaluating Rockwell Automation & Cisco joint manufacturing alliance: transitioning plants from dedicated hardware to shared compute with Edge AI.',
    metrics: [
      { label: 'Architecture', value: '4-Tier Industrial' },
      { label: 'Alliance', value: 'Cisco x Rockwell' },
    ],
  },
  {
    oem: 'Splunk',
    tier: 'Observability & SOC Agentic AI',
    title: 'Enterprise Observability, APM & AITK MCP Server',
    icon: Flame,
    color: 'text-rose-400',
    accent: 'border-rose-500/30',
    bgGlow: 'from-rose-500/10 to-transparent',
    badges: ['AITK MCP Lab', 'Full APM', 'SOC Analyst-on-the-loop', 'Guided Response Agent'],
    description:
      'Explored full-stack Observability, APM, and standardized MCP servers across Splunk, validating the Discover AI Lab with autonomous Detection Builder agents.',
    metrics: [
      { label: 'Lab Verification', value: 'AITK Tested' },
      { label: 'SecOps Mode', value: 'Analyst-on-the-loop' },
    ],
  },
  {
    oem: 'Ray Networks',
    tier: 'Enterprise Networking Lead',
    title: 'RayOne SD-WAN, Zero Trust NAC & Wireless Switching',
    icon: Radio,
    color: 'text-teal-400',
    accent: 'border-teal-500/30',
    bgGlow: 'from-teal-500/10 to-transparent',
    badges: ['RayOne Controller', 'Underlay / Overlay', 'Zero Trust NAC', 'Wi-Fi 6 Portfolio'],
    description:
      'Full-stack enterprise networking review of Ray Networks edge gateways, SD-WAN underlay/overlay routing, and role-based Network Access Control (NAC).',
    metrics: [
      { label: 'Controller', value: 'RayOne Cloud' },
      { label: 'Security', value: 'Zero Trust NAC' },
    ],
  },
  {
    oem: 'Druva',
    tier: 'Cloud-Native Resilience',
    title: '100% SaaS Data Protection & Ransomware Air-Gap',
    icon: Shield,
    color: 'text-purple-400',
    accent: 'border-purple-500/30',
    bgGlow: 'from-purple-500/10 to-transparent',
    badges: ['SaaS Data Protection', 'Air-Gapped Vaults', 'Instant Recovery', 'Zero Appliance TCO'],
    description:
      'Enablement on Druva cloud-native backup architecture: replacing on-prem tape and media servers with air-gapped immutable cloud storage for fast disaster recovery.',
    metrics: [
      { label: 'Architecture', value: '100% SaaS' },
      { label: 'Storage', value: 'Air-Gapped WORM' },
    ],
  },
];

export default function OemTrophiesView() {
  const { oemSessions = [] } = useDashboard();

  const [activeTab, setActiveTab] = useState<'sessions' | 'trophies' | 'blueprint'>('sessions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | OemSessionCategory>('all');
  const [selectedOem, setSelectedOem] = useState<string>('all');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [activeModalSession, setActiveModalSession] = useState<OemSession | null>(null);

  // Extract all OEM names from sessions
  const oemNames = useMemo(() => {
    const names = new Set<string>();
    oemSessions.forEach(s => names.add(s.oem.split(' ')[0].replace('/', '')));
    return Array.from(names).sort();
  }, [oemSessions]);

  const filteredSessions = useMemo(() => {
    return oemSessions.filter(session => {
      if (selectedCategory !== 'all' && session.category !== selectedCategory) return false;
      if (selectedOem !== 'all' && !session.oem.toLowerCase().includes(selectedOem.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = session.title.toLowerCase().includes(q);
        const matchOem = session.oem.toLowerCase().includes(q);
        const matchSpeaker = session.speakerOrLead?.toLowerCase().includes(q) || false;
        const matchSummary = session.summary.toLowerCase().includes(q);
        const matchTopics = session.keyTopics.some(t => t.toLowerCase().includes(q));
        const matchTags = session.oemTags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchOem && !matchSpeaker && !matchSummary && !matchTopics && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [oemSessions, selectedCategory, selectedOem, searchQuery]);

  return (
    <div className="space-y-8">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
              OEM Partner Ecosystem & Technology Alliances
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
            OEM Meetings, Trophies & Technical Enablement
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Strategic partner sessions, AgenticOps & Model Context Protocol (MCP) frameworks, and technology trophies.
          </p>
        </div>

        {/* Section View Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827]">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'sessions'
                ? 'bg-cyan-500/10 text-cyan-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Enablement Sessions ({oemSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('trophies')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'trophies'
                ? 'bg-amber-500/10 text-amber-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Trophy Wall ({TROPHY_LIST.length})
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'blueprint'
                ? 'bg-purple-500/10 text-purple-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            AgenticOps Blueprint
          </button>
        </div>
      </div>

      {/* ── KPI Highlight Banner ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
          <div className="text-xs uppercase font-mono text-slate-500 dark:text-slate-400">OEM Partners</div>
          <div className="text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">
            10 Alliances
          </div>
          <span className="text-[11px] text-cyan-500 font-mono">Cisco · NetApp · Nutanix · IBM</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
          <div className="text-xs uppercase font-mono text-slate-500 dark:text-slate-400">Technical Sessions</div>
          <div className="text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">
            {oemSessions.length} Deep-Dives
          </div>
          <span className="text-[11px] text-emerald-500 font-mono">100% Documented</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
          <div className="text-xs uppercase font-mono text-slate-500 dark:text-slate-400">Core Paradigm</div>
          <div className="text-2xl font-bold font-mono mt-1 text-amber-500">
            AgenticOps & MCP
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Model Context Protocol</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4">
          <div className="text-xs uppercase font-mono text-slate-500 dark:text-slate-400">Architect Rank</div>
          <div className="text-2xl font-bold font-mono mt-1 text-purple-400">
            Master Presales
          </div>
          <span className="text-[11px] text-purple-400/80 font-mono">Enterprise Solution Architect</span>
        </div>
      </div>

      {/* ── TAB 1: ENABLEMENT SESSIONS ── */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search OEM sessions by speaker (VJ Jadeja, Nour), topic (horse and nail, MCP, Meraki, APM, EOS)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
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

              {/* Category Pills */}
              <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-cyan-500/10 text-cyan-500 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/10 text-cyan-500 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* OEM Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Building2 size={13} /> Filter by OEM:
              </span>
              <button
                onClick={() => setSelectedOem('all')}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  selectedOem === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-[#182032] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All OEMs
              </button>
              {oemNames.map(oem => (
                <button
                  key={oem}
                  onClick={() => setSelectedOem(selectedOem === oem ? 'all' : oem)}
                  className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${
                    selectedOem === oem
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'border-slate-200 dark:border-[#1F2937] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {oem}
                </button>
              ))}
            </div>
          </div>

          {/* Session Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSessions.map((session, index) => {
              const isExpanded = expandedSessionId === session.id;

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {session.oem}
                        </span>
                        {session.speakerOrLead && (
                          <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-medium">
                            by {session.speakerOrLead}
                          </span>
                        )}
                      </div>

                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        {session.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {session.title}
                    </h3>

                    <p className="text-sm text-slate-700 dark:text-slate-200 mb-3.5 leading-relaxed">
                      {session.summary}
                    </p>

                    {/* Key Topics List (Collapsible) */}
                    <div className="space-y-2 p-3.5 rounded-lg bg-slate-50 dark:bg-[#121C30] border border-slate-200 dark:border-slate-800 mb-3">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Architectural Takeaways ({session.keyTopics.length})</span>
                        <button
                          onClick={() =>
                            setExpandedSessionId(isExpanded ? null : session.id)
                          }
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-xs font-semibold"
                        >
                          {isExpanded ? (
                            <>
                              Collapse <ChevronUp size={13} />
                            </>
                          ) : (
                            <>
                              Expand <ChevronDown size={13} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display first 3 or all if expanded */}
                      {(isExpanded
                        ? session.keyTopics
                        : session.keyTopics.slice(0, 3)
                      ).map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-100 font-medium"
                        >
                          <span className="text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                          <span className="leading-relaxed">{topic}</span>
                        </div>
                      ))}

                      {!isExpanded && session.keyTopics.length > 3 && (
                        <button
                          onClick={() => setExpandedSessionId(session.id)}
                          className="text-xs font-mono font-bold text-cyan-400 hover:underline pt-1 inline-block"
                        >
                          + {session.keyTopics.length - 3} more topics...
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-[#1F2937] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1">
                      {session.oemTags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-[#182032] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#1F2937]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveModalSession(session)}
                      className="p-1.5 rounded text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors shrink-0"
                      title="View full session briefing"
                    >
                      <ExternalLink size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-300 dark:border-[#1F2937] rounded-xl">
              <Building2 size={36} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No OEM sessions match your filter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try clearing your search query or selecting a different category.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: TROPHY WALL ── */}
      {activeTab === 'trophies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TROPHY_LIST.map((trophy, index) => {
            const Icon = trophy.icon;

            return (
              <motion.div
                key={trophy.oem}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className={`rounded-xl border ${trophy.accent} bg-white dark:bg-[#111827] p-5 shadow-sm hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between`}
              >
                {/* Background ambient glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${trophy.bgGlow} rounded-full blur-2xl pointer-events-none`}
                />

                <div>
                  {/* Top: Icon + Tier */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-lg bg-slate-100 dark:bg-[#182032] ${trophy.color} border border-slate-200 dark:border-[#1F2937]`}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${trophy.color} bg-black/20 border border-current/20`}
                    >
                      {trophy.tier}
                    </span>
                  </div>

                  {/* OEM Name & Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {trophy.oem}
                  </h3>
                  <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 leading-snug">
                    {trophy.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {trophy.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-lg bg-slate-50 dark:bg-[#182032]/80 border border-slate-100 dark:border-[#1F2937]">
                    {trophy.metrics.map(m => (
                      <div key={m.label}>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          {m.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges / Accreditations */}
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1">
                    <Award size={12} /> Verified Accreditations
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trophy.badges.map(badge => (
                      <span
                        key={badge}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-[#182032] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1F2937]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── TAB 3: AGENTICOPS & MCP ARCHITECTURAL BLUEPRINT ── */}
      {activeTab === 'blueprint' && (
        <div className="space-y-6">
          {/* Overview Banner */}
          <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 p-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={20} className="text-cyan-400" />
              <h3 className="text-lg font-bold font-mono text-cyan-400">
                The AgenticOps & Model Context Protocol (MCP) Paradigm
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Derived from the masterclass sessions by <strong>VJ Jadeja</strong> and{' '}
              <strong>Nour Alohoda</strong> (Cisco & Meraki). Moving enterprise data center operations
              from reactive telemetry alerts (AIOps) to autonomous reasoning agents integrated as
              first-class network users.
            </p>
          </div>

          {/* Blueprint Section 1: The 4 Levels of Autonomy */}
          <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base flex items-center gap-2 text-slate-900 dark:text-white">
                <Compass size={18} className="text-amber-500" /> Four Levels of Operational Autonomy
              </h4>
              <span className="text-xs font-mono text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Recommended: Start at Supervised to build trust
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937]">
                <div className="text-xs font-mono font-bold text-cyan-400 mb-1">Level 1: Assisted</div>
                <h5 className="font-semibold text-sm mb-1.5">AI Suggests</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Agent detects anomaly, correlates machine logs, and drafts remediation plan. Human operator executes manually.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-emerald-500/30 ring-1 ring-emerald-500/20">
                <div className="text-xs font-mono font-bold text-emerald-400 mb-1">Level 2: Supervised ★</div>
                <h5 className="font-semibold text-sm mb-1.5">Human In-The-Loop</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Agent formulates API script and waits at approval gate. Operator clicks &quot;Approve&quot; — agent executes & verifies.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937]">
                <div className="text-xs font-mono font-bold text-amber-400 mb-1">Level 3: Conditional</div>
                <h5 className="font-semibold text-sm mb-1.5">Guarded Execution</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Agent acts autonomously within strict blast radius (e.g. non-core VLANs). Escalates to human on high risk.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937]">
                <div className="text-xs font-mono font-bold text-purple-400 mb-1">Level 4: High Autonomy</div>
                <h5 className="font-semibold text-sm mb-1.5">Closed-Loop Self-Healing</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Autonomous agent-to-agent negotiations resolve fabric congestion, port flaps, and route leaks with audit logging.
                </p>
              </div>
            </div>
          </div>

          {/* Blueprint Section 2: The Five-Stage Agentic Loop */}
          <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-6 space-y-4">
            <h4 className="font-bold text-base flex items-center gap-2 text-slate-900 dark:text-white">
              <Bot size={18} className="text-cyan-500" /> The Five-Stage Agentic Loop & Governance
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  step: '01',
                  name: 'Perceive',
                  desc: 'State discovery via Meraki & Splunk MCP tools',
                  color: 'text-cyan-400',
                },
                {
                  step: '02',
                  name: 'Reason',
                  desc: 'Domain-specific LLM analyzes root cause & topology',
                  color: 'text-blue-400',
                },
                {
                  step: '03',
                  name: 'Govern',
                  desc: 'Policy checkpoints & blast-radius validation',
                  color: 'text-purple-400',
                },
                {
                  step: '04',
                  name: 'Execute',
                  desc: 'Tool invocation via MCP API harness',
                  color: 'text-amber-400',
                },
                {
                  step: '05',
                  name: 'Assure',
                  desc: 'ThousandEyes verification: "Truth layer behind AI"',
                  color: 'text-emerald-400',
                },
              ].map(phase => (
                <div
                  key={phase.step}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937] relative"
                >
                  <span className={`text-xl font-bold font-mono ${phase.color} block mb-1`}>
                    {phase.step}
                  </span>
                  <div className="font-semibold text-sm mb-1">{phase.name}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {phase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Blueprint Section 3: Partner Monetization Models */}
          <div className="rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] p-6 space-y-4">
            <h4 className="font-bold text-base flex items-center gap-2 text-slate-900 dark:text-white">
              <Award size={18} className="text-emerald-500" /> Cisco Partner MCP Monetization Model
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937]">
                <div className="text-xs font-mono font-bold text-cyan-400 mb-1">Immediate</div>
                <h5 className="font-semibold text-sm mb-1">Meraki Dashboard MCP</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automating repetitive port provisioning and Wi-Fi SSID troubleshooting using ready-to-deploy MCP tools.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937]">
                <div className="text-xs font-mono font-bold text-blue-400 mb-1">Emerging</div>
                <h5 className="font-semibold text-sm mb-1">ThousandEyes Assurance</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Offering AI experience assurance validating third-party SaaS and MCP API availability.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937]">
                <div className="text-xs font-mono font-bold text-amber-400 mb-1">Premium</div>
                <h5 className="font-semibold text-sm mb-1">Custom Agent Builder</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Developing enterprise-specific agents for multi-vendor DC fabric orchestration and compliance auditing.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-200 dark:border-[#1F2937]">
                <div className="text-xs font-mono font-bold text-purple-400 mb-1">Managed Services</div>
                <h5 className="font-semibold text-sm mb-1">Autonomous NOC/SOC</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Delivering 24/7 AgenticOps with human-on-the-loop governance for enterprise clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {activeModalSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#111827] shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2937]">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold font-mono text-sm">
                    {activeModalSession.oem}
                  </span>
                  <div>
                    <h3 className="font-bold text-base">{activeModalSession.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {activeModalSession.category} · {activeModalSession.date}
                      {activeModalSession.speakerOrLead ? ` · ${activeModalSession.speakerOrLead}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalSession(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Executive Session Summary
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeModalSession.summary}
                </p>
              </div>

              {/* Topics */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Complete Engineering Topics & Takeaways:
                </h4>
                <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-[#182032] border border-slate-100 dark:border-[#1F2937]">
                  {activeModalSession.keyTopics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1.5">
                  Ecosystem Stack & Technology Badges:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalSession.oemTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-[#1F2937]">
                <button
                  onClick={() => setActiveModalSession(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#182032] text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close Briefing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
