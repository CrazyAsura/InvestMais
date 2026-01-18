import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { 
  Box, 
  Text, 
  VStack, 
  Button, 
  Center, 
  Heading, 
  HStack, 
  Link, 
  Pressable,
  Icon
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from 'native-base';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FormInput } from '@/components/ui/form-input';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/zod/reset-password';
import api from '@/services/api';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      await api.post('/auth/reset-password', {
        email: data.email,
        password: data.password,
      });

      toast.show({
        description: "Senha redefinida com sucesso!",
        placement: "top",
        bg: "success.500"
      });

      router.replace('/login');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao redefinir senha';
      toast.show({
        description: Array.isArray(message) ? message[0] : message,
        placement: "top",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center w="100%" flex={1} bg={themeColors.background} px="6">
      <Box safeArea p="2" py="8" w="100%" maxW="290">
        <VStack space={2} alignItems="center" mb="8">
          <Heading 
            size="xl" 
            fontWeight="900" 
            color={themeColors.tint}
            textAlign="center"
          >
            Nova Senha
          </Heading>
          <Text 
            fontSize="sm" 
            color={themeColors.icon}
            fontWeight="medium"
            textAlign="center"
          >
            Escolha uma nova senha segura para sua conta.
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
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Nova Senha"
                placeholder="******"
                value={value}
                onChangeText={onChange}
                icon="lock"
                secureTextEntry={!showPassword}
                error={errors.password?.message}
                rightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)} px="2">
                    <Icon 
                      as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} 
                      size={5} 
                      color={themeColors.icon} 
                    />
                  </Pressable>
                }
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Confirmar Senha"
                placeholder="******"
                value={value}
                onChangeText={onChange}
                icon="lock"
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword?.message}
                rightElement={
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} px="2">
                    <Icon 
                      as={<MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} />} 
                      size={5} 
                      color={themeColors.icon} 
                    />
                  </Pressable>
                }
              />
            )}
          />

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
            Redefinir Senha
          </Button>

          <HStack mt="6" justifyContent="center">
            <Link 
              _text={{
                color: themeColors.tint,
                fontWeight: "bold",
                fontSize: "sm"
              }} 
              onPress={() => router.replace('/login')}
            >
              Cancelar
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}
