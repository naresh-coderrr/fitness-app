import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Card, Chip, Screen, StateView } from '../src/components';
import { theme } from '../src/theme';

export default function ScratchScreen() {
  const [walkSelected, setWalkSelected] = useState(true);
  const [gymSelected, setGymSelected] = useState(false);

  return (
    <Screen scroll>
      <Text style={styles.title}>Shared components</Text>
      <Text style={styles.subtitle}>
        Scratch screen for every shared UI state. Safe to replace later.
      </Text>

      <Text style={styles.section}>Button</Text>
      <Card>
        <Button label="Primary" onPress={() => undefined} />
        <Button label="Secondary" variant="secondary" onPress={() => undefined} />
        <Button label="Ghost" variant="ghost" onPress={() => undefined} />
        <Button label="Loading" loading onPress={() => undefined} />
        <Button label="Disabled" disabled onPress={() => undefined} />
      </Card>

      <Text style={styles.section}>Card</Text>
      <Card>
        <Text style={styles.body}>Standard surface container.</Text>
      </Card>

      <Text style={styles.section}>StateView</Text>
      <Card>
        <StateView status="loading" />
      </Card>
      <Card>
        <StateView
          status="empty"
          message="No activities yet. Log your first one to get started."
          actionLabel="Log activity"
          onAction={() => undefined}
        />
      </Card>
      <Card>
        <StateView
          status="error"
          message="Couldn't load this just now. Check your connection and try again."
          onRetry={() => undefined}
        />
      </Card>

      <Text style={styles.section}>Avatar</Text>
      <Card>
        <View style={styles.row}>
          <Avatar userId="user-alpha" name="Alex Rivera" />
          <Avatar userId="user-beta" name="Sam" size="lg" />
          <Avatar
            userId="user-gamma"
            name="Jordan Lee"
            photoUrl="https://example.invalid/avatar.jpg"
          />
        </View>
      </Card>

      <Text style={styles.section}>Chip</Text>
      <Card>
        <View style={styles.row}>
          <Chip
            label="Walk"
            selected={walkSelected}
            onPress={() => setWalkSelected((value) => !value)}
          />
          <Chip
            label="Gym"
            selected={gymSelected}
            onPress={() => setGymSelected((value) => !value)}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.color.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  subtitle: {
    color: theme.color.textMuted,
    fontSize: theme.fontSize.sm,
  },
  section: {
    color: theme.color.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
  },
  body: {
    color: theme.color.text,
    fontSize: theme.fontSize.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.space.md,
  },
});
