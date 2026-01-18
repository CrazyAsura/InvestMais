import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput, StyleSheet, Alert } from 'react-native';
import { 
  Box, 
  Text, 
  VStack, 
  Button, 
  FormControl, 
  Center, 
  Heading, 
  HStack, 
  Link, 
  Pressable,
  Icon,
  useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, setError } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import api from '@/services/api';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/zod/login';
import { FormInput } from '@/components/ui/form-input';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post('/auth/login', data);
      
      const { user, token } = response.data;
      dispatch(setCredentials({ user, token }));
      
      toast.show({
        description: "Login realizado com sucesso!",
        placement: "top",
        bg: "success.500"
      });
      
      router.replace('/(tabs)');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao realizar login';
      const errorMessage = Array.isArray(message) ? message[0] : message;
      
      dispatch(setError(errorMessage));
      toast.show({
        description: errorMessage,
        placement: "top",
        bg: "error.500"
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Center w="100%" flex={1} bg={themeColors.background} px="6">
      <Box safeArea p="2" py="8" w="100%" maxW="350">
        <VStack space={2} alignItems="center" mb="10">
          <Heading 
            size="2xl" 
            fontWeight="900" 
            color={themeColors.tint}
          >
            InvestMais
          </Heading>
          <Text 
            fontSize="md" 
            color={themeColors.icon}
            fontWeight="medium"
          >
            Seu banco de investimentos
          </Text>
        </VStack>

        <VStack space={4} mt="5">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="E-mail"
                placeholder="seu@email.com"
                value={value}
                onChangeText={onChange}
                icon="email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />
          
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Senha"
                placeholder="Sua senha"
                value={value}
                onChangeText={onChange}
                icon="lock"
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          <Link 
            _text={{
              fontSize: "xs",
              fontWeight: "700",
              color: themeColors.icon
            }} 
            alignSelf="flex-end" 
            mt="-2"
            onPress={() => router.push('/reset-password')}
          >
            Esqueceu a senha?
          </Link>

          <Button 
            mt="6" 
            size="lg"
            bg={themeColors.tint}
            _pressed={{ bg: 'amber.600' }}
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            borderRadius="xl"
            _text={{ fontWeight: 'bold', fontSize: 'md' }}
          >
            Entrar
          </Button>

          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color={themeColors.text}>
              Não tem uma conta?{" "}
            </Text>
            <Link 
              _text={{
                color: themeColors.tint,
                fontWeight: "bold",
                fontSize: "sm"
              }} 
              onPress={() => router.push('/register')}
            >
              Cadastre-se
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 16,
  },
});