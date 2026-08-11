import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Typography } from '@/components/core/Typography';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Typography variant="h2" color="ink" className="mb-4 text-center">
          This screen doesn't exist.
        </Typography>
        <Link href="/">
          <Typography variant="body" color="inkMuted" className="mt-4 p-4 text-center">
            Go to home screen!
          </Typography>
        </Link>
      </View>
    </>
  );
}
