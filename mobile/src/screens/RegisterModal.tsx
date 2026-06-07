import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import * as Yup from 'yup';

import CustomButton from '../../specs/CustomButtonNativeComponent';
import { colors } from '../colors';
import { useLotteryRegister } from '../hooks/useLotteryRegister';
import { useRegisteredStore } from '../store/useRegisteredStore.ts';
import type { RegisterScreenRouteProp } from '../types';

const registerSchema = Yup.object({
  name: Yup.string().min(4).required(),
});

export const RegisterModal = () => {
  const { error, isPending, mutate } = useLotteryRegister();
  const route = useRoute<RegisterScreenRouteProp>();
  const navigation = useNavigation();
  const { addRegisteredItems } = useRegisteredStore();

  const selectedLotteries = route.params?.selectedLotteries;

  const handleClose = () => {
    navigation.goBack();
  };

  const formik = useFormik({
    validationSchema: registerSchema,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      name: '',
    },
    onSubmit: ({ name }) => {
      mutate({ name, lotteries: selectedLotteries });
      addRegisteredItems(selectedLotteries);
      handleClose();
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register to lotteries</Text>
      <TextInput
        accessibilityLabel="Text input field"
        placeholder="Enter your name"
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
        value={formik.values.name}
        style={styles.input}
      />
      {formik.touched.name && formik.errors.name ? (
        <Text style={styles.error}>{formik.errors.name}</Text>
      ) : null}
      <CustomButton
        text="Register"
        disabled={!formik.isValid || isPending}
        onCustomButtonPress={() => formik.handleSubmit()}
        style={{ width: 120, height: 44, marginTop: 32 }}
      />
      {error ? <Text style={styles.error}>error</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  input: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    fontSize: 16,
    width: 300,
  },
  error: {
    fontSize: 10,
    color: colors.danger,
    paddingTop: 8,
  },
});
