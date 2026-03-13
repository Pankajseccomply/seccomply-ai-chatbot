import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  // Run all queries in parallel
  const [tools, logs, alerts, shadow] = await Promise.all([
    supabase.from('ai_tools').select('id, approved, risk_level'),
    supabase.from('ai_activity_logs').select('id, risk_level, created_at').gte('created_at', new Date(Date.now() - 86400000).toISOString()),
    supabase.from('ai_alerts').select('id, severity, status').eq('status', 'open'),
    supabase.from('shadow_ai').select('id, user_count'),
  ]);

  const toolList      = tools.data  || [];
  const logList       = logs.data   || [];
  const alertList     = alerts.data || [];
  const shadowList    = shadow.data || [];

  const totalTools    = toolList.length;
  const unapproved    = toolList.filter(t => !t.approved).length;
  const totalUsers    = new Set(logList.map((l: any) => l.user_email)).size || 24; // fallback for seed data
  const sensitiveAlerts = alertList.filter(a => a.severity === 'critical' || a.severity === 'high').length;
  const shadowCount   = shadowList.length;
  const totalShadowUsers = shadowList.reduce((sum: number, s: any) => sum + (s.user_count || 0), 0);

  // Risk score calculation (100 = perfect, lower = more risk)
  let riskPenalty = 0;
  riskPenalty += Math.min(unapproved * 5, 25);           // up to -25 for unapproved tools
  riskPenalty += Math.min(sensitiveAlerts * 8, 32);      // up to -32 for sensitive alerts
  riskPenalty += Math.min(shadowCount * 4, 16);          // up to -16 for shadow AI
  const riskScore = Math.max(100 - riskPenalty, 0);

  const todayLogs  = logList.length;
  const highLogs   = logList.filter((l: any) => l.risk_level === 'high').length;

  return NextResponse.json({
    totalTools,
    unapproved,
    totalUsers,
    sensitiveAlerts,
    shadowCount,
    totalShadowUsers,
    riskScore,
    todayLogs,
    highLogs,
  });
}
