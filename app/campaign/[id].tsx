import { Alert, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { C } from '@/src/constants/theme';
import { Button, Card, StatusPill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { campaigns, accept, decline, completeTask, setCampaignProgress, uploadEvidence } = useApp();
  const [message, setMessage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const campaign = campaigns.find(item => item.id === id);
  if (!campaign) return null;

  const capture = async () => {
    setMessage(null);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert('Camera permission needed', 'Allow camera access to capture campaign evidence.');
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const error = await uploadEvidence(campaign.assignmentId, asset.uri, asset.fileName ?? 'evidence.jpg');
    setMessage(error ? `Upload failed: ${error}` : 'Evidence photo uploaded successfully and sent privately for Carprise review.');
  };

  const choosePhoto = async () => {
    setMessage(null);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const error = await uploadEvidence(campaign.assignmentId, asset.uri, asset.fileName ?? 'evidence.jpg');
    setMessage(error ? `Upload failed: ${error}` : 'Evidence photo uploaded successfully and sent privately for Carprise review.');
  };

  const acceptCampaign = async () => {
    const error = await accept(campaign.assignmentId);
    setMessage(error ? `Could not accept campaign: ${error}` : 'Campaign accepted. It now appears under your upcoming earnings.');
  };

  const declineCampaign = async () => {
    const error = await decline(campaign.assignmentId);
    if (error) setMessage(`Could not decline campaign: ${error}`); else router.back();
  };

  const updateProgress = async (next: number) => {
    setUpdating(true);
    const error = await setCampaignProgress(campaign.assignmentId, next);
    setUpdating(false);
    setMessage(error ? `Could not update progress: ${error}` : `Campaign progress updated to ${Math.max(0, Math.min(100, next))}%.`);
  };

  const canWork = campaign.status !== 'invited' && campaign.status !== 'declined';

  return <ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" color={C.text} size={22} /></Pressable>
    <StatusPill status={campaign.status} />
    <Text style={styles.brand}>{campaign.brand}</Text><Text style={styles.title}>{campaign.title}</Text><Text style={styles.copy}>{campaign.area} · {campaign.start} to {campaign.end}</Text>
    {message && <View style={[styles.notice, message.includes('failed') || message.includes('Could not') ? styles.noticeError : styles.noticeSuccess]}><Ionicons name={message.includes('failed') || message.includes('Could not') ? 'alert-circle' : 'checkmark-circle'} size={20} color={message.includes('failed') || message.includes('Could not') ? C.danger : C.success} /><Text style={styles.noticeText}>{message}</Text></View>}
    <Card style={styles.money}><Text style={styles.label}>CAMPAIGN PAYMENT</Text><Text style={styles.amount}>£{campaign.pay.toFixed(0)}</Text><Text style={styles.muted}>Subject to completed activity and approved evidence</Text></Card>
    {campaign.status === 'invited' ? <>
      <Card><Text style={styles.cardTitle}>Your invitation</Text><Text style={styles.muted}>Your vehicle and availability have been matched to this campaign brief.</Text></Card>
      <Button label="Accept campaign" onPress={acceptCampaign} />
      <Button label="Decline invitation" secondary onPress={declineCampaign} />
    </> : <>
      <View style={styles.sectionRow}><Text style={styles.section}>CAMPAIGN PROGRESS</Text><Text style={styles.percent}>{campaign.progress}%</Text></View>
      <View style={styles.progress}><View style={[styles.progressFill, { width: `${campaign.progress}%` }]} /></View>
      <View style={styles.progressButtons}><Pressable disabled={updating || campaign.progress <= 0} onPress={() => updateProgress(campaign.progress - 5)} style={styles.progressButton}><Ionicons name="remove" color={C.gold} size={20} /><Text style={styles.progressButtonText}>5%</Text></Pressable><Pressable disabled={updating || campaign.progress >= 100} onPress={() => updateProgress(campaign.progress + 5)} style={styles.progressButton}><Ionicons name="add" color={C.gold} size={20} /><Text style={styles.progressButtonText}>5%</Text></Pressable></View>
      <Text style={styles.section}>CAMPAIGN CHECKLIST</Text>
      {campaign.tasks.map((task, index) => <Pressable key={task.label} onPress={async () => { if (!task.done) { setUpdating(true); const error = await completeTask(campaign.assignmentId, index); setUpdating(false); setMessage(error ? `Could not update task: ${error}` : `${task.label} marked complete.`); } }}><Card style={[styles.task, task.done && styles.taskDone]}><Ionicons name={task.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={task.done ? C.success : C.muted} /><View style={styles.taskCopy}><Text style={[styles.taskText, task.done && { color: C.muted }]}>{task.label}</Text><Text style={styles.taskMeta}>{task.done ? 'Completed' : `Moves progress to ${task.progress}%`}</Text></View></Card></Pressable>)}
      {canWork && <><Button label="Take evidence photo" onPress={capture} /><Button label="Choose evidence from library" secondary onPress={choosePhoto} /></>}
      <Card><Text style={styles.cardTitle}>Campaign support</Text><Text style={styles.muted}>Need help with installation, evidence or campaign requirements? Contact the Carprise operations team.</Text><Pressable onPress={() => Alert.alert('Support', 'support@carprise.co.uk')}><Text style={styles.link}>Contact support →</Text></Pressable></Card>
    </>}
  </ScrollView>;
}

const styles = StyleSheet.create({ page: { padding: 20, paddingTop: 60, paddingBottom: 60, gap: 14 }, back: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }, brand: { color: C.gold, fontSize: 11, fontWeight: '900', letterSpacing: 4, marginTop: 18 }, title: { color: C.text, fontSize: 36, fontWeight: '700', lineHeight: 40 }, copy: { color: C.muted }, notice: { flexDirection: 'row', gap: 10, alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 14 }, noticeSuccess: { backgroundColor: C.success + '13', borderColor: C.success + '66' }, noticeError: { backgroundColor: C.danger + '13', borderColor: C.danger + '66' }, noticeText: { color: C.text, flex: 1, lineHeight: 19 }, money: { marginTop: 12, padding: 22 }, label: { color: C.gold, fontSize: 9, fontWeight: '900', letterSpacing: 2 }, amount: { color: C.text, fontSize: 38, fontWeight: '700', marginTop: 8 }, muted: { color: C.muted, lineHeight: 20, marginTop: 6 }, section: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 10 }, sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }, percent: { color: C.gold, fontSize: 18, fontWeight: '800' }, progress: { height: 10, borderRadius: 5, backgroundColor: C.panel2, overflow: 'hidden' }, progressFill: { height: 10, borderRadius: 5, backgroundColor: C.violet }, progressButtons: { flexDirection: 'row', gap: 10 }, progressButton: { flex: 1, minHeight: 46, borderRadius: 14, borderWidth: 1, borderColor: C.gold + '66', backgroundColor: C.panel2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, progressButtonText: { color: C.gold, fontWeight: '800' }, task: { flexDirection: 'row', alignItems: 'center', gap: 12 }, taskDone: { opacity: 0.82 }, taskCopy: { flex: 1 }, taskText: { color: C.text, fontWeight: '700' }, taskMeta: { color: C.muted, fontSize: 11, marginTop: 4 }, cardTitle: { color: C.text, fontSize: 18, fontWeight: '700' }, link: { color: C.gold, fontWeight: '700', marginTop: 16 } });
