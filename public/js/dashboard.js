// dashboard.js — profile dashboard + progress analytics

const CHART_COLORS = {
  accent: '#00e5ff',
  accent2: '#7c3aed',
  accent3: '#f59e0b',
  correct: '#10b981',
  wrong: '#ef4444',
  gridLine: 'rgba(255,255,255,0.06)',
  textMuted: '#6b7a96',
};

function isLightMode() {
  return document.body.classList.contains('light');
}

function chartTextColor() {
  return isLightMode() ? '#0d1526' : '#e2eaf6';
}
function chartGridColor() {
  return isLightMode() ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
}

Chart.defaults.font.family = "'Space Grotesk', sans-serif";

let charts = {};

function destroyCharts() {
  Object.values(charts).forEach((c) => c && c.destroy());
  charts = {};
}

function fmtDuration(totalSeconds) {
  const s = Math.round(totalSeconds || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function fmtDay(isoDay) {
  const d = new Date(isoDay + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

async function loadDashboard() {
  const [statsRes, historyRes] = await Promise.all([
    API.get('/api/quiz/stats'),
    API.get('/api/quiz/history?limit=8'),
  ]);

  renderOverview(statsRes.overview);

  const hasData = statsRes.overview.totalQuizzes > 0;
  document.getElementById('dashEmpty').style.display = hasData ? 'none' : 'block';
  document.getElementById('dashCharts').style.display = hasData ? '' : 'none';

  if (hasData) {
    renderScoreTrend(statsRes.scoreTrend);
    renderSubjectBreakdown(statsRes.subjectBreakdown);
    renderModeBreakdown(statsRes.modeBreakdown);
    renderActivity(statsRes.activity);
    renderHistory(historyRes.history);
  }
}

function renderOverview(o) {
  const grid = document.getElementById('dashStatsGrid');
  const cards = [
    ['🎯', o.totalQuizzes, 'Quizzes Taken', CHART_COLORS.accent],
    ['🏅', o.bestAccuracy + '%', 'Best Accuracy', CHART_COLORS.accent3],
    ['📈', o.avgAccuracy + '%', 'Avg Accuracy', CHART_COLORS.correct],
    ['⚡', o.totalXP, 'Total XP', CHART_COLORS.accent2],
    ['🔥', o.currentDayStreak, 'Day Streak', CHART_COLORS.wrong],
    ['⏱️', fmtDuration(o.totalTimeSeconds), 'Time Practiced', CHART_COLORS.accent],
  ];
  grid.innerHTML = cards.map(([emoji, num, label, color], i) => `
    <div class="dash-stat-card" style="--stat-color:${color}; animation-delay:${i * 0.05}s;">
      <div class="dash-stat-icon">${emoji}</div>
      <div class="dash-stat-num">${num}</div>
      <div class="dash-stat-label">${label}</div>
    </div>
  `).join('');
}

function renderScoreTrend(trend) {
  const ctx = document.getElementById('scoreTrendChart');
  const labels = trend.map((t, i) => `#${i + 1}`);
  const data = trend.map((t) => Math.round(t.accuracy));

  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Accuracy %',
        data,
        borderColor: CHART_COLORS.accent,
        backgroundColor: 'rgba(0,229,255,0.12)',
        pointBackgroundColor: CHART_COLORS.accent,
        pointRadius: 3,
        tension: 0.35,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => trend[items[0].dataIndex]?.subject || '',
            label: (item) => `${item.parsed.y}% accuracy`,
          },
        },
      },
      scales: {
        y: { min: 0, max: 100, ticks: { color: chartTextColor(), callback: (v) => v + '%' }, grid: { color: chartGridColor() } },
        x: { ticks: { color: chartTextColor() }, grid: { display: false } },
      },
    },
  });
}

