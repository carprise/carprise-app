import { Alert, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { C } from '@/src/constants/theme';
import { Button, Card, Pill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { campaigns, accept, decline, completeTask, uploadEvidence } = useApp();
  const campaign = campaigns.find(item => item.id === id);
  if (!campaign) return null;

  const capture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert('Camera permission needed', 'Allow camera access to capture campaign evidence.');
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const error = await uploadEvidence(campaign.assignmentId, asset.uri, asset.fileName ?? 'evidence.jpg');
    Alert.alert(error ? 'Upload failed' : 'Evidence uploaded', error ?? 'The image was uploaded privately for Carprise review.');
  };

  const acceptCampaign = async () => { const error = await accept(campaign.assignmentId); Alert.alert(error ? 'Could not accept campaign' : 'Campaign accepted', error ?? 'The campaign is now active in your dashboard.'); };
  const declineCampaign = async () => { const error = await decline(campaign.assignmentId); if (error) Alert.alert('Could not decline campaign', error); else router.back(); };

  return <ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" color={C.text} size={22} /></Pressable>
    <Pill tone={campaign.status === 'active' ? 'green' : campaign.status === 'invited' ? 'violet' : 'muted'}>{campaign.status.toUpperCase()}</Pill>
    <Text style={styles.brand}>{campaign.brand}</Text><Text style={styles.title}>{campaign.title}</Text><Text style={styles.copy}>{campaign.area} · {campaign.start} to {campaign.end}</Text>
    <Card style={styles.money}><Text style={styles.label}>CAMPAIGN PAYMENT</Text><Text style={styles.amount}>£{campaign.pay.toFixed(0)}</Text><Text style={styles.muted}>Subject to completed activity and approved evidence</Text></Card>
    {campaign.status === 'invited' ? <><Card><Text style={styles.cardTitle}>Your invitation</Text><Text style={styles.muted}>Your vehicle and availability have been matched to this campaign brief.</Text></Card><Button label="Accept campaign" onPress={acceptCampaign} /><Button label="Decline invitation" secondary onPress={declineCampaign} /></> : <><Text style={styles.section}>CAMPAIGN CHECKLIST</Text>{campaign.tasks.map((task, index) => <Pressable key={task.label} onPress={async () => { if (!task.done) { const error = await completeTask(campaign.assignmentId, index); if (error) Alert.alert('Could not update task', error); } }}><Card style={styles.task}><Ionicons name={task.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={task.done ? C.success : C.muted} /><Text style={[styles.taskText, task.done && { color: C.muted }]}>{task.label}</Text></Card></Pressable>)}{campaign.status === 'active' && <Button label="Capture evidence photo" onPress={capture} />}<Card><Text style={styles.cardTitle}>Campaign support</Text><Text style={styles.muted}>Need help with installation, evidence or campaign requirements? Contact the Carprise operations team.</Text><Pressable onPress={() => Alert.alert('Support', 'support@carprise.co.uk')}><Text style={styles.link}>Contact support →</Text></Pressable></Card></>}
  </ScrollView>;
}

const styles = StyleSheet.create({ page: { padding: 20, paddingTop: 60, paddingBottom: 60, gap: 14 }, back: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }, brand: { color: C.gold, fontSize: 11, fontWeight: '900', letterSpacing: 4, marginTop: 18 }, title: { color: C.text, fontSize: 36, fontWeight: '700', lineHeight: 40 }, copy: { color: C.muted }, money: { marginTop: 12, padding: 22 }, label: { color: C.gold, fontSize: 9, fontWeight: '900', letterSpacing: 2 }, amount: { color: C.text, fontSize: 38, fontWeight: '700', marginTop: 8 }, muted: { color: C.muted, lineHeight: 20, marginTop: 6 }, section: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 10 }, task: { flexDirection: 'row', alignItems: 'center', gap: 12 }, taskText: { color: C.text, fontWeight: '700' }, cardTitle: { color: C.text, fontSize: 18, fontWeight: '700' }, link: { color: C.gold, fontWeight: '700', marginTop: 16 } });
