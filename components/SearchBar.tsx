import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ style, onClear, value, ...rest }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconPlaceholder} />
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textHint}
        value={value}
        {...rest}
      />
      {value ? (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <View style={styles.clearIconPlaceholder} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 10,
    marginRight: 10,
  },
  clearIconPlaceholder: {
    width: 16,
    height: 16,
    backgroundColor: colors.textHint,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 8,
  },
});
