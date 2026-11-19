import { type ReactNode } from 'react';
import { Sun, Moon, Server } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

type Section = 'overview' | '30-day-plan' | 'certifications' | 'field-ops' | 'oem-trophies';

interface LayoutProps {
  children: ReactNode;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: '30-day-plan', label: '30-Day Plan' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'field-ops', label: 'Customer Meetings' },
  { id: 'oem-trophies', label: 'OEM Meetings' },
];

export type { Section };

export default function Layout({ children, activeSection, onSectionChange }: LayoutProps) {
  const { certifications, planDays, fieldEntries, oemSessions = [], theme, toggleTheme } = useDashboard();

  const completedCerts = certifications.filter(c => c.status === 'completed').length;
  const totalCerts = certifications.length;
  const masteredDays = planDays.filter(d => d.status === 'mastered').length;
  const totalDays = planDays.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-[#1F2937] bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Title */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Server size={20} strokeWidth={2} />
              </div>
              <h1 className="text-lg font-semibold tracking-tight hidden sm:block">
                Learning Progress Dashboard
              </h1>
              <h1 className="text-lg font-semibold tracking-tight sm:hidden">
                Learning Dashboard
              </h1>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeSection === item.id
                      ? 'bg-cyan-500/10 text-cyan-500'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right: Status Pill + Theme Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-[#1F2937] bg-slate-50 dark:bg-[#111827] text-xs font-mono">
                <span className="text-emerald-500 font-semibold">{completedCerts}/{totalCerts} Certs</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-purple-400 font-semibold">{fieldEntries.length} Customer Mtgs</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-orange-400 font-semibold">{oemSessions.length} OEM Sessions</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-amber-500 font-semibold">{masteredDays}/{totalDays} Days</span>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeSection === item.id
                    ? 'bg-cyan-500/10 text-cyan-500'
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
