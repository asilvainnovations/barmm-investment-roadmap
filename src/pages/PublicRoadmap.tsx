import { useState } from 'react';
import { Globe, TrendingUp, Shield, Users, Target, Zap, ArrowRight, ChevronDown } from 'lucide-react';

const ROADMAP_SECTIONS = [
  {
    id: 'vision',
    title: 'Vision Statement',
    icon: Target,
    content: 'By 2035, BARMM shall be an internationally recognized hub for resilient and ethical investment, anchored on the Islamic principles of fairness, trust, and stewardship, and globally competitive through halal-certified products, services, and institutions.',
    highlights: ['Halal hub by 2035', 'Global competitiveness', 'Ethical investment'],
  },
  {
    id: 'pillars',
    title: 'Four Pillars of BIRD',
    icon: Zap,
    content: 'The BIRD framework rests on four interdependent pillars: Halal Economy, Islamic Finance, Green Economy, and Digital Infrastructure. Together they form the BEIE ecosystem (Bangsamoro Ethical Investment Ecosystem).',
    highlights: ['Halal Economy', 'Islamic Finance', 'Green Economy', 'Digital Infrastructure'],
  },
  {
    id: 'loops',
    title: 'Systems Thinking — Causal Loops',
    icon: TrendingUp,
    content: 'R1: Investment-Development Virtuous Cycle — Investment drives employment, market expansion, and business climate improvement. R2: Governance-Investor Confidence Loop — Transparency builds trust, increasing inflows and tax revenue. B1: Limits to Growth — Infrastructure constraints act as a ceiling. B2: Security-Investment Tensions — Security concerns deter investment.',
    highlights: ['R1: Virtuous Cycle', 'R2: Governance Loop', 'B1: Growth Limits', 'B2: Security Tensions'],
  },
  {
    id: 'phases',
    title: 'Strategic Phases 2026-2035',
    icon: Globe,
    content: 'Phase 1 (2026-2027): Foundation Building — BHB operationalization, Forestry Code, digital rollout. Phase 2 (2028-2029): Investment Acceleration — Export corridors, Halal Park 50% operational. Phase 3 (2030-2032): Expansion & Scaling — OIC/SMIIC accreditation, 2,000+ certified firms. Phase 4 (2033-2035): Resilience & Horizon — ₱55B cumulative investment, 5,000+ firms.',
    highlights: ['₱5B Phase 1', '₱15B Phase 2', '₱25B Phase 3', '₱10B Phase 4'],
  },
];

const BEIE_CLUSTERS = [
  { name: 'Foundations', description: 'Governance, human capital, security, social cohesion', color: 'border-green-500' },
  { name: 'Transformers', description: 'Halal certification, tourism, cultural products, creative economy', color: 'border-yellow-500' },
  { name: 'Enablers', description: 'Infrastructure, energy, transport, digital, water', color: 'border-blue-500' },
  { name: 'Connectors', description: 'Trade facilitation, BIMP-EAGA, diaspora networks, export corridors', color: 'border-purple-500' },
  { name: 'Financiers', description: 'Islamic banking, microfinance, capital markets, Takaful', color: 'border-gold' },
];

function SectionCard({ section }: { section: typeof ROADMAP_SECTIONS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = section.icon;

  return (
    <div className="glass rounded-xl p-6 card-hover border-l-2 border-l-gold/40">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
          <Icon size={20} className="text-gold" />
        </div>
        <h3 className="font-cinzel text-lg font-bold text-white">{section.title}</h3>
        <button onClick={() => setExpanded(!expanded)} className="ml-auto text-white/40 hover:text-white transition-colors">
          <ChevronDown size={18} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <p className="text-sm text-white/50 leading-relaxed mb-4">{section.content}</p>
      <div className="flex flex-wrap gap-2">
        {section.highlights.map((h, i) => (
          <span key={i} className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold/20">
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PublicRoadmap() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M30%205L36%2024L55%2030L36%2036L30%2055L24%2036L5%2030L24%2024Z%22%20fill%3D%22none%22%20stroke%3D%22%23C9A84C%22%20stroke-width%3D%220.3%22%20opacity%3D%220.05%22%2F%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">BIRD 2026-2035</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-gradient leading-tight mb-4">
          The Emerging<br />Bangsamoro
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-4">
          A Hub for Resilient and Ethical Growth
        </p>
        <p className="text-sm text-white/40 max-w-xl mx-auto mb-8">
          Bangsamoro Investment Roadmap Development 2026-2035 — Integrated Ecosystem Development Strategy (IEDS)
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/public-dashboard" className="btn btn-primary px-6 py-3 text-base">
            View Dashboard <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* BEIE Clusters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="font-cinzel text-xl font-bold text-gold mb-2">BEIE Clusters</h2>
          <p className="text-sm text-white/40">Bangsamoro Ethical Investment Ecosystem</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {BEIE_CLUSTERS.map((cluster) => (
            <div key={cluster.name} className={`glass rounded-xl p-4 text-center card-hover border-t-2 ${cluster.color}`}>
              <h3 className="font-cinzel text-sm font-bold text-white mb-1">{cluster.name}</h3>
              <p className="text-xs text-white/40">{cluster.description}</p>
            </div>
          ))}
        </div>

        {/* Roadmap Sections */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {ROADMAP_SECTIONS.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center py-8 border-t border-gold/10">
          <p className="font-cinzel text-gold text-sm font-bold mb-2">BIRD Strategic Planning Platform</p>
          <p className="text-white/30 text-xs">Bangsamoro Investment Roadmap Development 2026-2035</p>
          <p className="text-white/20 text-xs mt-1">The Emerging Bangsamoro: A Hub for Resilient and Ethical Growth</p>
        </div>
      </div>
    </div>
  );
}
