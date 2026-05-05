import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

import { colors } from '../colors';
import { LotteryForm } from '../components/Form';
import type { AddLotteryNavigationProp } from '../types';

export const AddLottery = () => {
  const navigation = useNavigation<AddLotteryNavigationProp>();
  const toast = useToast();

  const onSubmit = () => {
    toast.show('New lottery added successfully!');
  };

  const onNavigateBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LotteryForm onSubmit={onSubmit} onNavigateBack={onNavigateBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
  },
});
