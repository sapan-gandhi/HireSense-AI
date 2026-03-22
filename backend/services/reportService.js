const generateReportHTML = (analysis, user) => {
  const name  = user?.name || 'Candidate'
  const date  = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const role  = analysis.selectedRole || analysis.careerMatches?.[0]?.role || 'Target Role'
  const jd    = analysis.jdIntelligence || null

  const chip = (arr, color) => (arr || []).map(s =>
    `<span style="display:inline-block;background:${color}22;border:1px solid ${color}55;color:${color};padding:3px 10px;border-radius:12px;font-size:12px;margin:3px;font-weight:500;">${s}</span>`
  ).join('')

  const bar = (label, value, color) => `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#555;margin-bottom:4px;">
        <span>${label}</span><strong style="color:${color}">${value}%</strong>
      </div>
      <div style="height:7px;background:#e8eaf0;border-radius:4px;overflow:hidden;">
        <div style="width:${value}%;height:100%;background:${color};border-radius:4px;"></div>
      </div>
    </div>`

  const roadmapHTML = (analysis.roadmap || []).map(w => `
    <div style="margin-bottom:14px;padding:12px 14px;background:#f8f9ff;border-left:3px solid #6D5DF6;border-radius:4px;">
      <div style="font-weight:700;color:#6D5DF6;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Week ${w.week}</div>
      <div style="font-weight:600;font-size:14px;margin-bottom:6px;color:#1a1a2e;">${w.goal}</div>
      ${(w.topics || []).map(t => `<div style="font-size:12px;color:#444;padding:2px 0;">→ ${t}</div>`).join('')}
      ${w.task ? `<div style="margin-top:8px;padding:7px 10px;background:#fff;border-radius:4px;font-size:12px;color:#6D5DF6;border:1px solid #6D5DF633;">🎯 ${w.task}</div>` : ''}
    </div>`).join('')

  const questionsHTML = (type, label, color) => {
    const qs = analysis.interviewQuestions?.[type] || []
    return `<h3 style="color:${color};font-size:13px;font-weight:700;margin:14px 0 8px;text-transform:uppercase;letter-spacing:.5px;">${label}</h3>` +
      qs.map((q, i) => {
        const qText = typeof q === 'object' ? q.question : q
        const aText = typeof q === 'object' ? q.answer : ''
        return `<div style="margin-bottom:10px;padding:10px 12px;background:#fafbff;border-radius:6px;border:1px solid #e8eaf0;">
          <div style="font-weight:600;font-size:12px;color:#1a1a2e;margin-bottom:4px;">Q${i+1}. ${qText}</div>
          ${aText ? `<div style="font-size:11px;color:#555;line-height:1.6;border-top:1px solid #e8eaf0;padding-top:5px;margin-top:5px;"><strong>Answer:</strong> ${aText}</div>` : ''}
        </div>`
      }).join('')
  }

  // ── JD Intelligence section (only if JD was run) ──────
  const jdSection = !jd ? `
    <div class="section">
      <div class="section-header">🎯 JD Intelligence</div>
      <div style="background:#f8f9ff;border-radius:8px;padding:16px;text-align:center;color:#888;font-size:13px;">
        No JD analysis yet. Go to <strong>JD Matcher</strong> and paste a job description to unlock Shortlist Probability, Semantic Score, and Hiring Breakdown.
      </div>
    </div>` : `
    <div class="section">
      <div class="section-header">🎯 JD Intelligence — ${jd.roleTitle || role}</div>

      <!-- Shortlist Probability -->
      <div style="display:flex;align-items:center;gap:18px;padding:16px;background:${jd.shortlistTierColor === 'success' ? '#f0fff4' : jd.shortlistTierColor === 'danger' ? '#fff5f5' : '#fffbeb'};border-radius:10px;margin-bottom:14px;border:1px solid ${jd.shortlistTierColor === 'success' ? '#c8e6c9' : jd.shortlistTierColor === 'danger' ? '#ffcdd2' : '#ffe082'};">
        <div style="width:70px;height:70px;border-radius:50%;border:5px solid ${jd.shortlistTierColor === 'success' ? '#22C55E' : jd.shortlistTierColor === 'danger' ? '#EF4444' : '#F59E0B'};display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:20px;font-weight:800;color:${jd.shortlistTierColor === 'success' ? '#22C55E' : jd.shortlistTierColor === 'danger' ? '#EF4444' : '#F59E0B'};">${jd.shortlistProbability}%</span>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:3px;">SHORTLIST PROBABILITY · ${jd.confidenceRange} CONFIDENCE</div>
          <div style="font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:4px;">${jd.shortlistTier}</div>
          <div style="font-size:12px;color:#555;line-height:1.5;">${jd.explanation?.verdict || ''}</div>
        </div>
      </div>

      <!-- Score pills -->
      <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:80px;background:#f0efff;border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:#6D5DF6;">${jd.matchScore}%</div>
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.3px;">Skill Match</div>
        </div>
        <div style="flex:1;min-width:80px;background:#e0f7fa;border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:#0288d1;">${jd.semanticScore}%</div>
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.3px;">Semantic Score</div>
        </div>
        <div style="flex:1;min-width:80px;background:#e8f5e9;border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:#388e3c;">${jd.domainAlignment}%</div>
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.3px;">Domain Alignment</div>
        </div>
        <div style="flex:1;min-width:80px;background:#fff8e1;border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:#f57f17;">${jd.atsCoverage?.coveragePct || 0}%</div>
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.3px;">ATS Coverage</div>
        </div>
      </div>

      <!-- Hiring Breakdown bars -->
      ${jd.shortlistBreakdown ? `
      <div style="margin-bottom:14px;">
        <div style="font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:10px;">📊 Hiring Breakdown</div>
        ${bar('Skill Match',      jd.shortlistBreakdown.skillMatch,       '#6D5DF6')}
        ${bar('Semantic Score',   jd.shortlistBreakdown.semanticScore,    '#0288d1')}
        ${bar('Domain Alignment', jd.shortlistBreakdown.domainAlignment,  '#388e3c')}
        ${bar('Project Quality',  jd.shortlistBreakdown.projectQuality,   '#f59e0b')}
        ${bar('Achievements',     jd.shortlistBreakdown.achievementScore, '#e64a19')}
        ${bar('Resume Score',     jd.shortlistBreakdown.resumeScore,      '#38BDF8')}
        ${jd.shortlistBreakdown.missingPenalty > 0 ? `<div style="font-size:12px;color:#e53935;margin-top:4px;">⚠ Missing skills penalty: -${jd.shortlistBreakdown.missingPenalty} pts</div>` : ''}
      </div>` : ''}

      <!-- Explainable AI -->
      <div style="display:flex;gap:12px;margin-bottom:14px;">
        <div style="flex:1;background:#f0fff4;border-radius:8px;padding:12px;border:1px solid #c8e6c9;">
          <div style="font-size:11px;font-weight:700;color:#2e7d32;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px;">✅ Why You May Get Shortlisted</div>
          ${(jd.explanation?.shortlistReasons || []).map(r => `<div style="font-size:12px;color:#444;padding:3px 0;display:flex;gap:6px;"><span style="color:#22C55E;">✓</span>${r}</div>`).join('')}
        </div>
        <div style="flex:1;background:#fff5f5;border-radius:8px;padding:12px;border:1px solid #ffcdd2;">
          <div style="font-size:11px;font-weight:700;color:#c62828;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px;">⚠ Why You May Get Rejected</div>
          ${(jd.explanation?.rejectionReasons || []).map(r => `<div style="font-size:12px;color:#444;padding:3px 0;display:flex;gap:6px;"><span style="color:#EF4444;">✗</span>${r}</div>`).join('')}
        </div>
      </div>

      <!-- Strengths & Weaknesses -->
      <div style="margin-bottom:14px;">
        <div style="font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:8px;">🔍 Detailed Analysis</div>
        <div style="display:flex;gap:12px;">
          <div style="flex:1;">
            <div style="font-size:11px;font-weight:700;color:#2e7d32;margin-bottom:6px;">STRENGTHS</div>
            <ul style="padding-left:16px;">
              ${(jd.explanation?.strengths || []).map(s => `<li style="font-size:12px;color:#444;margin-bottom:4px;line-height:1.5;">${s}</li>`).join('')}
            </ul>
          </div>
          <div style="flex:1;">
            <div style="font-size:11px;font-weight:700;color:#c62828;margin-bottom:6px;">WEAKNESSES</div>
            <ul style="padding-left:16px;">
              ${(jd.explanation?.weaknesses || []).map(s => `<li style="font-size:12px;color:#444;margin-bottom:4px;line-height:1.5;">${s}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- Missing critical skills -->
      ${jd.criticalMissingSkills?.length ? `
      <div style="margin-bottom:14px;">
        <div style="font-size:12px;font-weight:700;color:#c62828;margin-bottom:6px;">⚠ Critical Missing Skills</div>
        ${chip(jd.criticalMissingSkills, '#EF4444')}
      </div>` : ''}


      <!-- Executive Summary -->
      ${jd.executiveSummary ? `
      <div style="background:#f0efff;border-radius:10px;padding:14px 16px;margin-bottom:14px;border-left:4px solid #6D5DF6;">
        <div style="font-size:10px;font-weight:700;color:#6D5DF6;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;">✦ AI Executive Summary</div>
        <p style="font-size:13px;color:#333;line-height:1.7;">${jd.executiveSummary}</p>
      </div>` : ''}

      <!-- Score Legend -->
      <div style="margin-bottom:14px;">
        <div style="font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:8px;">📊 Score Interpretation Scale</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${[{range:'80–100',label:'Strong shortlist potential',color:'#22C55E'},{range:'60–79',label:'Competitive with improvements',color:'#22C55E'},{range:'40–59',label:'Partial fit',color:'#F59E0B'},{range:'Below 40',label:'Low alignment',color:'#EF4444'}].map(item => `
          <div style="padding:6px 12px;background:#fafbff;border-radius:8px;border:1px solid ${item.range === (jd.shortlistProbability >= 80 ? '80–100' : jd.shortlistProbability >= 60 ? '60–79' : jd.shortlistProbability >= 40 ? '40–59' : 'Below 40') ? item.color+'44' : '#e0e0f0'};">
            <span style="font-size:11px;font-weight:700;color:${item.color}">${item.range}%</span>
            <span style="font-size:11px;color:#555;margin-left:6px">${item.label}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Improvement Simulation -->
      ${jd.improvementSimulation?.simulations?.length ? `
      <div style="margin-bottom:14px;">
        <div style="font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:4px;">📈 Improvement Simulation</div>
        <p style="font-size:12px;color:#666;margin-bottom:8px;">If you make these changes, projected probability: <strong style="color:#22C55E">${jd.improvementSimulation.projectedProbability}% (+${jd.improvementSimulation.combinedDelta}%)</strong></p>
        ${jd.improvementSimulation.simulations.map(s => `
        <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 12px;background:#fafbff;border-radius:8px;border:1px solid #e8eaf0;margin-bottom:7px;">
          <div style="min-width:44px;text-align:center;flex-shrink:0;">
            <div style="font-size:17px;font-weight:800;color:#22C55E;line-height:1;">+${s.delta}%</div>
            <div style="font-size:9px;color:#888;text-transform:uppercase;">boost</div>
          </div>
          <div>
            <div style="font-size:12px;font-weight:600;color:#1a1a2e;margin-bottom:2px;">${s.action}</div>
            <div style="font-size:11px;color:#555;margin-bottom:2px;">${s.detail}</div>
            <div style="font-size:10px;color:#888;font-style:italic;">Effort: ${s.effort}</div>
          </div>
        </div>`).join('')}
      </div>` : ''}

      <!-- JD Keyword Gaps -->
      ${jd.keywordGaps ? `
      <div style="margin-bottom:14px;">
        <div style="font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:8px;">🔑 JD Keyword Gaps (ATS Coverage: ${jd.keywordGaps.coveragePct}% · Grade ${jd.keywordGaps.grade})</div>
        ${jd.keywordGaps.presentKeywords?.length ? `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:700;color:#2e7d32;margin-bottom:5px;">PRESENT IN RESUME</div>${chip(jd.keywordGaps.presentKeywords,'#22C55E')}</div>` : ''}
        ${jd.keywordGaps.missingKeywords?.length ? `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:700;color:#f57f17;margin-bottom:5px;">MISSING KEYWORDS</div>${chip(jd.keywordGaps.missingKeywords,'#F59E0B')}</div>` : ''}
        ${jd.keywordGaps.placements?.length ? `
        <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:6px;text-transform:uppercase;">Suggested Placement</div>
        ${jd.keywordGaps.placements.map(p => `
          <div style="display:flex;gap:8px;align-items:center;font-size:11px;padding:5px 8px;background:#fafbff;border-radius:6px;margin-bottom:4px;">
            <span style="background:#e0f7fa;color:#0288d1;padding:2px 8px;border-radius:5px;font-weight:600;flex-shrink:0">${p.keyword}</span>
            <span style="color:#555;">→ ${p.placement}</span>
          </div>`).join('')}` : ''}
      </div>` : ''}
      <!-- Recruiter suggestions -->
      ${jd.recruiterSuggestions?.length ? `
      <div>
        <div style="font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:8px;">💡 Recruiter Suggestions</div>
        ${(jd.recruiterSuggestions || []).map(s => `
          <div style="padding:10px 12px;background:#fafbff;border-radius:6px;border-left:3px solid ${s.priority === 'HIGH' ? '#EF4444' : '#F59E0B'};margin-bottom:8px;">
            <span style="font-size:10px;font-weight:700;color:${s.priority === 'HIGH' ? '#EF4444' : '#F59E0B'};text-transform:uppercase;letter-spacing:.4px;">${s.priority} · ${s.category}</span>
            <div style="font-size:12px;color:#444;margin-top:4px;line-height:1.5;">${s.suggestion}</div>
          </div>`).join('')}
      </div>` : ''}
    </div>`

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Career Intelligence Report — ${name}</title>
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;background:#fff; }
  .page { padding:40px;max-width:820px;margin:0 auto; }
  .cover { background:linear-gradient(135deg,#6D5DF6,#38BDF8);padding:44px 40px;border-radius:12px;color:white;margin-bottom:28px; }
  .cover-title { font-size:26px;font-weight:800;margin-bottom:4px; }
  .cover-sub { font-size:15px;opacity:.85;margin-bottom:16px; }
  .section { margin-bottom:24px;page-break-inside:avoid; }
  .section-header { font-size:15px;font-weight:700;color:#6D5DF6;border-bottom:2px solid #6D5DF622;padding-bottom:7px;margin-bottom:12px; }
  .stat-row { display:flex;gap:12px;margin-bottom:14px; }
  .stat-box { flex:1;background:#f0efff;border-radius:8px;padding:12px;text-align:center; }
  .stat-val { font-size:22px;font-weight:800;color:#6D5DF6; }
  .stat-label { font-size:10px;color:#666;margin-top:2px;text-transform:uppercase;letter-spacing:.3px; }
  ul { padding-left:18px; }
  li { font-size:13px;color:#444;margin-bottom:5px;line-height:1.5; }
  .role-card { display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#f8f9ff;border-radius:8px;margin-bottom:8px;border:1px solid #e0e0f0; }
  .progress-bar { height:6px;background:#e0e0f0;border-radius:3px;flex:1;margin:0 12px;overflow:hidden; }
  .progress-fill { height:100%;background:linear-gradient(90deg,#6D5DF6,#38BDF8);border-radius:3px; }
  @media print { body { -webkit-print-color-adjust:exact; } .page { padding:20px; } }
</style>
</head>
<body>
<div class="page">

  <!-- COVER -->
  <div class="cover">
    <div style="font-size:11px;font-weight:700;letter-spacing:1px;opacity:.75;margin-bottom:8px;">AI CAREER INTELLIGENCE COPILOT ✦</div>
    <div class="cover-title">Career Intelligence Report</div>
    <div class="cover-sub">${name}</div>
    <div style="font-size:12px;opacity:.7;">Generated ${date} &nbsp;·&nbsp; Target Role: ${role}${jd ? ` &nbsp;·&nbsp; Shortlist Probability: ${jd.shortlistProbability}%` : ''}</div>
  </div>

  <!-- SUMMARY STATS -->
  <div class="section">
    <div class="section-header">📊 Analysis Summary</div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-val">${analysis.resumeScore || '--'}</div><div class="stat-label">Resume Score</div></div>
      <div class="stat-box"><div class="stat-val">${analysis.readinessScore || '--'}%</div><div class="stat-label">Role Readiness</div></div>
      <div class="stat-box"><div class="stat-val">${(analysis.extractedSkills || []).length}</div><div class="stat-label">Skills Detected</div></div>
      <div class="stat-box"><div class="stat-val">${(analysis.missingSkills || []).length}</div><div class="stat-label">Skills to Learn</div></div>
      ${jd ? `<div class="stat-box"><div class="stat-val" style="color:${jd.shortlistTierColor === 'success' ? '#22C55E' : jd.shortlistTierColor === 'danger' ? '#EF4444' : '#F59E0B'}">${jd.shortlistProbability}%</div><div class="stat-label">Shortlist Prob</div></div>` : ''}
      ${jd ? `<div class="stat-box"><div class="stat-val" style="color:#0288d1">${jd.semanticScore}%</div><div class="stat-label">Semantic Score</div></div>` : ''}
    </div>
  </div>

  <!-- RESUME ANALYSIS -->
  <div class="section">
    <div class="section-header">📄 Resume Analysis</div>
    <p style="font-size:13px;color:#555;margin-bottom:12px;"><strong>Score: ${analysis.resumeScore}/100</strong> — ${analysis.scoreLabel || ''} · ${analysis.scoreDesc || ''}</p>
    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <div style="font-weight:600;font-size:12px;color:#22C55E;margin-bottom:7px;text-transform:uppercase;letter-spacing:.3px;">✅ Strengths</div>
        <ul>${(analysis.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:12px;color:#F59E0B;margin-bottom:7px;text-transform:uppercase;letter-spacing:.3px;">⚠️ Suggestions</div>
        <ul>${(analysis.suggestions || []).map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
    </div>
  </div>

  <!-- SKILLS -->
  <div class="section">
    <div class="section-header">🔧 Skills</div>
    <div style="margin-bottom:10px;"><div style="font-size:11px;color:#666;margin-bottom:6px;font-weight:600;">YOUR SKILLS</div>${chip(analysis.extractedSkills, '#6D5DF6')}</div>
    ${(analysis.missingSkills || []).length > 0 ? `<div><div style="font-size:11px;color:#666;margin-bottom:6px;font-weight:600;">SKILLS TO LEARN</div>${chip(analysis.missingSkills, '#EF4444')}</div>` : ''}
  </div>

  <!-- CAREER MATCHES -->
  <div class="section">
    <div class="section-header">🎯 Career Matches</div>
    ${(analysis.careerMatches || []).map(m => `
      <div class="role-card">
        <div style="font-weight:600;font-size:14px;">${m.role}</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${m.score}%"></div></div>
        <div style="font-weight:800;color:#6D5DF6;font-size:15px;">${m.score}%</div>
        <div style="font-size:11px;color:#888;margin-left:8px;">${m.match}</div>
      </div>`).join('')}
  </div>

  <!-- JD INTELLIGENCE (new) -->
  ${jdSection}

  <!-- ROADMAP -->
  <div class="section">
    <div class="section-header">🗺️ 4-Week Learning Roadmap</div>
    ${roadmapHTML}
  </div>

  <!-- INTERVIEW PREP -->
  <div class="section">
    <div class="section-header">💬 Interview Preparation — ${role}</div>
    ${questionsHTML('technical',  'Technical Questions',          '#6D5DF6')}
    ${questionsHTML('conceptual', 'Conceptual Questions',         '#0288d1')}
    ${questionsHTML('hr',         'HR & Behavioral Questions',    '#22C55E')}
  </div>

  <div style="text-align:center;margin-top:28px;padding-top:18px;border-top:1px solid #e0e0f0;font-size:11px;color:#999;">
    Generated by AI Career Intelligence Copilot &nbsp;·&nbsp; ${date}
  </div>
</div>
</body>
</html>`
}

module.exports = { generateReportHTML }
