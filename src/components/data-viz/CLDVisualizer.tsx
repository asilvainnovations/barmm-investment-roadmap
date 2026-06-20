import { useState } from 'react';
import { CAUSAL_LOOPS, type CausalLoop } from '../../data/bird/clds';
import { ArrowRight, Minus, Plus } from 'lucide-react';

export function CLDVisualizer() {
  const [selectedLoop, setSelectedLoop] = useState<CausalLoop | null>(null);
  const loops = CAUSAL_LOOPS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Interactive Visualization</span>
          <h2 className="font-cinzel text-xl font-bold text-white mt-1">Causal Loop Diagrams</h2>
          <div className="w-10 h-1 bg-gold-grad rounded-full mt-2" />
        </div>
      </div>

      {/* Loop Selector */}
      <div className="flex flex-wrap gap-2">
        {loops.map((loop) => (
          <button
            key={loop.id}
            onClick={() => setSelectedLoop(loop.id === selectedLoop?.id ? null : loop)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selectedLoop?.id === loop.id
                ? 'bg-gold-grad text-[#022c22]'
                : loop.loop_type === 'reinforcing'
                ? 'bg-green-500/10 text-green-300 border border-green-500/30 hover:bg-green-500/20'
                : 'bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20'
            }`}
          >
            {loop.id} — {loop.name}
          </button>
        ))}
      </div>

      {/* Diagram Canvas */}
      {selectedLoop ? (
        <div className="glass rounded-xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cinzel text-lg font-bold text-white">
              {selectedLoop.id} — {selectedLoop.name}
            </h3>
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${
              selectedLoop.loop_type === 'reinforcing'
                ? 'bg-green-500/15 text-green-300 border-green-500/30'
                : 'bg-gold/15 text-gold border-gold/30'
            }`}>
              {selectedLoop.typeLabel}
            </span>
          </div>
          <p className="text-sm text-white/50 mb-6">{selectedLoop.description}</p>

          <div className="relative w-full h-80 bg-[#011a12]/80 rounded-lg border border-white/5 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Connections */}
              {selectedLoop.connections.map((conn, i) => {
                const fromNode = selectedLoop.nodes.find((n) => n.id === conn.from);
                const toNode = selectedLoop.nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                return (
                  <g key={i}>
                    <line
                      x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
                      stroke={conn.polarity === '+' ? '#10b981' : '#C9A84C'}
                      strokeWidth="0.5"
                      markerEnd="url(#arrowhead)"
                      opacity="0.6"
                    />
                    <text x={(fromNode.x + toNode.x) / 2} y={(fromNode.y + toNode.y) / 2 - 1} fill="white" fontSize="3" textAnchor="middle" opacity="0.7">
                      {conn.polarity === '+' ? '+' : '—'}
                    </text>
                  </g>
                );
              })}
              {/* Nodes */}
              {selectedLoop.nodes.map((node) => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r="4" fill="rgba(2,44,34,0.9)" stroke="#C9A84C" strokeWidth="0.3" />
                  <text x={node.x} y={node.y + 0.8} fill="white" fontSize="2.5" textAnchor="middle" opacity="0.8">
                    {node.label}
                  </text>
                </g>
              ))}
              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="4" markerHeight="3" refX="2" refY="1.5" orient="auto">
                  <polygon points="0 0, 4 1.5, 0 3" fill="#C9A84C" opacity="0.6" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedLoop.leverage_points.map((lp) => (
              <span key={lp} className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full border border-gold/20">
                {lp}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-white/40 text-sm">Select a causal loop above to visualize its dynamics</p>
        </div>
      )}
    </div>
  );
}
