import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

type UserAvatarProps = {
  size?: number;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ size = 40 }) => {
  const { session } = useAuth();
  
  // Generate initials from email
  const getInitials = () => {
    if (!session?.user?.email) return '?';
    
    const email = session.user.email;
    const name = email.split('@')[0];
    
    if (name.length <= 2) {
      return name.toUpperCase();
    }
    
    // Get first two characters
    return name.substring(0, 2).toUpperCase();
  };
  
  // Generate a consistent background color based on email
  const getBackgroundColor = () => {
    if (!session?.user?.email) return Colors.primary;
    
    const colors = [
      '#4299E1', // blue
      '#38B2AC', // teal
      '#ED8936', // orange
      '#9F7AEA', // purple
      '#F56565', // red
      '#48BB78', // green
    ];
    
    const email = session.user.email;
    const sumChars = email.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = sumChars % colors.length;
    
    return colors[colorIndex];
  };

  return (
    <View 
      style={[
        styles.avatar,
        { 
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBackgroundColor()
        }
      ]}
    >
      <Text 
        style={[
          styles.initials,
          { fontSize: size * 0.4 }
        ]}
      >
        {getInitials()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
});

export default UserAvatar;