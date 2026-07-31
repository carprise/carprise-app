import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { C } from '@/src/constants/theme';
import { Button, Card, Pill, ScreenTitle } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

type DocStatus = 'missing' | 'uploaded' | 'approved';

export default function Profile() {
  const { driver, notifications, setNotifications, saveProfile, signOut } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [payoutSaved, setPayoutSaved] = useState(false);
  const [docs, setDocs] = useState<Record<string, DocStatus>>({
    licence: 'missing',
    insurance: 'missing',
    phv: 'missing',
  });

  useEffect(() => {
    setFirstName(driver?.firstName ?? '');
    setLastName(driver?.lastName ?? '');
    setPhone(driver?.phone ?? '');
  }, [driver]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('carprise_driver_docs');
        if (raw) setDocs(JSON.parse(raw));
        const pay = await AsyncStorage.getItem('carprise_driver_payout');
        if (pay) {
          const parsed = JSON.parse(pay);
          setSortCode(parsed.sortCode ?? '');
          setAccountNumber(parsed.accountNumber ? `••••${String(parsed.accountNumber).slice(-4)}` : '');
          setPayoutSaved(true);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const error = await saveProfile({ firstName, lastName, phone });
    setSaving(false);
    Alert.alert(error ? 'Could not save profile' : 'Profile saved', error ?? 'Your personal details have been updated.');
  };

  const savePayout = async () => {
    if (sortCode.replace(/-/g, '').length < 6 || accountNumber.replace(/•/g, '').length < 4) {
      Alert.alert('Check bank details', 'Enter a valid UK sort code and account number.');
      return;
    }
    const last4 = accountNumber.replace(/\D/g, '').slice(-4) || accountNumber.slice(-4);
    await AsyncStorage.setItem(
      'carprise_driver_payout',
      JSON.stringify({ sortCode: sortCode.trim(), accountNumber: last4 })
    );
    setAccountNumber(`••••${last4}`);
    setPayoutSaved(true);
    Alert.alert('Payout details saved', 'Details stay on-device for this pilot build. Production stores them via secure payout provider.');
  };

  const uploadDoc = async (key: string) => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.canceled) return;
    const next = { ...docs, [key]: 'uploaded' as DocStatus };
    setDocs(next);
    await AsyncStorage.setItem('carprise_driver_docs', JSON.stringify(next));
    Alert.alert('Document uploaded', 'Carprise ops will review this document for pilot onboarding.');
  };

  const completeLogout = async () => {
    await signOut();
    router.replace('/auth' as any);
  };

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

  const docMeta: { key: string; label: string; copy: string }[] = [
    { key: 'licence', label: 'Driving licence', copy: 'Photo or PDF of your valid UK licence' },
    { key: 'insurance', label: 'Hire & reward insurance', copy: 'Proof of appropriate cover' },
    { key: 'phv', label: 'PHV / private hire licence', copy: 'If required in your city' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <ScreenTitle eyebrow="PROFILE" title="Your driver account." />
      <Card style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{driver?.name?.[0] ?? 'D'}</Text>
        </View>
        <Text style={styles.name}>
          {[driver?.firstName, driver?.lastName].filter(Boolean).join(' ') || 'Carprise Driver'}
        </Text>
        <Text style={styles.email}>{driver?.email}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" color={C.gold} size={14} />
          <Text style={styles.ratingText}>{driver?.rating.toFixed(1) ?? '5.0'} driver rating</Text>
        </View>
      </Card>

      <Card>
        <Field label="First name" value={firstName} onChangeText={setFirstName} />
        <Field label="Last name" value={lastName} onChangeText={setLastName} />
        <Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Button label={saving ? 'Saving...' : 'Save personal details'} onPress={saving ? undefined : save} />
      </Card>

      <Text style={styles.section}>PAYOUT DETAILS</Text>
      <Card>
        <Text style={styles.itemTitle}>Bank transfer</Text>
        <Text style={styles.itemCopy}>
          Campaign payments and revenue share after evidence approval. {payoutSaved ? 'Details on file.' : 'Add details to receive pilot payouts.'}
        </Text>
        <Field label="Sort code" value={sortCode} onChangeText={setSortCode} placeholder="00-00-00" keyboardType="numbers-and-punctuation" />
        <Field
          label="Account number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="12345678"
          keyboardType="number-pad"
        />
        <Button label="Save payout details" secondary onPress={savePayout} />
      </Card>

      <Text style={styles.section}>DOCUMENTS</Text>
      {docMeta.map((doc) => (
        <Card key={doc.key} style={styles.docRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.docTop}>
              <Text style={styles.itemTitle}>{doc.label}</Text>
              <Pill tone={docs[doc.key] === 'uploaded' || docs[doc.key] === 'approved' ? 'green' : 'gold'}>
                {(docs[doc.key] ?? 'missing').toUpperCase()}
              </Pill>
            </View>
            <Text style={styles.itemCopy}>{doc.copy}</Text>
          </View>
          <Button label="Upload" secondary onPress={() => uploadDoc(doc.key)} />
        </Card>
      ))}

      <Card style={styles.toggle}>
        <View>
          <Text style={styles.itemTitle}>Campaign notifications</Text>
          <Text style={styles.itemCopy}>Invitations, deadlines and payments</Text>
        </View>
        <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: C.violet }} />
      </Card>

      <Card>
        <View style={styles.itemLeft}>
          <Ionicons name="shield-checkmark-outline" size={20} color={C.gold} />
          <View>
            <Text style={styles.itemTitle}>Privacy and security</Text>
            <Text style={styles.itemCopy}>
              Consent-led design, data minimisation and row-level security. You control journey commerce participation.
            </Text>
          </View>
        </View>
      </Card>

      <Button label="Replay onboarding" secondary onPress={async () => {
        await AsyncStorage.removeItem('carprise_onboarding_complete');
        router.replace('/onboarding' as any);
      }} />
      <Button label="Sign out" secondary onPress={logout} />
      <Text style={styles.version}>CARPRISE DRIVER · VERSION 1.1.0 · FULL PLATFORM</Text>
    </ScrollView>
  );
}

function Field(props: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput {...props} style={styles.input} placeholderTextColor="#666A72" />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 13 },
  identity: { alignItems: 'center', paddingVertical: 26 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: C.violet + '33', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.text, fontSize: 27, fontWeight: '800' },
  name: { color: C.text, fontSize: 20, fontWeight: '700', marginTop: 13 },
  email: { color: C.muted, marginTop: 4 },
  rating: { flexDirection: 'row', gap: 5, marginTop: 12 },
  ratingText: { color: C.gold, fontSize: 12, fontWeight: '700' },
  section: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 10 },
  toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemTitle: { color: C.text, fontSize: 14, fontWeight: '700' },
  itemCopy: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 4, maxWidth: 280 },
  docRow: { gap: 12 },
  docTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  version: { color: '#555861', textAlign: 'center', fontSize: 9, letterSpacing: 1.4, marginTop: 14 },
  field: { marginBottom: 14 },
  label: { color: C.text, fontSize: 11, fontWeight: '700', marginBottom: 7 },
  input: { color: C.text, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 13, fontSize: 14 },
});
