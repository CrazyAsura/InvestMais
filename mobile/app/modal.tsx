import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Pressable, 
  Icon, 
  Divider, 
  Button,
  Heading,
  useColorModeValue
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const pressedBg = useColorModeValue('coolGray.100', 'coolGray.800');
  const iconBg = useColorModeValue('primary.50', 'primary.900');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');
  const appBg = useColorModeValue('coolGray.50', 'black');

  return (
    <Box flex={1} bg={appBg} p={4}>
      <VStack space={6} mt={2}>
        <VStack space={1} px={2}>
          <Heading size="lg" color={themeColors.text}>Configurações</Heading>
          <Text color="coolGray.500" fontSize="sm">Gerencie sua conta e preferências</Text>
        </VStack>
        
        <Box 
          bg={cardBg} 
          borderRadius="2xl" 
          shadow={2} 
          overflow="hidden"
          borderWidth={1}
          borderColor={borderColor}
        >
          <Pressable 
            p={4} 
            _pressed={{ bg: pressedBg }}
            onPress={() => router.push('/edit-profile')}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={4} alignItems="center">
                <Box p={2} borderRadius="xl" bg={iconBg}>
                  <Icon as={<MaterialIcons name="person-outline" />} size={6} color={themeColors.tint} />
                </Box>
                <VStack>
                  <Text fontSize="md" fontWeight="semibold" color={themeColors.text}>Editar Perfil</Text>
                  <Text fontSize="xs" color="coolGray.500">Altere seus dados pessoais</Text>
                </VStack>
              </HStack>
              <Icon as={<MaterialIcons name="chevron-right" />} size={5} color="coolGray.400" />
            </HStack>
          </Pressable>
          
          <Divider opacity={0.5} />
          
          <Pressable 
            p={4} 
            _pressed={{ bg: pressedBg }}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={4} alignItems="center">
                <Box p={2} borderRadius="xl" bg={iconBg}>
                  <Icon as={<MaterialIcons name="notifications-none" />} size={6} color={themeColors.tint} />
                </Box>
                <VStack>
                  <Text fontSize="md" fontWeight="semibold" color={themeColors.text}>Notificações</Text>
                  <Text fontSize="xs" color="coolGray.500">Configure seus alertas</Text>
                </VStack>
              </HStack>
              <Icon as={<MaterialIcons name="chevron-right" />} size={5} color="coolGray.400" />
            </HStack>
          </Pressable>

          {isAdmin && (
            <>
              <Divider opacity={0.5} />
              <Pressable 
                p={4} 
                _pressed={{ bg: pressedBg }}
                onPress={() => router.push('/admin/dashboard')}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack space={4} alignItems="center">
                    <Box p={2} borderRadius="xl" bg="error.50" _dark={{ bg: 'error.900' }}>
                      <Icon as={<MaterialIcons name="admin-panel-settings" />} size={6} color="error.600" />
                    </Box>
                    <VStack>
                      <Text fontSize="md" fontWeight="semibold" color={themeColors.text}>Painel Admin</Text>
                      <Text fontSize="xs" color="coolGray.500">Gestão do sistema</Text>
                    </VStack>
                  </HStack>
                  <Icon as={<MaterialIcons name="chevron-right" />} size={5} color="coolGray.400" />
                </HStack>
              </Pressable>

              <Divider opacity={0.5} />
              <Pressable 
                p={4} 
                _pressed={{ bg: pressedBg }}
                onPress={() => router.push('/admin/employees' as Href)}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack space={4} alignItems="center">
                    <Box p={2} borderRadius="xl" bg="info.50" _dark={{ bg: 'info.900' }}>
                      <Icon as={<MaterialIcons name="people-outline" />} size={6} color="info.600" />
                    </Box>
                    <VStack>
                      <Text fontSize="md" fontWeight="semibold" color={themeColors.text}>Funcionários</Text>
                      <Text fontSize="xs" color="coolGray.500">Setores e dashboards</Text>
                    </VStack>
                  </HStack>
                  <Icon as={<MaterialIcons name="chevron-right" />} size={5} color="coolGray.400" />
                </HStack>
              </Pressable>
            </>
          )}
        </Box>

        <Box 
          bg={cardBg} 
          borderRadius="2xl" 
          shadow={2} 
          overflow="hidden"
          borderWidth={1}
          borderColor={borderColor}
        >
          <Pressable 
            p={4} 
            _pressed={{ bg: pressedBg }}
            onPress={() => {/* Implement logout */}}
          >
            <HStack space={4} alignItems="center">
              <Box p={2} borderRadius="xl" bg="coolGray.100" _dark={{ bg: 'coolGray.800' }}>
                <Icon as={<MaterialIcons name="logout" />} size={6} color="coolGray.500" />
              </Box>
              <Text fontSize="md" fontWeight="semibold" color="coolGray.500">Sair da Conta</Text>
            </HStack>
          </Pressable>
        </Box>

        <Button 
          variant="unstyled" 
          _text={{ color: 'coolGray.400', fontWeight: 'medium' }}
          onPress={() => router.back()}
          mt={2}
        >
          Fechar
        </Button>
      </VStack>
    </Box>
  );
}
