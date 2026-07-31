import { Alert, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { C, R } from '@/src/constants/theme';
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
    if (!permission.granted) {
      return Alert.alert('Camera permission needed', 'Allow camera access to capture campaign evidence.');
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const error = await uploadEvidence(campaign.assignmentId, asset.uri, asset.fileName ?? 'evidence.jpg');
    setMessage(
      error
        ? `Upload failed: ${error}`
        : 'Evidence photo uploaded successfully and sent privately for Carprise review.',
    );
  };

  const choosePhoto = async () => {
    setMessage(null);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const error = await uploadEvidence(campaign.assignmentId, asset.uri, asset.fileName ?? 'evidence.jpg');
    setMessage(
      error
        ? `Upload failed: ${error}`
        : 'Evidence photo uploaded successfully and sent privately for Carprise review.',
    );
  };

  const acceptCampaign = async () => {
    const error = await accept(campaign.assignmentId);
    setMessage(
      error
        ? `Could not accept campaign: ${error}`
        : 'Campaign accepted. It now appears under your upcoming earnings.',
    );
  };

  const declineCampaign = async () => {
    const error = await decline(campaign.assignmentId);
    if (error) setMessage(`Could not decline campaign: ${error}`);
    else router.back();
  };

  const updateProgress = async (next: number) => {
    setUpdating(true);
    const error = await setCampaignProgress(campaign.assignmentId, next);
    setUpdating(false);
    setMessage(
      error
        ? `Could not update progress: ${error}`
        : `Campaign progress updated to ${Math.max(0, Math.min(100, next))}%.`,
    );
  };

  const canWork = campaign.status !== 'invited' && campaign.status !== 'declined';
  const isError = Boolean(message && (message.includes('failed') || message.includes('Could not')));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" color={C.paper} size={20} />
      </Pressable>

      <StatusPill status={campaign.status} />
      <Text style={styles.brand}>{campaign.brand}</Text>
      <Text style={styles.title}>{campaign.title}</Text>
      <Text style={styles.copy}>
        {campaign.area} · {campaign.start} to {campaign.end}
      </Text>

      {message && (
        <View style={[styles.notice, isError ? styles.noticeError : styles.noticeSuccess]}>
          <Ionicons
            name={isError ? 'alert-circle' : 'checkmark-circle'}
            size={20}
            color={isError ? C.danger : C.acid}
          />
          <Text style={styles.noticeText}>{message}</Text>
        </View>
      )}

      <Card style={styles.money}>
        <Text style={styles.label}>Campaign payment</Text>
        <Text style={styles.amount}>£{campaign.pay.toFixed(0)}</Text>
        <Text style={styles.muted}>Subject to completed activity and approved evidence</Text>
      </Card>

      {campaign.status === 'invited' ? (
        <>
          <Card>
            <Text style={styles.cardTitle}>Your invitation</Text>
            <Text style={styles.muted}>
              Your vehicle and availability have been matched to this campaign brief.
            </Text>
          </Card>
          <Button label="Accept campaign" onPress={acceptCampaign} />
          <Button label="Decline invitation" secondary onPress={declineCampaign} />
        </>
      ) : (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.section}>Campaign progress</Text>
            <Text style={styles.percent}>{campaign.progress}%</Text>
          </View>
          <View style={styles.progress}>
            <View style={[styles.progressFill, { width: `${campaign.progress}%` }]} />
          </View>
          <View style={styles.progressButtons}>
            <Pressable
              disabled={updating || campaign.progress <= 0}
              onPress={() => updateProgress(campaign.progress - 5)}
              style={styles.progressButton}
            >
              <Ionicons name="remove" color={C.champagne} size={18} />
              <Text style={styles.progressButtonText}>5%</Text>
            </Pressable>
            <Pressable
              disabled={updating || campaign.progress >= 100}
              onPress={() => updateProgress(campaign.progress + 5)}
              style={styles.progressButton}
            >
              <Ionicons name="add" color={C.champagne} size={18} />
              <Text style={styles.progressButtonText}>5%</Text>
            </Pressable>
          </View>

          <Text style={styles.section}>Campaign checklist</Text>
          {campaign.tasks.map((task, index) => (
            <Pressable
              key={task.label}
              onPress={async () => {
                if (!task.done) {
                  setUpdating(true);
                  const error = await completeTask(campaign.assignmentId, index);
                  setUpdating(false);
                  setMessage(error ? `Could not update task: ${error}` : `${task.label} marked complete.`);
                }
              }}
            >
              <Card style={[styles.task, task.done && styles.taskDone]}>
                <Ionicons
                  name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={task.done ? C.acid : C.muted2}
                />
                <View style={styles.taskCopy}>
                  <Text style={[styles.taskText, task.done && { color: C.muted }]}>{task.label}</Text>
                  <Text style={styles.taskMeta}>
                    {task.done ? 'Completed' : `Moves progress to ${task.progress}%`}
                  </Text>
                </View>
              </Card>
            </Pressable>
          ))}

          {canWork && (
            <>
              <Button label="Take evidence photo" onPress={capture} />
              <Button label="Choose evidence from library" secondary onPress={choosePhoto} />
            </>
          )}

          <Card>
            <Text style={styles.cardTitle}>Campaign support</Text>
            <Text style={styles.muted}>
              Need help with installation, evidence or campaign requirements? Contact the Carprise operations
              team.
            </Text>
            <Pressable onPress={() => Alert.alert('Support', 'support@carprise.co.uk')}>
              <Text style={styles.link}>Contact support →</Text>
            </Pressable>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  page: { flexGrow: 1, padding: 20, paddingTop: 60, paddingBottom: 60, gap: 14, backgroundColor: C.bg },
  back: {
    width: 42,
    height: 42,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  brand: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginTop: 16,
  },
  title: {
    color: C.paper,
    fontSize: 34,
    fontWeight: '500',
    lineHeight: 38,
    letterSpacing: -1,
  },
  copy: { color: C.muted, fontSize: 14 },
  notice: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: R.md,
    padding: 14,
  },
  noticeSuccess: { backgroundColor: C.acid + '12', borderColor: C.acid + '55' },
  noticeError: { backgroundColor: C.danger + '12', borderColor: C.danger + '55' },
  noticeText: { color: C.paper, flex: 1, lineHeight: 19 },
  money: { marginTop: 4, padding: 22 },
  label: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  amount: {
    color: C.paper,
    fontSize: 38,
    fontWeight: '500',
    letterSpacing: -1,
    marginTop: 8,
  },
  muted: { color: C.muted, lineHeight: 21, marginTop: 6, fontSize: 13 },
  section: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  percent: { color: C.champagne, fontSize: 18, fontWeight: '600' },
  progress: { height: 2, backgroundColor: C.line, overflow: 'hidden' },
  progressFill: { height: 2, backgroundColor: C.violet },
  progressButtons: { flexDirection: 'row', gap: 10 },
  progressButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.lineStrong,
    backgroundColor: C.panel2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  progressButtonText: { color: C.champagne, fontWeight: '700', fontSize: 12 },
  task: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskDone: { opacity: 0.85 },
  taskCopy: { flex: 1 },
  taskText: { color: C.paper, fontWeight: '600' },
  taskMeta: { color: C.muted2, fontSize: 11, marginTop: 4 },
  cardTitle: { color: C.paper, fontSize: 17, fontWeight: '500', letterSpacing: -0.2 },
  link: { color: C.champagne, fontWeight: '700', marginTop: 14, fontSize: 12 },
});
