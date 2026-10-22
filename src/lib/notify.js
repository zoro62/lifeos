import { Platform } from 'react-native';

let N = null;
try {
  N = require('expo-notifications');
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, shouldShowBanner: true, shouldShowList: true,
      shouldPlaySound: true, shouldSetBadge: false,
    }),
  });
} catch (e) {
  N = null;
}

export const notificationsAvailable = () => !!N;

const CHANNEL = 'lifeos-alarms';
let ready = false;

export async function setupNotifications() {
  if (!N) return false;
  if (ready) return true;
  try {
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync(CHANNEL, {
        name: 'Alarms and reminders',
        importance: N.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500, 250, 500],
        sound: 'default',
        lockscreenVisibility: N.AndroidNotificationVisibility.PUBLIC,
      });
    }
    const cur = await N.getPermissionsAsync();
    let status = cur.status;
    if (status !== 'granted') status = (await N.requestPermissionsAsync()).status;
    ready = status === 'granted';
  } catch { ready = false; }
  return ready;
}

async function schedule(trigger, title, body) {
  if (!(await setupNotifications())) return null;
  try {
    return await N.scheduleNotificationAsync({
      content: { title, body, sound: 'default', priority: N.AndroidNotificationPriority.MAX },
      trigger: { ...trigger, channelId: CHANNEL },
    });
  } catch { return null; }
}

export const scheduleAt = (date, title, body) => {
  if (!N || date.getTime() <= Date.now()) return Promise.resolve(null);
  return schedule({ type: N.SchedulableTriggerInputTypes.DATE, date }, title, body);
};
export const scheduleDaily = (hour, minute, title, body) => {
  if (!N) return Promise.resolve(null);
  return schedule({ type: N.SchedulableTriggerInputTypes.DAILY, hour, minute }, title, body);
};
export const scheduleWeekly = (weekday, hour, minute, title, body) => {
  if (!N) return Promise.resolve(null);
  return schedule({ type: N.SchedulableTriggerInputTypes.WEEKLY, weekday, hour, minute }, title, body);
};

export async function cancelIds(ids = []) {
  if (!N) return;
  for (const id of ids) {
    if (id) { try { await N.cancelScheduledNotificationAsync(id); } catch {} }
  }
}
export async function cancelEverything() {
  if (!N) return;
  try { await N.cancelAllScheduledNotificationsAsync(); } catch {}
}

const pad = n => String(n).padStart(2, '0');
export const fmtTime = (h, m) => `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;

export function fmtIn(date) {
  const mins = Math.max(0, Math.round((date.getTime() - Date.now()) / 60000));
  const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function daysSummary(days = []) {
  if (days.length === 0) return 'Once';
  if (days.length === 7) return 'Every day';
  if (days.join() === '1,2,3,4,5') return 'Weekdays';
  if (days.join() === '0,6') return 'Weekends';
  return days.map(d => NAMES[d]).join(', ');
}

export function nextOccurrence(alarm) {
  if (!alarm.enabled) return null;
  const now = new Date();
  if (!alarm.days || alarm.days.length === 0) {
    if (!alarm.onceAt) return null;
    const d = new Date(alarm.onceAt);
    return d > now ? d : null;
  }
  for (let i = 0; i < 8; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(alarm.hour, alarm.minute, 0, 0);
    if (d > now && alarm.days.includes(d.getDay())) return d;
  }
  return null;
}

export async function scheduleAlarm(alarm) {
  const title = alarm.label || 'Alarm';
  const body = `${fmtTime(alarm.hour, alarm.minute)} · LifeOS`;
  if (!alarm.days || alarm.days.length === 0) {
    const d = new Date();
    d.setHours(alarm.hour, alarm.minute, 0, 0);
    if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
    const id = await scheduleAt(d, title, body);
    return { ids: id ? [id] : [], onceAt: d.toISOString(), ok: !!id };
  }
  const ids = [];
  for (const day of alarm.days) {
    const id = await scheduleWeekly(day + 1, alarm.hour, alarm.minute, title, body);
    if (id) ids.push(id);
  }
  return { ids, onceAt: '', ok: ids.length === alarm.days.length };
}