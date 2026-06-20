import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  type: string;
  to: string;
  user_name?: string;
  plan_title?: string;
  data?: Record<string, unknown>;
}

function buildEmailHtml(type: string, data: Record<string, unknown>): string {
  const brandColor = "#C9A84C";
  const darkColor = "#022c22";
  const bgColor = "#f8f4ec";

  const header = `<div style="background: linear-gradient(135deg, ${darkColor}, #064e3b); padding: 30px; text-align: center;">
    <h1 style="color: ${brandColor}; font-family: 'Cinzel', serif; margin: 0; font-size: 24px;">BIRD Strategic Planning</h1>
    <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-family: 'DM Sans', sans-serif; font-size: 14px;">Bangsamoro Investment Roadmap Development</p>
  </div>`;

  const footer = `<div style="background: ${darkColor}; padding: 20px; text-align: center; color: rgba(255,255,255,0.5); font-size: 12px; font-family: 'DM Sans', sans-serif;">
    <p>&copy; 2026 BIRD Strategic Planning Platform. All rights reserved.</p>
    <p style="margin-top: 8px; color: ${brandColor};">The Emerging Bangsamoro: A Hub for Resilient and Ethical Growth</p>
  </div>`;

  let body = "";
  const userName = data.user_name || "Valued User";

  switch (type) {
    case "welcome":
      body = `<div style="padding: 30px; background: ${bgColor}; font-family: 'DM Sans', sans-serif; color: #2c3020;">
        <h2 style="color: ${darkColor}; font-family: 'Cinzel', serif;">Welcome to BIRD, ${userName}!</h2>
        <p style="line-height: 1.6;">Your strategic planning journey begins now. Here is your getting started guide:</p>
        <ul style="line-height: 1.8; padding-left: 20px;">
          <li><strong>Create a Strategic Plan</strong> - Start by defining your vision, mission, and objectives</li>
          <li><strong>Complete SWOT Analysis</strong> - Identify strengths, weaknesses, opportunities, and threats</li>
          <li><strong>Generate Strategy Matrix</strong> - Use AI to derive TOWS strategies from your SWOT</li>
          <li><strong>Build Balanced Scorecard</strong> - Set KPIs across Financial, Customer, Process, and Learning perspectives</li>
          <li><strong>Define PAPs</strong> - Map Programs, Activities, and Projects with budgets and timelines</li>
          <li><strong>Export Your Plan</strong> - Generate professional documents for stakeholders</li>
        </ul>
        <p style="margin-top: 20px; line-height: 1.6;">
          <a href="${data.app_url || "https://bird-strategic.app"}" style="background: ${brandColor}; color: ${darkColor}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Get Started</a>
        </p>
      </div>`;
      break;

    case "kpi_alert":
      body = `<div style="padding: 30px; background: ${bgColor}; font-family: 'DM Sans', sans-serif; color: #2c3020;">
        <h2 style="color: #dc2626; font-family: 'Cinzel', serif;">KPI Alert: ${data.kpi_name || "Metric"}</h2>
        <p style="line-height: 1.6;"><strong>${data.kpi_name || "A KPI"}</strong> in plan <strong>${data.plan_title || "Your Plan"}</strong> is currently <strong style="color: #dc2626;">${data.status || "At Risk"}</strong>.</p>
        <div style="background: white; border: 1px solid rgba(201,168,76,0.3); border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Current Value:</strong> ${data.current_value || "N/A"} ${data.unit || ""}</p>
          <p style="margin: 4px 0;"><strong>Target:</strong> ${data.target_value || "N/A"} ${data.unit || ""}</p>
          <p style="margin: 4px 0;"><strong>Gap:</strong> ${data.gap || "N/A"}</p>
        </div>
        <p style="line-height: 1.6;">Please review and take corrective action.</p>
      </div>`;
      break;

    case "weekly_digest":
      const kpis = data.kpis as Array<{name: string; status: string; current: number; target: number}> || [];
      const paps = data.paps as Array<{title: string; status: string; progress: number; due_date: string}> || [];
      body = `<div style="padding: 30px; background: ${bgColor}; font-family: 'DM Sans', sans-serif; color: #2c3020;">
        <h2 style="color: ${darkColor}; font-family: 'Cinzel', serif;">Weekly Progress Digest</h2>
        <p style="line-height: 1.6;">Plan: <strong>${data.plan_title || "Your Plan"}</strong></p>
        <p style="line-height: 1.6;">Overall Progress: <strong>${data.overall_progress || "0"}%</strong></p>
        <h3 style="color: ${brandColor}; font-family: 'Cinzel', serif; font-size: 16px; margin-top: 24px;">KPI Status</h3>
        ${kpis.map(k => `<div style="padding: 8px; border-bottom: 1px solid rgba(201,168,76,0.15);">
          <span style="font-weight: 600;">${k.name}</span> - 
          <span style="color: ${k.status === 'on_track' ? '#16a34a' : k.status === 'at_risk' ? '#ca8a04' : '#dc2626'};">${k.status}</span>
          <span style="color: #6b7060; font-size: 12px;">(${k.current}/${k.target})</span>
        </div>`).join("")}
        <h3 style="color: ${brandColor}; font-family: 'Cinzel', serif; font-size: 16px; margin-top: 24px;">Upcoming PAPs</h3>
        ${paps.map(p => `<div style="padding: 8px; border-bottom: 1px solid rgba(201,168,76,0.15);">
          <span style="font-weight: 600;">${p.title}</span>
          <span style="color: #6b7060; font-size: 12px;">Due: ${p.due_date || "N/A"} | Progress: ${p.progress || 0}%</span>
        </div>`).join("")}
      </div>`;
      break;

    case "plan_reminder":
      body = `<div style="padding: 30px; background: ${bgColor}; font-family: 'DM Sans', sans-serif; color: #2c3020;">
        <h2 style="color: ${darkColor}; font-family: 'Cinzel', serif;">Plan Update Reminder</h2>
        <p style="line-height: 1.6;">Hi ${userName},</p>
        <p style="line-height: 1.6;">Your strategic plan <strong>${data.plan_title || "Your Plan"}</strong> has not been updated in ${data.days_stale || "several"} days.</p>
        <p style="line-height: 1.6;">Regular updates ensure your plan remains relevant and aligned with changing conditions. Please review and update your KPIs, PAPs, or strategies.</p>
        <p style="margin-top: 20px;">
          <a href="${data.app_url || "#"}" style="background: ${brandColor}; color: ${darkColor}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Update My Plan</a>
        </p>
      </div>`;
      break;

    case "team_invite":
      body = `<div style="padding: 30px; background: ${bgColor}; font-family: 'DM Sans', sans-serif; color: #2c3020;">
        <h2 style="color: ${darkColor}; font-family: 'Cinzel', serif;">Team Invitation</h2>
        <p style="line-height: 1.6;">Hi ${userName},</p>
        <p style="line-height: 1.6;"><strong>${data.invited_by || "Someone"}</strong> has invited you to join <strong>${data.org_name || "a team"}</strong> as a <strong>${data.role || "member"}</strong>.</p>
        <p style="margin-top: 20px;">
          <a href="${data.invite_url || "#"}" style="background: ${brandColor}; color: ${darkColor}; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Accept Invitation</a>
        </p>
      </div>`;
      break;

    default:
      body = `<div style="padding: 30px; background: ${bgColor}; font-family: 'DM Sans', sans-serif; color: #2c3020;">
        <p>Notification from BIRD Strategic Planning Platform.</p>
      </div>`;
  }

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background: #e5e5e5;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    ${header}
    ${body}
    ${footer}
  </div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();
    const { type, to, data = {} } = body;

    const html = buildEmailHtml(type, data);

    const subjectMap: Record<string, string> = {
      welcome: "Welcome to BIRD Strategic Planning",
      kpi_alert: "KPI Alert: Action Required",
      weekly_digest: "Your Weekly Progress Digest",
      plan_reminder: "Plan Update Reminder",
      team_invite: "Team Invitation",
    };

    return new Response(
      JSON.stringify({
        success: true,
        type,
        to,
        subject: subjectMap[type] || "BIRD Notification",
        html,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
