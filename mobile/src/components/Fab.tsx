import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { colors } from '../colors';

type Props = {
  onPress: () => void;
};

export const Fab = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.container}
      onPress={onPress}
    >
      <FontAwesome6
        name="plus"
        size={24}
        color={colors.secondary}
        iconStyle="solid"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
