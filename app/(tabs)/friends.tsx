import { StyleSheet, Text } from 'react-native';
import { Screen } from '../../src/components';
import { theme } from '../../src/theme';

export default function FriendsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Friends</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.color.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
});
