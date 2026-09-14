import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = false }: Props) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'left', 'right']}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: theme.layout.flexFill,
    backgroundColor: theme.color.background,
  },
  fill: {
    flex: theme.layout.flexFill,
  },
  content: {
    padding: theme.space.lg,
    gap: theme.space.lg,
  },
});
