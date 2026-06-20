import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StrategyRequest {
  section: string;
  plan_context: {
    title?: string;
    industry?: string;
    region?: string;
    description?: string;
    swot_items?: Array<{
      category: string;
      title: string;
      description?: string;
      impact?: number;
      likelihood?: number;
    }>;
    objectives?: Array<{
      title: string;
      description?: string;
      perspective?: string;
    }>;
    kpis?: Array<{
      name: string;
      target_value?: number;
      current_value?: number;
      unit?: string;
    }>;
    paps?: Array<{
      title: string;
      type: string;
      budget?: number;
    }>;
    strategies?: Array<{
      quadrant: string;
      strategy: string;
    }>;
  };
  prompt?: string;
}

function generateSWOTSuggestions(context: StrategyRequest["plan_context"]): string {
  const industry = context.industry || "Investment";
  const region = context.region || "BARMM";
  const items: Array<{ category: string; title: string; description: string; impact: number; likelihood: number; beie_cluster: string }> = [];

  if (industry === "Investment" || industry === "Halal" || industry === "Islamic Finance") {
    items.push(
      { category: "strength", title: "Halal Legitimacy & Cultural Credibility", description: "Authentic Muslim-majority identity providing unmatched branding advantage for OIC markets", impact: 5, likelihood: 5, beie_cluster: "transformers" },
      { category: "strength", title: "Strategic Location in BIMP-EAGA", description: "Proximity to Sabah and ASEAN trade corridors creating export gateway opportunities", impact: 4, likelihood: 4, beie_cluster: "connectors" },
      { category: "weakness", title: "Weak Halal Certification System", description: "Resource-constrained BHB with 45-60 day processing vs 15-day Malaysia benchmark", impact: 5, likelihood: 4, beie_cluster: "foundations" },
      { category: "weakness", title: "Critical Infrastructure Deficits", description: "Energy, transport, digital, and water gaps constraining industrial growth", impact: 5, likelihood: 5, beie_cluster: "enablers" },
      { category: "opportunity", title: "Global Halal Market USD 2.3T", description: "Growing demand for halal products across food, cosmetics, pharmaceuticals, and tourism", impact: 5, likelihood: 5, beie_cluster: "transformers" },
      { category: "opportunity", title: "Islamic Finance Ecosystem", description: "Growing global Shariah-compliant capital pool seeking ethical investments", impact: 4, likelihood: 5, beie_cluster: "financiers" },
      { category: "threat", title: "Climate Change Vulnerabilities", description: "El Nino, flooding, and shifting rainfall patterns affecting agriculture and infrastructure", impact: 5, likelihood: 4, beie_cluster: "foundations" },
      { category: "threat", title: "Competition from Established Halal Hubs", description: "Malaysia, Indonesia, Thailand holding established market share and brand recognition", impact: 4, likelihood: 4, beie_cluster: "connectors" }
    );
  }

  return JSON.stringify({ suggestions: items });
}

function generateStrategySuggestions(context: StrategyRequest["plan_context"]): string {
  const strategies: Array<{ quadrant: string; strategy: string; description: string; priority: string; beie_cluster: string }> = [];
  const swot = context.swot_items || [];

  const strengths = swot.filter(s => s.category === "strength");
  const weaknesses = swot.filter(s => s.category === "weakness");
  const opportunities = swot.filter(s => s.category === "opportunity");
  const threats = swot.filter(s => s.category === "threat");

  // SO strategies
  if (strengths.length > 0 && opportunities.length > 0) {
    strategies.push(
      { quadrant: "SO", strategy: "Halal Export Acceleration", description: "Leverage cultural credibility and BIMP-EAGA location to capture global halal market share", priority: "critical", beie_cluster: "connectors" },
      { quadrant: "SO", strategy: "Islamic Finance Hub Development", description: "Use Muslim-majority identity to attract Shariah-compliant investment and banking", priority: "high", beie_cluster: "financiers" }
    );
  }

  // ST strategies
  if (strengths.length > 0 && threats.length > 0) {
    strategies.push(
      { quadrant: "ST", strategy: "Climate-Resilient Agriculture", description: "Deploy climate-smart practices to protect AFF base while leveraging halal brand advantage", priority: "high", beie_cluster: "foundations" },
      { quadrant: "ST", strategy: "OIC Standards Alignment", description: "Fast-track BHB certification to OIC/SMIIC standards to compete with Malaysia/Indonesia", priority: "critical", beie_cluster: "transformers" }
    );
  }

  // WO strategies
  if (weaknesses.length > 0 && opportunities.length > 0) {
    strategies.push(
      { quadrant: "WO", strategy: "Digital Infrastructure Leap", description: "Invest in digital backbone to enable e-commerce and global supply chain integration", priority: "high", beie_cluster: "enablers" },
      { quadrant: "WO", strategy: "Capacity Building for Halal Certification", description: "Train auditors and modernize labs to meet global demand", priority: "critical", beie_cluster: "foundations" }
    );
  }

  // WT strategies
  if (weaknesses.length > 0 && threats.length > 0) {
    strategies.push(
      { quadrant: "WT", strategy: "Diversification Beyond Rubber", description: "Reduce commodity dependency through value-added processing and new crop varieties", priority: "medium", beie_cluster: "foundations" },
      { quadrant: "WT", strategy: "Disaster Risk Financing", description: "Establish Islamic catastrophe bonds and micro-Takaful for climate resilience", priority: "medium", beie_cluster: "financiers" }
    );
  }

  return JSON.stringify({ suggestions: strategies });
}

