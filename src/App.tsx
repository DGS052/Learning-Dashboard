import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Award,
  Users,
  Trophy,
  TrendingUp,
  PieChart as PieIcon,
  ArrowUpRight,
  Cpu,
  HardDrive,
  Network,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Layout, { type Section } from './components/Layout';
import { useDashboard } from './context/DashboardContext';
import CertificationsView from './components/CertificationsView';
import FieldOpsView from './components/FieldOpsView';
import OemTrophiesView from './components/OemTrophiesView';
import PlanView from './components/PlanView';

const sectionMeta: Record<Section, { icon: typeof LayoutDashboard; label: string; color: string }> = {
  'overview': { icon: LayoutDashboard, label: 'Overview', color: 'text-cyan-400' },
  '30-day-plan': { icon: CalendarDays, label: '30-Day Plan', color: 'text-amber-400' },
  'certifications': { icon: Award, label: 'Certifications', color: 'text-emerald-400' },
  'field-ops': { icon: Users, label: 'Customer Meetings', color: 'text-purple-400' },
  'oem-trophies': { icon: Trophy, label: 'OEM Meetings', color: 'text-orange-400' },
};

function BentoCard({
  section,
  mainValue,
  label,
  subtext,
  badgeText,
  badgeColor,
  delay,
  onClick,
}: {
  section: Section;
  mainValue: string;
  label: string;
  subtext: string;
  badgeText?: string;
  badgeColor?: string;
  delay: number;
  onClick?: () => void;
}) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      onClick={onClick}
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-6 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all ${
        onClick ? 'cursor-pointer group' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2.5 rounded-lg bg-slate-100 dark:bg-[#182338] ${meta.color} group-hover:scale-105 transition-transform`}>
            <Icon size={20} />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-400 transition-colors">
            {label}
          </span>
        </div>

        {badgeText && (
          <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${badgeColor || 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="my-2">
        <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
          {mainValue}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span className="truncate pr-2">{subtext}</span>
        <ArrowUpRight size={15} className="text-slate-400 group-hover:text-cyan-400 shrink-0 transition-colors" />
      </div>
    </motion.div>
  );
}

function OverviewSection({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const { certifications, planDays, fieldEntries, oemSessions = [] } = useDashboard();

  const completedCerts = useMemo(
    () => certifications.filter(c => c.status === 'completed'),
    [certifications]
  );
  const upNextCerts = useMemo(
    () => certifications.filter(c => c.status === 'up_next'),
    [certifications]
  );
  const masteredDays = useMemo(
    () => planDays.filter(d => d.status === 'mastered'),
    [planDays]
  );
  const inProgressDays = useMemo(
    () => planDays.filter(d => d.status === 'in_progress'),
    [planDays]
  );
  const notStartedDays = useMemo(
    () => planDays.filter(d => d.status === 'not_started'),
    [planDays]
  );

  // ── Realistic Chart 1: Real Monthly Learning Velocity & Practice Milestones (Aug – Nov 2026) ──
  const velocityTimelineData = [
    {
      month: 'Aug 2026',
      credentialsTotal: 1,
      customerAndOemTotal: 1,
      keyMilestone: 'IBM Power11 & Redington RISC Session',
    },
    {
      month: 'Sep 2026',
      credentialsTotal: 3,
      customerAndOemTotal: 4,
      keyMilestone: 'Arista Single EOS, Druva SaaS Backup & Ray Networks SD-WAN',
    },
    {
      month: 'Oct 2026',
      credentialsTotal: 9,
      customerAndOemTotal: 16,
      keyMilestone: '6 NetApp Certs Sprint + 6 Customer Engagements (Air Water, Bazar Kolkata, Indian Express, Century Ply, CDOT, IIT KGP)',
    },
    {
      month: 'Nov 2026',
      credentialsTotal: 11,
      customerAndOemTotal: 17,
      keyMilestone: 'Target NCA & NCTA Goals + Rockwell Industrial IDMZ Convergence',
    },
  ];

  // ── Realistic Chart 2: Real OEM Enablement by Domain (11 Sessions) ──
  const oemDomainData = [
    { name: 'Agentic AI & MCP', value: 4, percent: 36, color: '#06B6D4', details: 'Cisco VJ Jadeja, Nour Meraki MCP, Cloud Control, Splunk AITK' },
    { name: 'Observability & SecOps', value: 2, percent: 18, color: '#8B5CF6', details: 'Splunk Observability/APM, ThousandEyes Trust Layer' },
    { name: 'Data Center & Fabric', value: 2, percent: 18, color: '#3B82F6', details: 'Arista Single EOS Spine-Leaf, Ray Networks SD-WAN' },
    { name: 'Compute & Storage', value: 2, percent: 18, color: '#10B981', details: 'IBM Power11 & FlashSystem, Druva Cloud-Native Backup' },
    { name: 'Industrial OT/IT', value: 1, percent: 9, color: '#F59E0B', details: 'Rockwell Automation × Cisco 4-Tier IDMZ with Bali Sir' },
  ];

  // ── Customer Engagements Breakdown (The 6 Real Projects) ──
  const customerEngagementsList = [
    {
      org: 'Air Water India',
      type: 'Customer Meeting',
      domain: 'Compute, GPU & Internal SAS Storage',
      summary: 'Scoped NVIDIA GPU acceleration, RAID 10 internal SAS drives (20–50TB), Dual 1GbE+1GbE, and 5-yr HPE iLO remote management.',
      icon: Cpu,
      color: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      highlight: 'RAID 10 Internal SAS + GPU',
    },
    {
      org: 'Bazar Kolkata',
      type: 'Customer Meeting',
      domain: 'Enterprise Storage & SAN Fabric Routing',
      summary: 'Advised client on storage expansion: recommended installing a SAN switch over direct-attach 2-port HBA to ensure seamless multi-array routing.',
      icon: Network,
      color: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      highlight: 'SAN Switch Fabric Routing',
    },
    {
      org: 'The Indian Express',
      type: 'Customer Meeting',
      domain: '15-Year DC Audit & P2V Modernization',
      summary: 'Audited aging IBM V7000 SAN & NetBackup. Architected 15-20 server Physical-to-Virtual migration comparing 3-Tier vs Nutanix AHV HCI.',
      icon: HardDrive,
      color: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      highlight: '15-20 Server P2V (3-Tier vs HCI)',
    },
    {
      org: 'Century Ply',
      type: 'Customer Meeting',
      domain: 'Technical Workload Profile & Sizing Analysis',
      summary: 'Performed independent workload requirement analysis across compute, storage, and operational tiers to specify optimal platform sizing.',
      icon: Briefcase,
      color: 'text-purple-400',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      highlight: 'Independent Workload Profiling',
    },
    {
      org: 'CDOT',
      type: 'BOQ Assistance',
      domain: 'Telecom Infrastructure Sizing & BOQ Drafting',
      summary: 'Assisted in drafting, structuring, and verifying the Bill of Quantities (BOQ) for CDOT enterprise and telematics infrastructure.',
      icon: FileSpreadsheet,
      color: 'text-blue-400',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      highlight: 'Telecom Infrastructure BOQ',
    },
    {
      org: 'IIT Kharagpur',
      type: 'BOQ Assistance',
      domain: 'Research Computing & AI Cluster BOQ',
      summary: 'Collaborated directly with Kitmeer Sir to draft and refine research computing infrastructure BOQ featuring high-density HCI and GPU nodes.',
      icon: FileSpreadsheet,
      color: 'text-teal-400',
      badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      highlight: 'Research HPC & GPU Cluster with Kitmeer Sir',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Data Center Presales & Solution Architect
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
              ● Live Metrics Active
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Learning Progress Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Real presales engineering progress: verified vendor accreditations, 6 direct customer architecture engagements, 11 OEM partner enablement sessions, and 30-day curriculum mastery.
          </p>
        </div>

        {/* Presales Profile Summary Pill */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] shadow-sm">
          <div className="text-right">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Presales Practice Track
            </span>
            <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
              Enterprise Solution Architecture
            </div>
            <span className="text-[11px] font-mono text-slate-400 block">
              6 Customer Accounts · 11 OEM Deep-Dives
            </span>
          </div>

          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shrink-0">
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>

      {/* ── High-Readability Bento Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BentoCard
          section="certifications"
          label="Certifications"
          mainValue={`${completedCerts.length} Earned`}
          badgeText={`+${upNextCerts.length} Target`}
          badgeColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          subtext="6 NetApp · 2 Nutanix · 1 Cohesity"
          delay={0}
          onClick={() => onNavigate('certifications')}
        />
        <BentoCard
          section="30-day-plan"
          label="30-Day Mastery Plan"
          mainValue={`${masteredDays.length} / 30 Days`}
          badgeText={`${Math.round((masteredDays.length / planDays.length) * 100)}% Mastered`}
          badgeColor="bg-amber-500/10 text-amber-400 border-amber-500/30"
          subtext={`${inProgressDays.length} in progress · ${notStartedDays.length} pending`}
          delay={0.05}
          onClick={() => onNavigate('30-day-plan')}
        />
        <BentoCard
          section="field-ops"
          label="Customer Meetings"
          mainValue={`${fieldEntries.length} Accounts`}
          badgeText="4 Mtgs · 2 BOQs"
          badgeColor="bg-purple-500/10 text-purple-400 border-purple-500/30"
          subtext="Air Water · Bazar Kolkata · Indian Express"
          delay={0.1}
          onClick={() => onNavigate('field-ops')}
        />
        <BentoCard
          section="oem-trophies"
          label="OEM Meetings"
          mainValue={`${oemSessions.length} Sessions`}
          badgeText="5 Tech Domains"
          badgeColor="bg-orange-500/10 text-orange-400 border-orange-500/30"
          subtext="Cisco · Splunk · Arista · IBM · Rockwell"
          delay={0.15}
          onClick={() => onNavigate('oem-trophies')}
        />
      </div>

      {/* ── High-Fidelity Real Presales Graphs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Real Monthly Learning Velocity & Practice Trajectory (Span 7) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
                  <TrendingUp size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Monthly Credential & Presales Practice Trajectory (2026)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                11 Credentials Total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Cumulative progression of verified vendor credentials alongside customer architecture reviews and OEM enablement sessions.
            </p>
          </div>

          <div className="w-full h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityTimelineData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-[#0F172A] p-3 shadow-xl text-xs font-mono space-y-1.5 max-w-xs">
                          <p className="font-bold text-white text-sm">{label}</p>
                          <p className="text-cyan-400">
                            ● Cumulative Credentials: <strong>{data.credentialsTotal}</strong>
                          </p>
                          <p className="text-purple-400">
                            ● Customer & OEM Engagements: <strong>{data.customerAndOemTotal}</strong>
                          </p>
                          <p className="text-slate-300 pt-1 border-t border-slate-800 text-[11px] leading-relaxed">
                            <strong>Milestone:</strong> {data.keyMilestone}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="credentialsTotal"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cyanArea)"
                  name="Cumulative Credentials"
                />
                <Area
                  type="monotone"
                  dataKey="customerAndOemTotal"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#purpleArea)"
                  name="Customer & OEM Engagements"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <span className="w-3 h-1 bg-cyan-400 rounded-full" /> Credentials Earned
              </span>
              <span className="flex items-center gap-1.5 text-purple-400 font-medium">
                <span className="w-3 h-1 bg-purple-400 rounded-full border border-dashed" /> Customer & OEM Sessions
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">Sprint Peak: Oct 2026 (6 NetApp Certs + 6 Customer Mtgs)</span>
          </div>
        </motion.div>

        {/* Chart 2: Real OEM Enablement by Domain (Span 5) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                  <PieIcon size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  OEM Technical Enablement by Domain
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
                11 Sessions
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Distribution of the 11 vendor architectural sessions across key technology pillars.
            </p>
          </div>

          <div className="w-full h-[190px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={oemDomainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {oemDomainData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} stroke="#0D1526" strokeWidth={2.5} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-[#0F172A] p-2.5 shadow-xl text-xs font-mono space-y-1 max-w-xs">
                          <p className="font-bold text-white">{data.name}</p>
                          <p style={{ color: data.color }} className="font-bold">
                            {data.value} Sessions ({data.percent}%)
                          </p>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{data.details}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-xl font-black font-mono text-white block leading-none">
                11
              </span>
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">Sessions</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {oemDomainData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-bold text-white shrink-0">
                  {item.value} ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Real Customer Engagements & Architecture Solutions (The 6 Accounts) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1526] p-6 shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                <Users size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Presales Engagements & Architecture Solutions
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              The 6 verified enterprise accounts: storage capacity sizing, SAN switch fabric routing, 15-year DC P2V migration, and institutional BOQs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('field-ops')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30 transition-colors shrink-0"
          >
            View Customer Meetings View <ChevronRight size={14} />
          </button>
        </div>

        {/* 6 Customer Cards Grid — High Readability & Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerEngagementsList.map((client) => {
            const Icon = client.icon;
            return (
              <div
                key={client.org}
                onClick={() => onNavigate('field-ops')}
                className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800/90 bg-slate-50/70 dark:bg-[#111A2E] p-5 hover:border-cyan-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${client.badge}`}>
                      {client.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      2026-10
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`p-1.5 rounded bg-slate-200 dark:bg-[#182338] ${client.color}`}>
                      <Icon size={16} />
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                      {client.org}
                    </h4>
                  </div>

                  <span className="text-xs font-mono text-cyan-500 dark:text-cyan-400 block font-medium mb-2">
                    {client.domain}
                  </span>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    {client.summary}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-semibold truncate pr-2">
                    ✓ {client.highlight}
                  </span>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  return (
    <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
      <AnimatePresence mode="wait">
        {activeSection === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <OverviewSection onNavigate={setActiveSection} />
          </motion.div>
        ) : activeSection === '30-day-plan' ? (
          <motion.div
            key="30-day-plan"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <PlanView />
          </motion.div>
        ) : activeSection === 'certifications' ? (
          <motion.div
            key="certifications"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <CertificationsView />
          </motion.div>
        ) : activeSection === 'field-ops' ? (
          <motion.div
            key="field-ops"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <FieldOpsView />
          </motion.div>
        ) : activeSection === 'oem-trophies' ? (
          <motion.div
            key="oem-trophies"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <OemTrophiesView />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Layout>
  );
}
