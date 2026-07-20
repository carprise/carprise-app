import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { C } from '@/src/constants/theme';
import { Button, Card, ScreenTitle } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Profile() {
  const { driver, notifications, setNotifications, saveProfile, signOut } = useApp();
  const [firstName, setFirstName] = useState(''); const [lastName, setLastName] = useState(''); const [phone, setPhone] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { setFirstName(driver?.firstName ?? ''); setLastName(driver?.lastName ?? ''); setPhone(driver?.phone ?? ''); }, [driver]);

  const save = async () => { setSaving(true); const error = await saveProfile({ firstName, lastName, phone }); setSaving(false); Alert.alert(error ? 'Could not save profile' : 'Profile saved', error ?? 'Your personal details have been updated.'); };
  const completeLogout = async () => { await signOut(); router.replace('/auth' as any); };
  const logout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Sign out? You will need your email and password to sign in again.')) void completeLogout();
      return;
    }
    Alert.alert('Sign out?', 'You will need your email and password to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: completeLogout },
    ]);
  };

  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <ScreenTitle eyebrow="PROFILE" title="Your driver account." />
    <Card style={styles.identity}><View style={styles.avatar}><Text style={styles.avatarText}>{driver?.name?.[0] ?? 'D'}</Text></View><Text style={styles.name}>{[driver?.firstName, driver?.lastName].filter(Boolean).join(' ') || 'Carprise Driver'}</Text><Text style={styles.email}>{driver?.email}</Text><View style={styles.rating}><Ionicons name="star" color={C.gold} size={14} /><Text style={styles.ratingText}>{driver?.rating.toFixed(1) ?? '5.0'} driver rating</Text></View></Card>
    <Card><Field label="First name" value={firstName} onChangeText={setFirstName} /><Field label="Last name" value={lastName} onChangeText={setLastName} /><Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /><Button label={saving ? 'Saving...' : 'Save personal details'} onPress={saving ? undefined : save} /></Card>
    <Card style={styles.toggle}><View><Text style={styles.itemTitle}>Campaign notifications</Text><Text style={styles.itemCopy}>Invitations, deadlines and payments</Text></View><Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: C.violet }} /></Card>
    <Card><View style={styles.itemLeft}><Ionicons name="shield-checkmark-outline" size={20} color={C.gold} /><View><Text style={styles.itemTitle}>Privacy and security</Text><Text style={styles.itemCopy}>Your account is protected by Supabase authentication and row-level security.</Text></View></View></Card>
    <Button label="Sign out" secondary onPress={logout} />
    <Text style={styles.version}>CARPRISE DRIVER · VERSION 1.0.0</Text>
  </ScrollView>;
}

function Field(props: any) { return <View style={styles.field}><Text style={styles.label}>{props.label}</Text><TextInput {...props} style={styles.input} placeholderTextColor="#666A72" /></View>; }
const styles = StyleSheet.create({ page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 13 }, identity: { alignItems: 'center', paddingVertical: 26 }, avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: C.violet + '33', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: C.text, fontSize: 27, fontWeight: '800' }, name: { color: C.text, fontSize: 20, fontWeight: '700', marginTop: 13 }, email: { color: C.muted, marginTop: 4 }, rating: { flexDirection: 'row', gap: 5, marginTop: 12 }, ratingText: { color: C.gold, fontSize: 12, fontWeight: '700' }, toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 }, itemTitle: { color: C.text, fontSize: 14, fontWeight: '700' }, itemCopy: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 4, maxWidth: 280 }, version: { color: '#555861', textAlign: 'center', fontSize: 9, letterSpacing: 1.4, marginTop: 14 }, field: { marginBottom: 14 }, label: { color: C.text, fontSize: 11, fontWeight: '700', marginBottom: 7 }, input: { color: C.text, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 13, fontSize: 14 } });
