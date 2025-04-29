import { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { session, initialized } = useAuth();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide the splash screen once the fonts are loaded or if there's an error
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loading indicator until auth is initialized and fonts are loaded
  if (!initialized || (!fontsLoaded && !fontError)) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2C3E50" />
      </View>
    );
  }

  // Redirect to the appropriate route based on auth status
  return session ? <Redirect href="/home" /> : <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});