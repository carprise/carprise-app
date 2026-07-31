import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/src/constants/theme';
import { Button, Card, Pill, ScreenTitle } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function VehicleScreen() {
  const { vehicle, saveVehicle, uploadVehiclePhoto } = useApp();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [make, setMake] = useState(''); const [model, setModel] = useState(''); const [year, setYear] = useState(''); const [colour, setColour] = useState(''); const [registration, setRegistration] = useState(''); const [saving, setSaving] = useState(false);

  useEffect(() => { setMake(vehicle?.make ?? ''); setModel(vehicle?.model ?? ''); setYear(vehicle?.year ?? ''); setColour(vehicle?.colour ?? ''); setRegistration(vehicle?.registration ?? ''); }, [vehicle]);

  const save = async () => {
    if (!make.trim() || !model.trim() || !year.trim() || !registration.trim()) return Alert.alert('Missing details', 'Add the vehicle make, model, year and registration.');
    setSaving(true); const error = await saveVehicle({ id: vehicle?.id, make, model, year, colour, registration, verificationStatus: vehicle?.verificationStatus ?? 'pending' }); setSaving(false);
    Alert.alert(error ? 'Could not save vehicle' : 'Vehicle saved', error ?? 'Your vehicle details have been updated.');
  };

  const addPhoto = async () => {
    setUploadMessage(null);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const error = await uploadVehiclePhoto(asset.uri, asset.fileName ?? 'vehicle.jpg');
    setUploadMessage(error ? `Upload failed: ${error}` : 'Vehicle photo uploaded successfully. It is now stored privately for Carprise review.');
  };

  const verified = vehicle?.verificationStatus === 'verified';
  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <ScreenTitle eyebrow="YOUR VEHICLE" title="Campaign ready." copy="Keep your vehicle information and verification photos current." />
    <Card style={styles.car}><View style={styles.carIcon}><Ionicons name="car-sport" size={45} color={C.gold} /></View><Pill tone={verified ? 'green' : 'gold'}>{verified ? 'VERIFIED' : 'PENDING REVIEW'}</Pill><Text style={styles.title}>{year || 'Year'} {make || 'Make'} {model || 'Model'}</Text><Text style={styles.plate}>{registration || 'REGISTRATION'}</Text>{vehicle?.journeyCode ? <Text style={styles.journey}>Passenger code · {vehicle.journeyCode}</Text> : null}{vehicle?.city ? <Text style={styles.city}>{vehicle.city} · {(vehicle.hardwareStatus ?? 'hardware pending').split('_').join(' ')}</Text> : null}</Card>
    <Card>
      <View style={styles.row}><Field label="Make" value={make} onChangeText={setMake} placeholder="Mercedes-Benz" /><Field label="Model" value={model} onChangeText={setModel} placeholder="E-Class" /></View>
      <View style={styles.row}><Field label="Year" value={year} onChangeText={setYear} placeholder="2022" keyboardType="number-pad" /><Field label="Colour" value={colour} onChangeText={setColour} placeholder="Black" /></View>
      <Field label="Registration" value={registration} onChangeText={setRegistration} placeholder="CP26 ONE" autoCapitalize="characters" />
    </Card>
    <Button label={saving ? 'Saving...' : 'Save vehicle details'} onPress={saving ? undefined : save} />
    <Button label="Upload vehicle photo" secondary onPress={addPhoto} />
    {uploadMessage && <View style={[styles.uploadNotice, uploadMessage.startsWith('Upload failed') ? styles.uploadError : styles.uploadSuccess]}><Ionicons name={uploadMessage.startsWith('Upload failed') ? 'alert-circle' : 'checkmark-circle'} size={20} color={uploadMessage.startsWith('Upload failed') ? C.danger : C.success} /><Text style={styles.uploadText}>{uploadMessage}</Text></View>}
    <Card><Text style={styles.itemTitle}>Verification review</Text><Text style={styles.itemCopy}>Vehicle details and uploaded photos remain private and are reviewed by the Carprise operations team.</Text></Card>
  </ScrollView>;
}

function Field(props: any) { return <View style={styles.field}><Text style={styles.label}>{props.label}</Text><TextInput {...props} style={styles.input} placeholderTextColor="#666A72" /></View>; }
const styles = StyleSheet.create({ page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 13 }, car: { alignItems: 'center', paddingVertical: 30 }, carIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.gold + '12', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }, title: { color: C.text, fontSize: 20, fontWeight: '700', marginTop: 16, textAlign: 'center' }, plate: { color: C.gold, fontSize: 13, fontWeight: '900', letterSpacing: 3, marginTop: 8 }, journey: { color: C.violet, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginTop: 12 }, city: { color: C.muted, fontSize: 11, marginTop: 6, textTransform: 'capitalize' }, row: { flexDirection: 'row', gap: 10 }, field: { flex: 1, marginBottom: 14 }, label: { color: C.text, fontSize: 11, fontWeight: '700', marginBottom: 7 }, input: { color: C.text, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 13, fontSize: 14 }, itemTitle: { color: C.text, fontSize: 15, fontWeight: '700' }, itemCopy: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 7 }, uploadNotice: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 14, padding: 14 }, uploadSuccess: { backgroundColor: C.success + '13', borderColor: C.success + '66' }, uploadError: { backgroundColor: C.danger + '13', borderColor: C.danger + '66' }, uploadText: { color: C.text, flex: 1, lineHeight: 19 } });
