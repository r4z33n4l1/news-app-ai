import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LogOut, Settings, ChevronRight, User, Mail } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from '@/components/UserAvatar';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Out', 
            onPress: async () => {
              setIsLoading(true);
              try {
                await signOut();
                router.replace('/auth/login');
              } catch (error) {
                console.error('Error signing out:', error);
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              } finally {
                setIsLoading(false);
              }
            },
            style: 'destructive'
          },
        ]
      );
    } else {
      setIsLoading(true);
      try {
        await signOut();
        router.replace('/auth/login');
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/profile/edit')} style={styles.settingsButton}>
          <Settings size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <UserAvatar size={80} />
          <Text style={styles.userName}>{session?.user?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.userEmail}>{session?.user?.email || 'user@example.com'}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/edit')}>
            <View style={styles.menuItemLeft}>
              <User size={20} color={Colors.primary} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Profile Information</Text>
            </View>
            <ChevronRight size={20} color="#aaa" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/email')}>
            <View style={styles.menuItemLeft}>
              <Mail size={20} color={Colors.primary} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Email Preferences</Text>
            </View>
            <ChevronRight size={20} color="#aaa" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Topics</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/topics/manage')}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Manage Topics</Text>
            </View>
            <ChevronRight size={20} color="#aaa" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/topics/history')}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>View Topic History</Text>
            </View>
            <ChevronRight size={20} color="#aaa" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <LogOut size={20} color="white" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.versionText}>News Briefs v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.primary,
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginTop: 16,
    color: '#333',
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  signOutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});