import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '@/src/constants/theme';
import { Button } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function AuthScreen() {
  const { signIn, signUp } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.trim() || password.length < 6 || (mode === 'signup' && !firstName.trim())) {
      Alert.alert('Check your details', 'Enter a valid email, a password of at least 6 characters, and your first name.');
      return;
    }
    setSubmitting(true);
    const error = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, firstName, lastName);
    setSubmitting(false);
    if (error) {
      Alert.alert(mode === 'login' ? 'Could not sign in' : 'Could not create account', error);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={['#07080A', '#111018', '#07080A']} style={styles.background}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.eyebrow}>CARPRISE DRIVER NETWORK</Text>
          <Text style={styles.title}>{mode === 'login' ? 'Welcome back.' : 'Join the movement.'}</Text>
          <Text style={styles.copy}>{mode === 'login' ? 'Sign in to view campaigns, evidence and earnings.' : 'Create your secure driver account to start your application.'}</Text>

          {mode === 'signup' && (
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>First name</Text>
                <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} placeholder="Tasha" placeholderTextColor="#666A72" autoCapitalize="words" />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Last name</Text>
                <TextInput value={lastName} onChangeText={setLastName} style={styles.input} placeholder="Card" placeholderTextColor="#666A72" autoCapitalize="words" />
              </View>
            </View>
          )}

          <Text style={styles.label}>Email address</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="you@example.com" placeholderTextColor="#666A72" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder="At least 6 characters" placeholderTextColor="#666A72" secureTextEntry autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />

          <Button label={submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'} onPress={submitting ? undefined : submit} />
          <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={styles.switch}>
            <Text style={styles.switchText}>{mode === 'login' ? 'New to Carprise? Create an account' : 'Already registered? Sign in'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  flex: { flex: 1 },
  page: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 50, justifyContent: 'center' },
  logo: { width: 210, height: 84, alignSelf: 'center', marginBottom: 22 },
  eyebrow: { color: C.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2.4 },
  title: { color: C.text, fontSize: 38, lineHeight: 43, fontWeight: '700', marginTop: 10 },
  copy: { color: C.muted, fontSize: 15, lineHeight: 22, marginTop: 9, marginBottom: 28 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: { color: C.text, fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 14 },
  input: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, borderRadius: 14, color: C.text, paddingHorizontal: 15, paddingVertical: 14, fontSize: 15 },
  switch: { alignItems: 'center', padding: 18 },
  switchText: { color: C.gold, fontWeight: '700', fontSize: 13 },
});
