import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from '../components/Card';
import { Button, Header, IconButton, Input, Screen } from '../components/ui';
import { colors, spacing } from '../theme/colors';

const KEY = 'lifeos_vault';
const CHARS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
const generate = (len = 14) => Array.from(Crypto.getRandomBytes(len), b => CHARS[b % CHARS.length]).join('');
const strength = p => {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return ['Very weak', 'Weak', 'Okay', 'Good', 'Strong', 'Strong'][s];
};

export default function Vault() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [site, setSite] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [shown, setShown] = useState({});

  useFocusEffect(useCallback(() => () => { setOpen(false); setItems([]); setShown({}); }, []));

  const unlock = async () => {
    const hw = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hw || !enrolled) { setMsg('Set up a fingerprint, face or screen lock on your phone first.'); return; }
    const r = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock LifeOS Vault' });
    if (!r.success) { setMsg('Authentication failed. Try again.'); return; }
    const s = await SecureStore.getItemAsync(KEY);
    setItems(s ? JSON.parse(s) : []);
    setMsg('');
    setOpen(true);
  };
  const persist = next => { setItems(next); SecureStore.setItemAsync(KEY, JSON.stringify(next)); };
  const add = () => {
    if (!site.trim() || !pass) return;
    persist([{ id: Date.now().toString(), site: site.trim(), user: user.trim(), pass }, ...items]);
    setSite(''); setUser(''); setPass('');
  };

  return (
    <Screen>
      <Header title="Vault" subtitle={open ? 'Unlocked. Locks when you leave.' : 'Protected by your fingerprint or screen lock'} back />
      {!open ? (
        <View style={{ alignItems: 'center', marginTop: spacing.xl * 2 }}>
          <Ionicons name="lock-closed-outline" size={64} color={colors.border} />
          <Button label="Unlock vault" onPress={unlock} style={{ marginTop: spacing.lg, paddingHorizontal: spacing.xl }} />
          {!!msg && <Text style={{ color: colors.danger, marginTop: spacing.md, textAlign: 'center' }}>{msg}</Text>}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input placeholder="Site or app" value={site} onChangeText={setSite} />
          <Input placeholder="Username / email" value={user} onChangeText={setUser} autoCapitalize="none" style={{ marginTop: spacing.sm }} />
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
            <Input style={{ flex: 1 }} placeholder="Password" value={pass} onChangeText={setPass} autoCapitalize="none" />
            <Button label="Generate" onPress={() => setPass(generate())} style={{ backgroundColor: colors.textMuted }} />
          </View>
          {!!pass && <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Strength: {strength(pass)}</Text>}
          <Button label="Save" onPress={add} style={{ marginTop: spacing.sm }} />
          <View style={{ marginTop: spacing.md }}>
            {items.map(i => (
              <Card key={i.id}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{i.site}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>{i.user}</Text>
                <Text style={{ color: colors.text, fontSize: 15, marginTop: 4 }}>{shown[i.id] ? i.pass : '••••••••••'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ flex: 1, fontSize: 12, color: colors.textMuted }}>{strength(i.pass)}</Text>
                  <IconButton name={shown[i.id] ? 'eye-off-outline' : 'eye-outline'} onPress={() => setShown(s => ({ ...s, [i.id]: !s[i.id] }))} />
                  <IconButton name="copy-outline" onPress={() => Clipboard.setStringAsync(i.pass)} />
                  <IconButton name="trash-outline" onPress={() => persist(items.filter(x => x.id !== i.id))} />
                </View>
              </Card>
            ))}
          </View>
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      )}
    </Screen>
  );
}