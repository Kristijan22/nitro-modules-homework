import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { colors } from '../colors';
import { Fab } from '../components/Fab.tsx';
import { Loader } from '../components/Loader.tsx';
import { LotteryList } from '../components/LotteryList.tsx';
import { useLotteries } from '../hooks/useLotteries.ts';
import type { AddLotteryNavigationProp } from '../types';

export const Home = () => {
  const [selectedLotteries, setSelectedLotteries] = useState<Array<string>>([]);
  const navigation = useNavigation<AddLotteryNavigationProp>();
  const { data, isLoading, refetch } = useLotteries();

  const isFocused = useIsFocused();

  const handleSelect = (lotteryId: string) => {
    setSelectedLotteries((lotteries) => {
      if (lotteries.includes(lotteryId)) {
        const index = lotteries.indexOf(lotteryId);

        return [...lotteries.slice(0, index), ...lotteries.slice(index + 1)];
      } else {
        return [...lotteries, lotteryId];
      }
    });
  };

  useEffect(() => {
    if (isFocused) {
      refetch();
      setSelectedLotteries([]);
    }
  }, [isFocused, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.navigate('Register', { selectedLotteries })}
        style={[
          styles.button,
          {
            backgroundColor:
              selectedLotteries.length === 0 ? colors.grey : colors.secondary,
          },
        ]}
        disabled={selectedLotteries.length === 0}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={styles.titleText}>Lotteries</Text>
        <FontAwesome6 name="dice" size={36} color="black" iconStyle={'solid'} />
      </View>
      <LotteryList
        lotteries={data ?? []}
        loading={isLoading}
        onPress={handleSelect}
        selectedLotteries={selectedLotteries}
      />
      <Fab onPress={() => navigation.navigate('AddLottery')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    paddingTop: 64,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 36,
    marginRight: 16,
    marginTop: 16,
  },
  button: {
    position: 'absolute',
    right: 16,
    top: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    color: colors.buttonSecondary,
  },
});
