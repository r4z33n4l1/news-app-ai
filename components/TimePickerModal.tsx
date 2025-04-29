import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';

type TimePickerModalProps = {
  visible: boolean;
  selectedTime: Date;
  onTimeSelected: (time: Date) => void;
  onCancel: () => void;
};

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  selectedTime,
  onTimeSelected,
  onCancel
}) => {
  const [tempTime, setTempTime] = useState(selectedTime);
  
  if (Platform.OS === 'web') {
    return null; // Web implementation would be different
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  const handleConfirm = () => {
    onTimeSelected(tempTime);
  };

  const setHour = (hour: number) => {
    const newTime = new Date(tempTime);
    const isPM = newTime.getHours() >= 12;
    newTime.setHours(isPM ? hour + 12 : hour);
    setTempTime(newTime);
  };

  const setMinute = (minute: number) => {
    const newTime = new Date(tempTime);
    newTime.setMinutes(minute);
    setTempTime(newTime);
  };

  const setPeriod = (period: string) => {
    const newTime = new Date(tempTime);
    const currentHour = newTime.getHours();
    const is12Hour = currentHour === 12 || currentHour === 0;
    
    if (period === 'AM' && currentHour >= 12) {
      newTime.setHours(is12Hour ? 0 : currentHour - 12);
    } else if (period === 'PM' && currentHour < 12) {
      newTime.setHours(is12Hour ? 12 : currentHour + 12);
    }
    
    setTempTime(newTime);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Time</Text>
          
          <View style={styles.pickerContainer}>
            {/* Hours */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hour</Text>
              <View style={styles.pickerValues}>
                {hours.map((hour) => {
                  const currentHour = tempTime.getHours() % 12 || 12;
                  const isSelected = hour === currentHour;
                  
                  return (
                    <TouchableOpacity
                      key={`hour-${hour}`}
                      style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                      onPress={() => setHour(hour === 12 ? 0 : hour)}
                    >
                      <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            {/* Minutes */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minute</Text>
              <View style={styles.pickerValues}>
                {[0, 15, 30, 45].map((minute) => {
                  const isSelected = minute === tempTime.getMinutes();
                  
                  return (
                    <TouchableOpacity
                      key={`minute-${minute}`}
                      style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                      onPress={() => setMinute(minute)}
                    >
                      <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            {/* AM/PM */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Period</Text>
              <View style={styles.pickerValues}>
                {periods.map((period) => {
                  const currentHour = tempTime.getHours();
                  const isSelected = 
                    (period === 'AM' && currentHour < 12) || 
                    (period === 'PM' && currentHour >= 12);
                  
                  return (
                    <TouchableOpacity
                      key={`period-${period}`}
                      style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                      onPress={() => setPeriod(period)}
                    >
                      <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                        {period}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  pickerValues: {
    alignItems: 'center',
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  pickerItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  pickerItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  pickerItemTextSelected: {
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#999',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
});

export default TimePickerModal;