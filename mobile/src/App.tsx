import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ToastProvider } from 'react-native-toast-notifications';

import { AddLottery } from './screens/AddLottery';
import { Home } from './screens/Home';
import { RegisterModal } from './screens/RegisterModal.tsx';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: NativeStackNavigationOptions = {
  title: '',
};

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group>
              <Stack.Screen name="Home" component={Home} options={options} />
              <Stack.Screen
                name="AddLottery"
                component={AddLottery}
                options={options}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="Register" component={RegisterModal} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </QueryClientProvider>
  );
};
