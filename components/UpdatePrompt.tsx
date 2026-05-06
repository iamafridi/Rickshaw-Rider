import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { strings } from '../constants/strings';

interface UpdatePromptProps {
  isVisible: boolean;
  onLater?: () => void;
  updateUrl: string;
  isForceUpdate?: boolean;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({ 
  isVisible, 
  onLater, 
  updateUrl,
  isForceUpdate = false 
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{strings.update.title}</Text>
          <Text style={styles.description}>{strings.update.description}</Text>
          
          <View style={styles.actions}>
            {!isForceUpdate && onLater && (
              <TouchableOpacity 
                style={[styles.button, styles.laterButton]} 
                onPress={onLater}
              >
                <Text style={[styles.buttonText, styles.laterText]}>
                  {strings.update.later}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.updateButton]} 
              onPress={() => Linking.openURL(updateUrl)}
            >
              <Text style={styles.buttonText}>
                {strings.update.button}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: colors.primary,
  },
  laterButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
  },
  laterText: {
    color: colors.textPrimary,
  },
});
