import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { colors } from '../colors';

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

export const SearchInput = ({ value, onSearch }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Text input field"
        style={styles.input}
        placeholder="Filter lotteries"
        value={value}
        onChangeText={onSearch}
      />
      <FontAwesome6
        name="magnifying-glass"
        size={16}
        color="#999999"
        iconStyle="solid"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.grey,
    backgroundColor: colors.secondary,
    paddingHorizontal: 23,
    width: 300,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingRight: 10,
  },
});