function generateKPISuggestions(context: StrategyRequest["plan_context"]): string {
  const kpis: Array<{ name: string; description: string; target_value: number; unit: string; frequency: string; alert_threshold: number; perspective: string }> = [];

  const industry = context.industry || "Investment";
  const region = context.region || "BARMM";

  if (industry === "Investment" || industry === "Halal") {
    kpis.push(
      { name: "Halal Certification Rate", description: "Percentage of eligible enterprises with OIC/SMIIC-aligned halal certification", target_value: 80, unit: "percent", frequency: "quarterly", alert_threshold: 70, perspective: "internal_process" },
      { name: "Investment Inflows", description: "Total registered investment in BARMM in Philippine Pesos", target_value: 5000000000, unit: "PHP", frequency: "annual", alert_threshold: 80, perspective: "financial" },
      { name: "Business Registration Time", description: "Average time to complete business registration in days", target_value: 1, unit: "days", frequency: "monthly", alert_threshold: 90, perspective: "internal_process" },
      { name: "Digital Literacy Rate", description: "Percentage of working-age population with basic ICT skills", target_value: 60, unit: "percent", frequency: "annual", alert_threshold: 70, perspective: "learning_growth" },
      { name: "Renewable Energy Share", description: "Percentage of total energy from renewable sources", target_value: 30, unit: "percent", frequency: "annual", alert_threshold: 75, perspective: "internal_process" },
      { name: "Poverty Reduction Rate", description: "Year-on-year reduction in poverty incidence", target_value: 5, unit: "percent", frequency: "annual", alert_threshold: 80, perspective: "customer" }
    );
  }

  return JSON.stringify({ suggestions: kpis });
}

function generatePlanImprovements(context: StrategyRequest["plan_context"]): string {
  const improvements: Array<{ area: string; suggestion: string; priority: string; rationale: string }> = [];

  const hasSwot = (context.swot_items?.length || 0) > 0;
  const hasStrategies = (context.strategies?.length || 0) > 0;
  const hasKpis = (context.kpis?.length || 0) > 0;
  const hasPaps = (context.paps?.length || 0) > 0;

  if (!hasSwot || (context.swot_items?.length || 0) < 8) {
    improvements.push({
      area: "SWOT Analysis",
      suggestion: "Expand SWOT to cover all BEIE clusters (Foundations, Transformers, Enablers, Connectors, Financiers)",
      priority: "high",
      rationale: "A comprehensive SWOT ensures no blind spots in strategic assessment"
    });
  }

  if (hasSwot && !hasStrategies) {
    improvements.push({
      area: "Strategy Matrix",
      suggestion: "Generate TOWS strategies from existing SWOT to bridge analysis and action",
      priority: "critical",
      rationale: "SWOT without strategy derivation is incomplete planning"
    });
  }

  if (!hasKpis || (context.kpis?.length || 0) < 5) {
    improvements.push({
      area: "KPIs",
      suggestion: "Add outcome KPIs for each BSC perspective to enable MEL tracking",
      priority: "high",
      rationale: "Measurable outcomes are essential for adaptive management"
    });
  }

  if (!hasPaps || (context.paps?.length || 0) < 3) {
    improvements.push({
      area: "PAPs",
      suggestion: "Define Programs, Activities, and Projects with budget allocation and timelines",
      priority: "medium",
      rationale: "Strategic objectives need concrete implementation actions"
    });
  }

  return JSON.stringify({ suggestions: improvements });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: StrategyRequest = await req.json();
    const { section, plan_context, prompt } = body;

    let response: string;

    switch (section) {
      case "swot":
        response = generateSWOTSuggestions(plan_context);
        break;
      case "strategy":
        response = generateStrategySuggestions(plan_context);
        break;
      case "kpi":
        response = generateKPISuggestions(plan_context);
        break;
      case "improvements":
        response = generatePlanImprovements(plan_context);
        break;
      default:
        response = generatePlanImprovements(plan_context);
    }

    return new Response(response, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
