import { useState } from 'react';
import { Alert, ScrollView, Share, Switch, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Chip, Header, Input, Screen, SectionTitle } from '../components/ui';
import { exportAll, importAll, resetAll, useStoredObject } from '../lib/data';
import { cancelEverything, cancelIds, notificationsAvailable, scheduleDaily } from '../lib/notify';
import { colors, spacing } from '../theme/colors';

const HYDRATION = [9, 11, 13, 15, 17, 19, 21];

export default function Settings() {
  const [settings, setSettings] = useStoredObject('lifeos_settings');
  const [raw, setRaw] = useState('');
  const [msg, setMsg] = useState('');

  const denied = notificationsAvailable()
    ? 'Could not schedule. Allow notifications for Expo Go in your phone settings.'
    : 'Alarms need a newer Expo Go. Update Expo Go from the Play Store, then reopen the app.';

  const setCheckin = async hour => {
    await cancelIds(settings.checkinId ? [settings.checkinId] : []);
    if (!hour) {
      setSettings(s => ({ ...s, checkin: 0, checkinId: null }));
      setMsg('');
      return;
    }

    const id = await scheduleDaily(
      hour,
      0,
      'Evening check-in',
      'How was your day? Tick your habits and write a journal entry.'
    );

    setSettings(s => ({
      ...s,
      checkin: id ? hour : 0,
      checkinId: id
    }));

    setMsg(id ? '' : denied);
  };

  const setHydration = async on => {
    await cancelIds(settings.hydrationIds || []);

    if (!on) {
      setSettings(s => ({ ...s, hydrationIds: [] }));
      return;
    }

    const ids = [];

    for (const h of HYDRATION) {
      const id = await scheduleDaily(
        h,
        0,
        'Hydration reminder',
        'Time for a glass of water.'
      );

      if (id) ids.push(id);
    }

    setSettings(s => ({ ...s, hydrationIds: ids }));
    setMsg(ids.length ? '' : denied);
  };

  const backup = async () => {
    try {
      await Share.share({
        title: 'LifeOS backup',
        message: await exportAll()
      });
    } catch {}
  };

  const restore = async () => {
    try {
      const n = await importAll(raw);
      setRaw('');
      Alert.alert(
        'Restored',
        `${n} data sets restored. Switch tabs to refresh.`
      );
    } catch {
      Alert.alert(
        'Invalid backup',
        'Paste the full JSON you exported.'
      );
    }
  };

  const wipe = () =>
    Alert.alert(
      'Delete all data?',
      'This removes everything stored in LifeOS on this phone, including all alarms and reminders.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await cancelEverything();
            await resetAll();
            Alert.alert('Done', 'All data deleted.');
          }
        }
      ]
    );

  const label = {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
    marginBottom: 4
  };

  return (
    <Screen>
      <Header title="Settings" subtitle="Profile, reminders and data" back />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionTitle>Profile</SectionTitle>

        <Card>
          <Text style={[label, { marginTop: 0 }]}>Your name</Text>

          <Input
            value={settings.name || ''}
            onChangeText={v =>
              setSettings(s => ({ ...s, name: v }))
            }
            placeholder="Name"
          />

          <Text style={label}>Daily water goal (glasses)</Text>

          <Input
            keyboardType="numeric"
            value={settings.waterGoal ? String(settings.waterGoal) : ''}
            onChangeText={v =>
              setSettings(s => ({
                ...s,
                waterGoal: parseInt(v) || 0
              }))
            }
            placeholder="8"
          />

          <Text style={label}>Monthly budget (₹)</Text>

          <Input
            keyboardType="numeric"
            value={settings.budget ? String(settings.budget) : ''}
            onChangeText={v =>
              setSettings(s => ({
                ...s,
                budget: parseInt(v) || 0
              }))
            }
            placeholder="10000"
          />
        </Card>

        <SectionTitle>Reminders</SectionTitle>

        <Card>
          <Text style={{ fontWeight: '700', color: colors.text }}>
            Evening check-in
          </Text>

          <Text
            style={{
              color: colors.textMuted,
              fontSize: 12,
              marginBottom: spacing.sm
            }}
          >
            A daily nudge to log your day
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {[
              [0, 'Off'],
              [20, '8 PM'],
              [21, '9 PM'],
              [22, '10 PM']
            ].map(([h, l]) => (
              <Chip
                key={l}
                label={l}
                active={(settings.checkin || 0) === h}
                onPress={() => setCheckin(h)}
              />
            ))}
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: spacing.md
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: '700',
                  color: colors.text
                }}
              >
                Hydration reminders
              </Text>

              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 12
                }}
              >
                Every 2 hours, 9 AM to 9 PM
              </Text>
            </View>

            <Switch
              value={(settings.hydrationIds || []).length > 0}
              onValueChange={setHydration}
              trackColor={{
                false: colors.border,
                true: colors.accent
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          {!!msg && (
            <Text
              style={{
                color: colors.accent,
                fontSize: 12,
                marginTop: spacing.sm
              }}
            >
              {msg}
            </Text>
          )}
        </Card>

        <SectionTitle>Backup and restore</SectionTitle>

        <Card>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 13,
              marginBottom: spacing.sm
            }}
          >
            Export shares all your data as text. Save it in Notes, email or
            WhatsApp. The password vault is not included.
          </Text>

          <Button label="Export backup" onPress={backup} />

          <Input
            placeholder="Paste backup JSON here to restore"
            value={raw}
            onChangeText={setRaw}
            multiline
            style={{
              marginTop: spacing.md,
              minHeight: 70,
              textAlignVertical: 'top'
            }}
          />

          <Button
            label="Restore"
            onPress={restore}
            style={{
              marginTop: spacing.sm,
              backgroundColor: colors.textMuted
            }}
          />
        </Card>

        <SectionTitle>Danger zone</SectionTitle>

        <Button
          label="Delete all data"
          onPress={wipe}
          style={{ backgroundColor: colors.danger }}
        />

        <Text
          style={{
            color: colors.textMuted,
            fontSize: 12,
            textAlign: 'center',
            marginTop: spacing.lg
          }}
        >
          LifeOS v0.3 · data stays on this phone
        </Text>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}