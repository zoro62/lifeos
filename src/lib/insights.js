import { calcStreak, dayKey, daysUntil, lastNDays, money } from './data';

export const spendMonth = expenses => {
  const m = dayKey(0).slice(0, 7);
  return expenses.filter(e => e.type === 'expense' && e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0);
};
const week = () => lastNDays(7);
const doneDays = h => (h.log || []).filter(d => week().includes(d)).length;
const when = n => (n === 0 ? 'today' : n === 1 ? 'tomorrow' : n > 1 ? `in ${n} days` : `${-n} days ago`);
const order = { High: 0, Medium: 1, Low: 2 };

export function insights(d) {
  const out = [];
  const pending = d.tasks.filter(t => !t.done);
  const high = pending.filter(t => t.priority === 'High');
  if (high.length) out.push(`${high.length} high-priority task${high.length > 1 ? 's' : ''} pending. Start with "${high[0].title}".`);
  const todo = d.habits.filter(h => !(h.log || []).includes(dayKey(0)));
  if (todo.length) out.push(`${todo.length} habit${todo.length > 1 ? 's' : ''} left today. Easiest win: "${todo[0].title}".`);
  const weak = [...d.habits].sort((a, b) => doneDays(a) - doneDays(b))[0];
  if (weak && doneDays(weak) < 3) out.push(`"${weak.title}" is your weakest habit this week (${doneDays(weak)}/7 days).`);
  const next = d.events.filter(e => daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  if (next) out.push(`${next.title} is ${when(daysUntil(next.date))}.`);
  const budget = d.settings.budget || 0;
  if (budget) {
    const pct = Math.round((spendMonth(d.expenses) / budget) * 100);
    if (pct >= 80) out.push(`You have used ${pct}% of this month's budget.`);
  }
  const goal = d.settings.waterGoal || 8;
  if ((d.water[dayKey(0)] || 0) < goal / 2 && new Date().getHours() >= 14) out.push('Water intake is low for this time of day.');
  if (!out.length) out.push('You are on track today. Nice work.');
  return out;
}

export function answer(q, d) {
  const t = q.toLowerCase();
  const pending = d.tasks.filter(x => !x.done);
  const focusToday = d.focus.filter(f => f.date === dayKey(0)).reduce((s, f) => s + f.minutes, 0);
  if (/spen|expens|money|budget/.test(t)) {
    const m = dayKey(0).slice(0, 7);
    const list = d.expenses.filter(e => e.type === 'expense' && e.date.startsWith(m));
    if (!list.length) return 'No expenses logged this month yet.';
    const by = {};
    list.forEach(e => { by[e.category] = (by[e.category] || 0) + e.amount; });
    const top = Object.entries(by).sort((a, b) => b[1] - a[1])[0];
    return `You spent ${money(spendMonth(d.expenses))} this month. Biggest category: ${top[0]} (${money(top[1])}).`;
  }
  if (/habit|neglect|streak/.test(t)) {
    if (!d.habits.length) return 'You have no habits yet. Add one in the Habits tab.';
    const weak = [...d.habits].sort((a, b) => doneDays(a) - doneDays(b))[0];
    const best = [...d.habits].sort((a, b) => calcStreak(b.log || []) - calcStreak(a.log || []))[0];
    return `Weakest this week: "${weak.title}" (${doneDays(weak)}/7 days). Longest streak: "${best.title}" (${calcStreak(best.log || [])} days).`;
  }
  if (/gym|workout|exercise/.test(t)) {
    const last = d.workouts.map(w => w.date).sort().pop();
    return last ? `Your last workout was ${when(daysUntil(last))}.` : 'No workouts logged yet.';
  }
  if (/goal/.test(t)) {
    const open = d.goals.filter(g => g.current < g.target).sort((a, b) => a.current / a.target - b.current / b.target);
    if (!open.length) return 'No open goals. Add one or celebrate finishing them all.';
    const g = open[0];
    return `"${g.title}" is furthest behind at ${Math.round((g.current / g.target) * 100)}%.`;
  }
  if (/plan|tomorrow/.test(t)) {
    const top = [...pending].sort((a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1)).slice(0, 3);
    const ev = d.events.filter(e => daysUntil(e.date) === 1).map(e => e.title);
    const lines = top.map((x, i) => `${i + 1}. ${x.title}`);
    if (ev.length) lines.push(`Event tomorrow: ${ev.join(', ')}`);
    return lines.length ? `Suggested plan:\n${lines.join('\n')}` : 'Nothing pending. Enjoy a light day.';
  }
  if (/sleep/.test(t)) {
    const vals = week().map(k => d.sleep[k]).filter(Boolean);
    return vals.length ? `You average ${(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)} hours of sleep over logged days this week.` : 'No sleep logged yet.';
  }
  if (/task|todo/.test(t)) return pending.length ? `${pending.length} pending. Top one: "${pending[0].title}".` : 'No pending tasks.';
  if (/summar|today|day|product/.test(t)) {
    const hDone = d.habits.filter(h => (h.log || []).includes(dayKey(0))).length;
    return `Today: ${d.tasks.length - pending.length} of ${d.tasks.length} tasks done, ${hDone} of ${d.habits.length} habits, ${focusToday} focus minutes, ${d.water[dayKey(0)] || 0} glasses of water.`;
  }
  return 'Try asking about your spending, habits, goals, workouts, sleep, tasks, tomorrow\'s plan, or a summary of your day.';
}