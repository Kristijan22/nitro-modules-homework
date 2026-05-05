import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Pressable,
} from 'react-native';

import { colors } from '../colors';
import { useRegisteredStore } from '../store/useRegisteredStore.ts';
import type { Lottery } from '../types';

import { SearchInput } from './SearchInput';

type Props = {
  lotteries: Lottery[];
  loading: boolean;
  onPress: (id: string) => void;
  selectedLotteries: Array<string>;
};

export const LotteryList = ({
  lotteries,
  loading,
  selectedLotteries,
  onPress,
}: Props) => {
  const [filter, setFilter] = useState('');
  const { width } = useWindowDimensions();
  const { isItemRegistered } = useRegisteredStore();

  const filteredLotteries = useMemo(
    () =>
      lotteries?.filter((lottery) =>
        lottery.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter, lotteries]
  );

  const renderItem = ({ item }: { item: Lottery }) => {
    const selected = selectedLotteries?.includes(item.id);
    const registered = isItemRegistered(item.id);

    return (
      <Pressable
        accessibilityRole="button"
        style={[
          styles.container,
          {
            backgroundColor: registered ? colors.grey : colors.secondary,
            borderColor: selected ? colors.buttonSecondary : colors.borderColor,
          },
        ]}
        onPress={() => onPress(item.id)}
        disabled={registered}
      >
        <View style={styles.iconsContainer}>
          {item.status === 'running' && (
            <FontAwesome6
              name="rotate"
              size={24}
              color="black"
              iconStyle="solid"
            />
          )}
          {item.status === 'finished' && (
            <FontAwesome6
              name="circle-check"
              size={24}
              color="black"
              iconStyle="solid"
            />
          )}
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.prize}>{item.prize}</Text>
        <Text style={styles.id}>{item.id}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <SearchInput value={filter} onSearch={(val) => setFilter(val)} />
      {lotteries.length !== 0 && filteredLotteries?.length === 0 && (
        <Text style={styles.text}> No search results for `{filter}`</Text>
      )}
      {lotteries.length === 0 && !loading && (
        <View style={styles.wrapper}>
          <FontAwesome6
            name="face-frown"
            size={24}
            color="black"
            iconStyle="solid"
          />
          <Text style={styles.text}>There are no lotteries currently</Text>
        </View>
      )}
      <FlatList
        data={filteredLotteries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: width - 24 }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
  },
  iconsContainer: {
    alignSelf: 'flex-end',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  prize: {
    fontSize: 16,
    marginBottom: 8,
  },
  id: {
    fontSize: 16,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginTop: 16,
  },
});