function renderSubjectBreakdown(subjects) {
  const ctx = document.getElementById('subjectChart');
  const palette = ['#00e5ff', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#61dafb', '#f472b6', '#a3e635'];

  charts.subjects = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: subjects.map((s) => s.subject),
      datasets: [{
        label: 'Avg accuracy %',
        data: subjects.map((s) => Math.round(s.avgAccuracy)),
        backgroundColor: subjects.map((_, i) => palette[i % palette.length]),
        borderRadius: 8,
        maxBarThickness: 34,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const s = subjects[item.dataIndex];
              return `${Math.round(s.avgAccuracy)}% avg over ${s.attempts} attempt${s.attempts === 1 ? '' : 's'}`;
            },
          },
        },
      },
      scales: {
        x: { min: 0, max: 100, ticks: { color: chartTextColor(), callback: (v) => v + '%' }, grid: { color: chartGridColor() } },
        y: { ticks: { color: chartTextColor() }, grid: { display: false } },
      },
    },
  });
}

function renderModeBreakdown(modes) {
  const ctx = document.getElementById('modeChart');
  const labelMap = { standard: 'Standard', blitz: 'Blitz', zen: 'Zen' };
  const colorMap = { standard: CHART_COLORS.accent, blitz: CHART_COLORS.accent3, zen: CHART_COLORS.accent2 };

  charts.modes = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: modes.map((m) => labelMap[m.mode] || m.mode),
      datasets: [{
        data: modes.map((m) => m.attempts),
        backgroundColor: modes.map((m) => colorMap[m.mode] || CHART_COLORS.textMuted),
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: chartTextColor(), padding: 14, font: { size: 11 } } },
      },
      cutout: '68%',
    },
  });
}

function renderActivity(activity) {
  const ctx = document.getElementById('activityChart');
  const labels = activity.map((a) => fmtDay(a.day));

  charts.activity = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Quizzes',
        data: activity.map((a) => a.quizzes),
        backgroundColor: CHART_COLORS.accent2,
        borderRadius: 6,
        maxBarThickness: 22,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { color: chartTextColor(), precision: 0 }, grid: { color: chartGridColor() } },
        x: { ticks: { color: chartTextColor() }, grid: { display: false } },
      },
    },
  });
}

function renderHistory(history) {
  const list = document.getElementById('dashHistoryList');
  if (!history.length) {
    list.innerHTML = '<p class="lb-empty">No attempts yet.</p>';
    return;
  }
  list.innerHTML = history.map((h) => {
    const date = new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const acc = Math.round(h.accuracy);
    const scoreColor = acc >= 80 ? CHART_COLORS.correct : acc >= 50 ? CHART_COLORS.accent3 : CHART_COLORS.wrong;
    const scoreBg = acc >= 80 ? 'rgba(16,185,129,0.14)' : acc >= 50 ? 'rgba(245,158,11,0.14)' : 'rgba(239,68,68,0.14)';
    return `
      <div class="dash-history-row">
        <div>
          <div class="dash-history-subject">${h.subject}</div>
          <div class="dash-history-meta">${date} · ${h.mode}</div>
        </div>
        <div class="dash-history-score" style="--score-color:${scoreColor}; --score-bg:${scoreBg};">${h.score}/${h.total} · ${acc}%</div>
      </div>
    `;
  }).join('');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireAuthOrRedirect();
  if (!user) return;
  paintUserHeader(user);
  loadTheme();
  document.getElementById('themeBtn').addEventListener('click', () => {
    toggleTheme();
    destroyCharts();
    loadDashboard();
  });

  try {
    await loadDashboard();
  } catch (e) {
    console.error(e);
    document.getElementById('dashEmpty').style.display = 'block';
    document.getElementById('dashEmpty').querySelector('.dash-empty-text').textContent =
      'Could not load your analytics right now. Try refreshing.';
  }
});

function loadTheme() {
  if (localStorage.getItem('qf_theme') === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeIcon').textContent = '☀️';
  }
}
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  document.getElementById('themeIcon').textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('qf_theme', isLight ? 'light' : 'dark');
}
