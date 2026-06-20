import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Brain, GitBranch, BarChart3, FileText, Users,
  ArrowRight, Sparkles, Shield, Zap, Globe, ChevronDown,
  LayoutDashboard, ListChecks, Activity, Share2, Bell
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../hooks/useAuth';

const features = [
  { icon: Target, title: 'SWOT Analysis', desc: 'AI-powered strengths, weaknesses, opportunities, and threats assessment with quantified resilience scoring.' },
  { icon: Brain, title: 'Strategy Matrix', desc: 'Generate TOWS strategies from your SWOT analysis with AI-driven recommendations and priority scoring.' },
  { icon: BarChart3, title: 'Balanced Scorecard', desc: 'Track KPIs across Financial, Customer, Process, and Learning perspectives with real-time dashboards.' },
  { icon: ListChecks, title: 'PAPs Management', desc: 'Manage Programs, Activities, and Projects with budget tracking, progress monitoring, and milestone management.' },
  { icon: Activity, title: 'Systems Thinking', desc: 'Visualize causal loop diagrams, systems archetypes, and leverage points for strategic insight.' },
  { icon: FileText, title: 'Plan Export', desc: 'Export professional strategic plan documents in PDF, Word, or HTML formats for stakeholders.' },
];

const stats = [
  { value: '₱50B', label: '2035 Investment Target', icon: Zap },
  { value: '70M+', label: 'BIMP-EAGA Consumers', icon: Globe },
  { value: '13', label: 'Priority Sectors', icon: Target },
  { value: '2026-2035', label: 'Strategic Horizon', icon: Shield },
];

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#022c22]/90 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-[#022c22] font-cinzel font-bold text-sm">B</div>
            <span className="font-cinzel font-bold text-gold text-lg tracking-wide">BIRD 2026-2035</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button onClick={() => navigate('/app/dashboard')} className="btn btn-primary text-sm">
                Go to Dashboard <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={() => setShowAuth(true)} className="btn btn-primary text-sm">
                Sign In <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M30%205L36%2024L55%2030L36%2036L30%2055L24%2036L5%2030L24%2024Z%22%20fill%3D%22none%22%20stroke%3D%22%23C9A84C%22%20stroke-width%3D%220.3%22%20opacity%3D%220.05%22%2F%3E%3C%2Fsvg%3E')] opacity-30" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">AI-Powered Strategic Planning</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-gradient leading-tight mb-6">
            The Emerging<br />Bangsamoro
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-4 leading-relaxed">
            A Hub for Resilient and Ethical Growth
          </p>
          <p className="text-sm text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
            BIRD Strategic Planning Platform: AI-powered tools for SWOT analysis, strategy matrix generation,
            balanced scorecards, PAPs management, and systems thinking visualization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={handleGetStarted} className="btn btn-primary text-base px-8 py-3">
              Get Started <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-secondary text-base px-8 py-3"
            >
              Explore Features <ChevronDown size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass rounded-xl p-4 card-hover">
                  <Icon size={20} className="text-gold mx-auto mb-2" />
                  <div className="font-cinzel text-xl font-bold text-gold">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-3xl font-bold text-gold-gradient mb-4">Comprehensive Planning Suite</h2>
            <p className="text-white/50 max-w-2xl mx-auto">From analysis to execution, every tool you need to build resilient and ethical strategic plans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="glass rounded-xl p-6 card-hover group">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon size={24} className="text-gold" />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gold/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-3xl font-bold text-gold-gradient mb-4">Advanced Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-gold" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-white mb-2">Team Collaboration</h3>
              <p className="text-sm text-white/50">Share plans with your team, assign roles, comment on strategies, and track collaborative activity in real-time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Bell size={28} className="text-gold" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-white mb-2">Smart Notifications</h3>
              <p className="text-sm text-white/50">Get alerts for KPI thresholds, weekly progress digests, plan reminders, and team updates.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Share2 size={28} className="text-gold" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-white mb-2">Cloud Synchronization</h3>
              <p className="text-sm text-white/50">Work offline with automatic sync when connected. Conflict resolution for collaborative editing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gold/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-cinzel text-3xl font-bold text-gold-gradient mb-4">Ready to Plan the Future?</h2>
          <p className="text-white/50 mb-8">Join organizations using BIRD to transform strategic planning into measurable, ethical, and resilient growth.</p>
          <button onClick={handleGetStarted} className="btn btn-primary text-lg px-10 py-4">
            Start Your Strategic Plan <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gold/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-cinzel text-gold text-sm font-bold mb-2">BIRD Strategic Planning Platform</p>
          <p className="text-white/30 text-xs">Bangsamoro Investment Roadmap Development 2026-2035</p>
          <p className="text-white/20 text-xs mt-1">The Emerging Bangsamoro: A Hub for Resilient and Ethical Growth</p>
        </div>
      </footer>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
