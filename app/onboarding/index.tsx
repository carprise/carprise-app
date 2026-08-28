import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R } from '@/src/constants/theme';
import { Button, Card } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

const TOTAL = 3;

export default function Onboarding() {
  const { driver, vehicle, saveProfile, saveVehicle } = useApp();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [colour, setColour] = useState('');
  const [registration, setRegistration] = useState('');

  useEffect(() => {
    setFirstName(driver?.firstName ?? '');
    setLastName(driver?.lastName ?? '');
    setPhone(driver?.phone ?? '');
  }, [driver]);

  useEffect(() => {
    setMake(vehicle?.make ?? '');
    setModel(vehicle?.model ?? '');
    setYear(vehicle?.year ?? '');
    setColour(vehicle?.colour ?? '');
    setRegistration(vehicle?.registration ?? '');
  }, [vehicle]);

  const finish = async () => {
    await AsyncStorage.setItem('carprise_onboarding_complete', '1');
    router.replace('/(tabs)');
  };

  const saveProfileStep = async () => {
    if (!firstName.trim()) {
      Alert.alert('First name needed', 'Please enter your first name to continue.');
      return;
    }
    setSaving(true);
    const error = await saveProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    });
    setSaving(false);
    if (error) {
      Alert.alert('Could not save profile', error);
      return;
    }
    setStep(2);
  };

  const saveVehicleStep = async () => {
    if (!make.trim() || !model.trim() || !year.trim() || !registration.trim()) {
      Alert.alert(
        'Vehicle details needed',
        'Please add make, model, year and registration.',
      );
      return;
    }
    setSaving(true);
    const error = await saveVehicle({
      id: vehicle?.id,
      make: make.trim(),
      model: model.trim(),
      year: year.trim(),
      colour: colour.trim(),
      registration: registration.trim(),
      verificationStatus: vehicle?.verificationStatus ?? 'pending',
    });
    setSaving(false);
    if (error) {
      Alert.alert('Could not save vehicle', error);
      return;
    }
    await finish();
  };

  const next = async () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      await saveProfileStep();
      return;
    }
    await saveVehicleStep();
  };

  return (
    <LinearGradient colors={[C.bg, C.bgSoft, C.bg]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.page}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.eyebrow}>Driver setup</Text>
          <Text style={styles.title}>
            {step === 0 && 'Welcome to Carprise.'}
            {step === 1 && 'Your details.'}
            {step === 2 && 'Your vehicle.'}
          </Text>
          <Text style={styles.copy}>
            {step === 0 &&
              'A short setup so we can match you to campaigns and pay you correctly.'}
            {step === 1 && 'We use this for your driver account and campaign contact.'}
            {step === 2 &&
              'Campaigns are matched to your vehicle. You can add photos later.'}
          </Text>

          <View style={styles.dots}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
          <Text style={styles.stepMeta}>
            Step {step + 1} of {TOTAL}
          </Text>

          {step === 0 && (
            <Card style={styles.hero}>
              <Text style={styles.cardTitle}>What you will do</Text>
              <Text style={styles.bullet}>1. Confirm your name and phone</Text>
              <Text style={styles.bullet}>2. Add your vehicle details</Text>
              <Text style={styles.bullet}>3. Open your driver dashboard</Text>
              <Text style={styles.stepCopy}>
                You keep your fares. Carprise adds campaign income on top.
              </Text>
            </Card>
          )}

          {step === 1 && (
            <Card style={styles.formCard}>
              <Field label="First name" value={firstName} onChangeText={setFirstName} placeholder="Tasha" autoCapitalize="words" />
              <Field label="Last name" value={lastName} onChangeText={setLastName} placeholder="Card" autoCapitalize="words" />
              <Field
                label="Phone number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+44 7..."
                keyboardType="phone-pad"
              />
            </Card>
          )}

          {step === 2 && (
            <Card style={styles.formCard}>
              <View style={styles.row}>
                <View style={styles.half}>
                  <Field label="Make" value={make} onChangeText={setMake} placeholder="Mercedes-Benz" autoCapitalize="words" />
                </View>
                <View style={styles.half}>
                  <Field label="Model" value={model} onChangeText={setModel} placeholder="E-Class" autoCapitalize="words" />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.half}>
                  <Field label="Year" value={year} onChangeText={setYear} placeholder="2022" keyboardType="number-pad" />
                </View>
                <View style={styles.half}>
                  <Field label="Colour" value={colour} onChangeText={setColour} placeholder="Black" autoCapitalize="words" />
                </View>
              </View>
              <Field
                label="Registration"
                value={registration}
                onChangeText={setRegistration}
                placeholder="AB12 CDE"
                autoCapitalize="characters"
              />
            </Card>
          )}

          <Button
            label={
              saving
                ? 'Saving...'
                : step === 0
                  ? 'Start setup'
                  : step === 1
                    ? 'Save and continue'
                    : 'Save vehicle and finish'
            }
            onPress={saving ? undefined : next}
          />

          {step > 0 && (
            <Pressable onPress={() => setStep(step - 1)} style={styles.skip} disabled={saving}>
              <Text style={styles.skipText}>Back</Text>
            </Pressable>
          )}

          <Pressable onPress={finish} style={styles.skip} disabled={saving}>
            <Text style={styles.skipMuted}>Skip for now</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Field({
  label,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'number-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor={C.placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { padding: 24, paddingTop: 64, paddingBottom: 48, gap: 14 },
  eyebrow: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    color: C.paper,
    fontSize: 34,
    fontWeight: '500',
    lineHeight: 38,
    letterSpacing: -1.1,
  },
  copy: { color: C.muted, fontSize: 15, lineHeight: 23 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 4 },
  dot: { width: 8, height: 2, backgroundColor: C.lineStrong },
  dotActive: { width: 28, backgroundColor: C.paper },
  stepMeta: {
    color: C.violet,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  hero: { padding: 22, gap: 8 },
  formCard: { padding: 18, gap: 4 },
  cardTitle: {
    color: C.paper,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  bullet: { color: C.muted, fontSize: 14, lineHeight: 22 },
  stepCopy: { color: C.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  field: { marginBottom: 12 },
  label: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: C.panel2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.md,
    color: C.paper,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  skip: { alignItems: 'center', paddingVertical: 10 },
  skipText: { color: C.paper, fontWeight: '700', fontSize: 12 },
  skipMuted: { color: C.muted2, fontWeight: '600', fontSize: 12 },
});
