import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Avatar, 
  Pressable, 
  Icon, 
  Divider, 
  Button,
  Center,
  useToast,
  Skeleton,
  Heading
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';

export default function PerfilScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.log('Erro ao fazer logout no servidor', err);
    }
    dispatch(logout());
    toast.show({
      description: "Sessão encerrada",
      placement: "top",
      bg: "info.500"
    });
    router.replace('/login');
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  if (isLoading) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <VStack space={6} p="6" pb="12">
          <Center>
            <Skeleton size="32" rounded="full" />
            <VStack mt="4" alignItems="center" space={2}>
              <Skeleton h="6" w="48" rounded="full" />
              <Skeleton h="4" w="32" rounded="full" />
            </VStack>
          </Center>

          <Box bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'} p="4" borderRadius="2xl" shadow={2}>
            <Skeleton h="6" w="32" mb="4" rounded="full" />
            <VStack space={4}>
              {[1, 2, 3, 4].map(i => (
                <HStack key={i} space={4} alignItems="center">
                  <Skeleton size="10" rounded="full" />
                  <VStack flex={1} space={2}>
                    <Skeleton h="3" w="24" rounded="full" />
                    <Skeleton h="4" w="48" rounded="full" />
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Box>

          <VStack space={3} mt="4">
            <Skeleton h="12" w="100%" rounded="lg" />
            <Skeleton h="12" w="100%" rounded="lg" />
          </VStack>
        </VStack>
      </ScrollView>
    );
  }

  if (!isAuthenticated) {
    return (
      <Center flex={1} bg={themeColors.background} px="6">
        <VStack space={4} alignItems="center">
          <Icon as={<MaterialIcons name="account-circle" />} size={20} color={themeColors.icon} />
          <Text fontSize="xl" fontWeight="bold" color={themeColors.text}>
            Você não está logado
          </Text>
          <Button 
            onPress={() => router.push('/login')}
            bg={themeColors.tint}
            px="8"
          >
            Fazer Login
          </Button>
        </VStack>
      </Center>
    );
  }

  const InfoRow = ({ icon, label, value }: { icon: string, label: string, value?: string }) => (
    <HStack space={4} alignItems="center" py={3}>
      <Box p="2" borderRadius="full" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
        <Icon as={<MaterialIcons name={icon as any} />} size={5} color={themeColors.tint} />
      </Box>
      <VStack flex={1}>
        <Text fontSize="xs" color={themeColors.icon} fontWeight="medium">
          {label}
        </Text>
        <Text fontSize="md" color={themeColors.text} fontWeight="bold">
          {value || 'Não informado'}
        </Text>
      </VStack>
    </HStack>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <VStack space={6} p="6" pb="12">
        <Center>
          <Avatar 
            size="2xl" 
            bg={themeColors.tint}
            _text={{ fontSize: '3xl', fontWeight: 'bold' }}
            source={user?.imageUrl ? { uri: user.imageUrl } : undefined}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <VStack mt="4" alignItems="center">
            <Heading size="lg" color={themeColors.text}>{user?.name}</Heading>
            <Text color={themeColors.icon}>{user?.email}</Text>
          </VStack>
        </Center>

        <Box 
          bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'} 
          p="4" 
          borderRadius="2xl" 
          shadow={2}
        >
          <Text fontSize="lg" fontWeight="bold" color={themeColors.text} mb="4">
            Dados Pessoais
          </Text>
          <VStack space={2}>
            <InfoRow icon="person" label="Nome" value={user?.name} />
            <Divider />
            <InfoRow icon="email" label="E-mail" value={user?.email} />
            <Divider />
            <InfoRow icon="badge" label="CPF/CNPJ" value={user?.document} />
            <Divider />
            <InfoRow icon="cake" label="Data de Nascimento" value={user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : undefined} />
          </VStack>
        </Box>

        <Box 
          bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'} 
          p="4" 
          borderRadius="2xl" 
          shadow={2}
        >
          <Text fontSize="lg" fontWeight="bold" color={themeColors.text} mb="4">
            Contato e Endereço
          </Text>
          <VStack space={2}>
            <InfoRow 
              icon="phone" 
              label="Telefone" 
              value={user?.phone ? `(${user.phone.ddd}) ${user.phone.number}` : undefined} 
            />
            <Divider />
            <InfoRow 
              icon="location-on" 
              label="Endereço" 
              value={user?.address ? `${user.address.city} - ${user.address.state}` : undefined} 
            />
          </VStack>
        </Box>

        <VStack space={3} mt="4">
          {user?.role === 'admin' && (
            <Button 
              size="lg" 
              variant="solid" 
              bg="error.600"
              _text={{ color: 'white', fontWeight: 'bold' }}
              leftIcon={<Icon as={<MaterialIcons name="security" />} size="sm" color="white" />}
              onPress={() => router.push('/admin/activity-log')}
              mb={2}
            >
              Monitoramento (Admin)
            </Button>
          )}

          <Button 
            size="lg" 
            variant="outline" 
            borderColor={themeColors.tint}
            _text={{ color: themeColors.tint, fontWeight: 'bold' }}
            leftIcon={<Icon as={<MaterialIcons name="edit" />} size="sm" />}
            onPress={handleEditProfile}
          >
            Editar Perfil
          </Button>
          
          <Button 
            size="lg" 
            variant="ghost" 
            colorScheme="danger"
            _text={{ fontWeight: 'bold' }}
            leftIcon={<Icon as={<MaterialIcons name="logout" />} size="sm" />}
            onPress={handleLogout}
          >
            Sair da Conta
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

