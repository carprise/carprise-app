/**
 * Driver app theme — same Swiss cream / ink system as carprise.co.uk.
 * Champagne and violet stay off the operational UI; lime is not used.
 */
export const C = {
  bg: '#ece5dc',
  bgSoft: '#e6dfd5',
  panel: '#f5efe6',
  panel2: '#faf6f0',
  panel3: '#ddd6cc',
  elevated: '#f7f1e8',

  /** Primary foreground. Named paper for historical reasons: most screens use C.paper as text. */
  paper: '#08090b',
  text: '#08090b',
  muted: '#6f6b64',
  muted2: '#8a857c',
  placeholder: '#9a958c',

  champagne: '#6f6b64',
  gold: '#6f6b64',
  gold2: '#4f4c47',
  violet: '#08090b',
  acid: '#4d7a3e',

  line: 'rgba(8, 9, 11, 0.14)',
  lineStrong: 'rgba(8, 9, 11, 0.22)',
  hairline: 'rgba(8, 9, 11, 0.16)',
  liveBorder: 'rgba(77, 122, 62, 0.35)',
  liveFill: 'rgba(77, 122, 62, 0.10)',

  success: '#4d7a3e',
  warning: '#8a6a32',
  danger: '#8f3d3d',

  /** Cream on ink-filled controls (primary buttons). */
  ink: '#ece5dc',
  inkMuted: '#6f6b64',
};

export const R = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

/** Shared layout rhythm */
export const Space = {
  pageX: 22,
  pageTop: 56,
  pageBottom: 110,
  section: 28,
  card: 18,
};
