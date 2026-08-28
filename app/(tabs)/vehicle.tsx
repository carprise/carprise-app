import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { C, R } from '@/src/constants/theme';
import { Button, Card, Pill, ScreenTitle } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

const PASSENGER_ORIGIN = 'https://www.carprise.co.uk';

function journeyUrl(code: string) {
  return `${PASSENGER_ORIGIN}/j/${encodeURIComponent(code)}`;
}

function qrUrl(code: string) {
  const data = encodeURIComponent(journeyUrl(code));
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${data}`;
}

export default function VehicleScreen() {
  const { vehicle, saveVehicle, uploadVehiclePhoto } = useApp();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [colour, setColour] = useState('');
  const [registration, setRegistration] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMake(vehicle?.make ?? '');
    setModel(vehicle?.model ?? '');
    setYear(vehicle?.year ?? '');
    setColour(vehicle?.colour ?? '');
    setRegistration(vehicle?.registration ?? '');
  }, [vehicle]);

  const save = async () => {
    if (!make.trim() || !model.trim() || !year.trim() || !registration.trim()) {
      return Alert.alert('Missing details', 'Add the vehicle make, model, year and registration.');
    }
    setSaving(true);
    const error = await saveVehicle({
      id: vehicle?.id,
      make,
      model,
      year,
      colour,
      registration,
      verificationStatus: vehicle?.verificationStatus ?? 'pending',
    });
    setSaving(false);
    Alert.alert(error ? 'Could not save vehicle' : 'Vehicle saved', error ?? 'Your vehicle details have been updated.');
  };

  const addPhoto = async () => {
    setUploadMessage(null);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const error = await uploadVehiclePhoto(asset.uri, asset.fileName ?? 'vehicle.jpg');
    setUploadMessage(
      error
        ? `Upload failed: ${error}`
        : 'Vehicle photo uploaded successfully. It is now stored privately for Carprise review.',
    );
  };

  const verified = vehicle?.verificationStatus === 'verified';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <ScreenTitle
        eyebrow="Your vehicle"
        title="Campaign ready."
        copy="Keep your vehicle information and verification photos current."
      />

      <Card style={styles.car}>
        <View style={styles.carIcon}>
          <Ionicons name="car-sport" size={40} color={C.champagne} />
        </View>
        <Pill tone={verified ? 'green' : 'gold'}>{verified ? 'VERIFIED' : 'PENDING REVIEW'}</Pill>
        <Text style={styles.title}>
          {year || 'Year'} {make || 'Make'} {model || 'Model'}
        </Text>
        <Text style={styles.plate}>{registration || 'REGISTRATION'}</Text>
        {vehicle?.journeyCode ? (
          <Text style={styles.journey}>Passenger code · {vehicle.journeyCode}</Text>
        ) : null}
        {vehicle?.city ? (
          <Text style={styles.city}>
            {vehicle.city} · {(vehicle.hardwareStatus ?? 'hardware pending').split('_').join(' ')}
          </Text>
        ) : null}
      </Card>

      {vehicle?.journeyCode ? (
        <Card style={styles.qrCard}>
          <Text style={styles.qrLabel}>Passenger QR sticker</Text>
          <Text style={styles.qrCopy}>
            Place this code in the cabin. Any passenger phone opens the hospitality experience — not this
            driver app.
          </Text>
          <Image
            source={{ uri: qrUrl(vehicle.journeyCode) }}
            style={styles.qrImage}
            accessibilityLabel={`QR code for journey ${vehicle.journeyCode}`}
          />
          <Text style={styles.qrCode}>{vehicle.journeyCode}</Text>
          <Text style={styles.qrUrl}>{journeyUrl(vehicle.journeyCode).replace('https://', '')}</Text>
          <Pressable
            onPress={() => void Linking.openURL(journeyUrl(vehicle.journeyCode!))}
            style={styles.qrLinkBtn}
          >
            <Text style={styles.qrLinkText}>Preview passenger cabin →</Text>
          </Pressable>
        </Card>
      ) : null}

      <Card>
        <View style={styles.row}>
          <Field label="Make" value={make} onChangeText={setMake} placeholder="Mercedes-Benz" />
          <Field label="Model" value={model} onChangeText={setModel} placeholder="E-Class" />
        </View>
        <View style={styles.row}>
          <Field label="Year" value={year} onChangeText={setYear} placeholder="2022" keyboardType="number-pad" />
          <Field label="Colour" value={colour} onChangeText={setColour} placeholder="Black" />
        </View>
        <Field
          label="Registration"
          value={registration}
          onChangeText={setRegistration}
          placeholder="CP26 ONE"
          autoCapitalize="characters"
        />
      </Card>

      <Button label={saving ? 'Saving...' : 'Save vehicle details'} onPress={saving ? undefined : save} />
      <Button label="Upload vehicle photo" secondary onPress={addPhoto} />

      {uploadMessage && (
        <View
          style={[
            styles.uploadNotice,
            uploadMessage.startsWith('Upload failed') ? styles.uploadError : styles.uploadSuccess,
          ]}
        >
          <Ionicons
            name={uploadMessage.startsWith('Upload failed') ? 'alert-circle' : 'checkmark-circle'}
            size={20}
            color={uploadMessage.startsWith('Upload failed') ? C.danger : C.acid}
          />
          <Text style={styles.uploadText}>{uploadMessage}</Text>
        </View>
      )}

      <Card>
        <Text style={styles.itemTitle}>Verification review</Text>
        <Text style={styles.itemCopy}>
          Vehicle details and uploaded photos remain private and are reviewed by the Carprise operations team.
        </Text>
      </Card>
    </ScrollView>
  );
}

function Field(props: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput {...props} style={styles.input} placeholderTextColor={C.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  page: { flexGrow: 1, padding: 20, paddingTop: 62, paddingBottom: 120, gap: 14, backgroundColor: C.bg },
  car: { alignItems: 'center', paddingVertical: 30 },
  carIcon: {
    width: 88,
    height: 88,
    borderRadius: R.lg,
    backgroundColor: C.champagne + '14',
    borderWidth: 1,
    borderColor: C.champagne + '33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: C.paper,
    fontSize: 20,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  plate: {
    color: C.paper,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginTop: 8,
  },
  journey: {
    color: C.violet,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 14,
  },
  city: { color: C.muted, fontSize: 12, marginTop: 6, textTransform: 'capitalize' },
  qrCard: { alignItems: 'center', paddingVertical: 22 },
  qrLabel: {
    color: C.champagne,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  qrCopy: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: R.md,
    backgroundColor: '#fff',
  },
  qrCode: {
    color: C.paper,
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 14,
  },
  qrUrl: { color: C.muted2, fontSize: 11, marginTop: 6 },
  qrLinkBtn: { marginTop: 14 },
  qrLinkText: { color: C.paper, fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 10 },
  field: { flex: 1, marginBottom: 14 },
  label: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    color: C.paper,
    backgroundColor: C.panel2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.md,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 14,
  },
  itemTitle: { color: C.paper, fontSize: 15, fontWeight: '600' },
  itemCopy: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  uploadNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: R.md,
    padding: 14,
  },
  uploadSuccess: { backgroundColor: C.acid + '12', borderColor: C.acid + '55' },
  uploadError: { backgroundColor: C.danger + '12', borderColor: C.danger + '55' },
  uploadText: { color: C.paper, flex: 1, lineHeight: 19 },
});
