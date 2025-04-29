import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '@/constants/Colors';

type TopicTagProps = {
  label: string;
  onPress?: () => void;
  selectable?: boolean;
  selected?: boolean;
};

const TopicTag: React.FC<TopicTagProps> = ({
  label,
  onPress,
  selectable = false,
  selected = false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selectable && styles.selectable,
        selected && styles.selected,
        !onPress && styles.static
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text
        style={[
          styles.label,
          selectable && styles.selectableLabel,
          selected && styles.selectedLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectable: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  static: {
    opacity: 1,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  selectableLabel: {
    color: '#666',
  },
  selectedLabel: {
    color: Colors.primary,
  },
});

export default TopicTag;