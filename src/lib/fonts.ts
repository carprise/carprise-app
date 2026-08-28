import { Platform } from 'react-native';

export const FONT_FAMILY =
  Platform.OS === 'web' ? 'Inter, ui-sans-serif, system-ui, sans-serif' : 'Inter';

export const font = (weight: '300' | '400' | '500' | '600' | '700' = '400') => {
  if (Platform.OS === 'web') {
    return { fontFamily: FONT_FAMILY, fontWeight: weight };
  }
  const native =
    weight === '700'
      ? 'Inter-Bold'
      : weight === '600'
        ? 'Inter-SemiBold'
        : weight === '500'
          ? 'Inter-Medium'
          : weight === '300'
            ? 'Inter-Light'
            : 'Inter';
  return { fontFamily: native };
};
