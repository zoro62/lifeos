import { useState } from 'react';
import { Alert, ScrollView, Share, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Header, Input, Screen, SectionTitle } from '../components/ui';
import { exportAll, importAll, resetAll, useStoredObject } from '../lib/data';
import { colors, spacing } from '../theme/colors';

export default function Settings() {
  const [settings, setSettings] = useStoredObject('lifeos_settings');
  const [raw, setRaw] = useState('');

  const backup = async () => { try { await Share.share({ title: 'LifeOS backup', message: await exportAll() }); } catch {} };
  const restore = async () => {
    try {
      const n = await importAll(raw);
      setRaw('');
      Alert.alert('Restored', `${n} data sets restored. Switch tabs to refresh.`);
    } catch { Alert.alert('Invalid backup', 'Paste the full JSON you exported.'); }
  };
  const wipe = () => Alert.alert('Delete all data?', 'This removes everything stored in LifeOS on this phone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => { await resetAll(); Alert.alert('Done', 'All data deleted.'); } },
  ]);

  return (
    <Screen>
      <Header title="Settings" subtitle="Profile, goals and data" back />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <SectionTitle>Profile</SectionTitle>
        <Card>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>Your name (used in greetings)</Text>
          <Input value={settings.name || ''} onChangeText={v => setSettings(s => ({ ...s, name: v }))} placeholder="Name" />
          <Text style={{ color: colors.textMuted, fontSize: 12, marginVertical: 4 }}>Daily water goal (glasses)</Text>
          <Input keyboardType="numeric" value={settings.waterGoal ? String(settings.waterGoal) : ''} onChangeText={v => setSettings(s => ({ ...s, waterGoal: parseInt(v) || 0 }))} placeholder="8" />
          <Text style={{ color: colors.textMuted, fontSize: 12, marginVertical: 4 }}>Monthly budget (₹)</Text>
          <Input keyboardType="numeric" value={settings.budget ? String(settings.budget) : ''} onChangeText={v => setSettings(s => ({ ...s, budget: parseInt(v) || 0 }))} placeholder="10000" />
        </Card>

        <SectionTitle>Backup and restore</SectionTitle>
        <Card>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm }}>Export shares all your data as text. Save it in Notes, email or WhatsApp. The password vault is not included.</Text>
          <Button label="Export backup" onPress={backup} />
          <Input placeholder="Paste backup JSON here to restore" value={raw} onChangeText={setRaw} multiline style={{ marginTop: spacing.md, minHeight: 70, textAlignVertical: 'top' }} />
          <Button label="Restore" onPress={restore} style={{ marginTop: spacing.sm, backgroundColor: colors.textMuted }} />
        </Card>

        <SectionTitle>Danger zone</SectionTitle>
        <Button label="Delete all data" onPress={wipe} style={{ backgroundColor: colors.danger }} />
        <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing.lg }}>LifeOS v0.2 · data stays on this phone</Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}