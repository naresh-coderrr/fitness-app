import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Size = 'md' | 'lg';

type Props = {
  userId: string;
  name: string;
  photoUrl?: string | null;
  size?: Size;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function colorFromUserId(userId: string): string {
  let hash = 0;
  for (const char of userId) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const palette = theme.color.avatarPalette;
  const index = Math.abs(hash) % palette.length;
  return palette[index];
}

export function Avatar({ userId, name, photoUrl, size = 'md' }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = useMemo(() => initialsFromName(name), [name]);
  const backgroundColor = useMemo(() => colorFromUserId(userId), [userId]);
  const dimension = size === 'lg' ? theme.size.avatarLg : theme.size.avatar;
  const showPhoto = Boolean(photoUrl) && !imageFailed;

  return (
    <View
      style={[
        styles.base,
        { width: dimension, height: dimension, borderRadius: dimension / 2, backgroundColor },
      ]}
    >
      {showPhoto ? (
        <Image
          source={{ uri: photoUrl as string }}
          onError={() => setImageFailed(true)}
          style={[
            styles.image,
            { width: dimension, height: dimension, borderRadius: dimension / 2 },
          ]}
        />
      ) : (
        <Text style={[styles.initials, size === 'lg' && styles.initialsLg]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: theme.color.onPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  initialsLg: {
    fontSize: theme.fontSize.lg,
  },
});
