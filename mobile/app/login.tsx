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

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.show({
        description: "Por favor, preencha todos os campos",
        placement: "top",
        variant: "subtle",
        bg: "error.500"
      });
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await api.post('/auth/login', { email, password });
      
      const { user, token } = response.data;
      dispatch(setCredentials({ user, token }));
      
      toast.show({
        description: "Login realizado com sucesso!",
        placement: "top",
        variant: "subtle",
        bg: "success.500"
      });
      
      router.replace('/(tabs)');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao realizar login';
      dispatch(setError(message));
      toast.show({
        description: message,
        placement: "top",
        variant: "subtle",
        bg: "error.500"
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const inputBg = colorScheme === 'dark' ? '#1f2937' : '#f3f4f6'; // coolGray.800 / 100
  const inputBgFocus = colorScheme === 'dark' ? '#374151' : '#e5e7eb'; // coolGray.700 / 200

  return (
    <Center w="100%" flex={1} bg={themeColors.background} px="6">
      <Box safeArea p="2" py="8" w="100%" maxW="290">
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
          <FormControl>
            <HStack 
              alignItems="center" 
              bg={isEmailFocused ? inputBgFocus : inputBg}
              borderWidth={1}
              borderColor={isEmailFocused ? themeColors.tint : 'transparent'}
              borderRadius="md"
              px="2"
              height="12"
            >
              <Icon as={<MaterialIcons name="email" />} size={5} color={themeColors.icon} />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="E-mail"
                placeholderTextColor={themeColors.icon}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </HStack>
          </FormControl>
          
          <FormControl>
            <HStack 
              alignItems="center" 
              bg={isPasswordFocused ? inputBgFocus : inputBg}
              borderWidth={1}
              borderColor={isPasswordFocused ? themeColors.tint : 'transparent'}
              borderRadius="md"
              px="2"
              height="12"
            >
              <Icon as={<MaterialIcons name="lock" />} size={5} color={themeColors.icon} />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Senha"
                placeholderTextColor={themeColors.icon}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} color={themeColors.icon} />
              </Pressable>
            </HStack>
            <Link 
              _text={{
                fontSize: "xs",
                fontWeight: "700",
                color: themeColors.icon
              }} 
              alignSelf="flex-end" 
              mt="1"
              onPress={() => router.push('/reset-password')}
            >
              Esqueceu a senha?
            </Link>
          </FormControl>

          <Button 
            mt="6" 
            size="lg"
            bg={themeColors.tint}
            _pressed={{ bg: 'amber.600' }}
            onPress={handleLogin}
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