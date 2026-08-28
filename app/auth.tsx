import { useState } from 'react';
import {
  Alert,
  Image,
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
import { LinearGradient } from 'expo-linear-gradient';
import { C, R } from '@/src/constants/theme';
import { Button, StatusDot } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function AuthScreen() {
  const { signIn, signUp } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeTone, setNoticeTone] = useState<'error' | 'info'>('error');

  const showMessage = (message: string, useAlert = false, tone: 'error' | 'info' = 'error') => {
    setNotice(message);
    setNoticeTone(tone);
    // Alert.alert is unreliable on web and can show "{}" for empty/object messages.
    if (useAlert && Platform.OS !== 'web') {
      Alert.alert(mode === 'login' ? 'Sign in' : 'Create account', message);
    }
  };

  const submit = async () => {
    if (!email.trim() || password.length < 6 || (mode === 'signup' && !firstName.trim())) {
      showMessage('Enter a valid email, a password of at least 6 characters, and your first name.');
      return;
    }
    setSubmitting(true);
    setNotice('');
    let cancelled = false;
    const watchdog = setTimeout(() => {
      cancelled = true;
      setSubmitting(false);
      showMessage(
        'Cannot reach the Carprise login service yet. The backend may still be starting after a restore. Wait a minute and try again.',
      );
    }, 14000);

    try {
      if (mode === 'login') {
        const error = await signIn(email, password);
        if (cancelled) return;
        if (error) {
          showMessage(error);
          return;
        }
        router.replace('/(tabs)');
        return;
      }

      const result = await signUp(email, password, firstName, lastName);
      if (cancelled) return;
      if (result.error) {
        showMessage(result.error);
        return;
      }
      if (result.signedIn) {
        showMessage('Account created successfully. Opening your driver dashboard...', false, 'info');
        router.replace('/(tabs)');
        return;
      }

      showMessage(
        'Your account has been created. Check your inbox for a confirmation email from support@carprise.co.uk, then return here and sign in.',
        false,
        'info',
      );
      setMode('login');
      setPassword('');
    } finally {
      clearTimeout(watchdog);
      if (!cancelled) setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={[C.bg, C.bgSoft, C.bg]} style={styles.background}>
      <View style={styles.grid} pointerEvents="none" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

          <View style={styles.kicker}>
            <StatusDot />
            <Text style={styles.eyebrow}>Driver operations</Text>
          </View>

          <Text style={styles.title}>
            {mode === 'login' ? 'Welcome back.' : 'Join operations.'}
          </Text>
          <Text style={styles.copy}>
            {mode === 'login'
              ? 'Sign in for campaigns, stock, routes and daily performance.'
              : 'Create your driver operations account for the founding network.'}
          </Text>

          {mode === 'signup' && (
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>First name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  placeholder="Tasha"
                  placeholderTextColor={C.placeholder}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  placeholder="Card"
                  placeholderTextColor={C.placeholder}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <Text style={styles.label}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={C.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor={C.placeholder}
            secureTextEntry
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {notice ? (
            <View style={[styles.notice, noticeTone === 'info' ? styles.noticeInfo : styles.noticeError]}>
              <Text style={styles.noticeText}>{notice}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Button
              label={submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              onPress={submitting ? undefined : submit}
            />
          </View>

          <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={styles.switch}>
            <Text style={styles.switchText}>
              {mode === 'login' ? 'New to Carprise? Create an account' : 'Already registered? Sign in'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  flex: { flex: 1 },
  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  page: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 56,
    paddingBottom: 48,
    justifyContent: 'center',
  },
  logo: { width: 210, height: 44, marginBottom: 28 },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  eyebrow: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  title: {
    color: C.paper,
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '500',
    letterSpacing: -1.4,
  },
  copy: {
    color: C.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    marginBottom: 28,
    maxWidth: 360,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.md,
    color: C.paper,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 15,
  },
  notice: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: R.md,
    padding: 14,
  },
  noticeError: {
    borderColor: C.danger,
    backgroundColor: 'rgba(143, 61, 61, 0.08)',
  },
  noticeInfo: {
    borderColor: C.lineStrong,
    backgroundColor: C.panel,
  },
  noticeText: { color: C.paper, fontSize: 13, lineHeight: 19 },
  actions: { marginTop: 22 },
  switch: { alignItems: 'center', padding: 20 },
  switchText: {
    color: C.champagne,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
