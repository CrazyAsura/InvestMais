import React from 'react';
import { useColorScheme } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Pressable, 
  Heading, 
  Divider,
  IconButton,
  useColorModeValue
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Colors } from '@/constants/theme';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const bgColor = useColorModeValue('white', 'coolGray.900');
  const activeBg = useColorModeValue('rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.2)');
  const inactiveColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const textColor = useColorModeValue('coolGray.800', 'white');

  const menuOptions = [
    { name: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { name: 'Usuários', icon: 'people', route: '/admin/users' },
    { name: 'Histórico', icon: 'history', route: '/admin/activity-log' },
    { name: 'Notificações', icon: 'notifications', route: '/admin/notifications' },
  ];

  if (!isOpen) return null;

  return (
    <Pressable 
      position="absolute" 
      top={0} 
      left={0} 
      right={0} 
      bottom={0} 
      bg="rgba(0,0,0,0.4)" 
      zIndex={100} 
      onPress={onClose}
    >
      <Box 
        w="280px" 
        h="100%" 
        bg={bgColor}
        shadow={9}
        safeAreaTop
      >
        <Pressable onPress={(e: any) => e.stopPropagation()} flex={1}>
          <VStack space={2} p={4} flex={1}>
            <HStack justifyContent="space-between" alignItems="center" mb={6} px={2}>
              <VStack>
                <Heading size="md" color={textColor}>InvestMais</Heading>
                <Text color={themeColors.tint} fontSize="xs" fontWeight="bold">PAINEL ADMIN</Text>
              </VStack>
              <IconButton 
                icon={<Icon as={<MaterialIcons name="close" />} size={6} color={inactiveColor} />}
                onPress={onClose}
                variant="ghost"
                borderRadius="full"
                _pressed={{ bg: useColorModeValue('coolGray.100', 'coolGray.800') }}
              />
            </HStack>

            <Divider mb={4} opacity={0.2} bg={inactiveColor} />

            {menuOptions.map((item) => {
              const isActive = pathname === item.route;
              return (
                <Pressable 
                  key={item.name} 
                  p={4} 
                  borderRadius="xl"
                  bg={isActive ? activeBg : 'transparent'}
                  _pressed={{ bg: activeBg }}
                  onPress={() => {
                    onClose();
                    router.push(item.route as any);
                  }}
                >
                  <HStack space={4} alignItems="center">
                    <Icon 
                      as={<MaterialIcons name={item.icon as any} />} 
                      size={6} 
                      color={isActive ? themeColors.tint : inactiveColor} 
                    />
                    <Text 
                      fontSize="md" 
                      fontWeight={isActive ? 'bold' : 'medium'}
                      color={isActive ? themeColors.tint : textColor}
                    >
                      {item.name}
                    </Text>
                  </HStack>
                </Pressable>
              );
            })}

            <VStack mt="auto" mb={6} space={2}>
                <Divider mb={4} opacity={0.2} bg={inactiveColor} />
                <Pressable 
                  p={4} 
                  borderRadius="xl"
                  _pressed={{ bg: 'rgba(255, 0, 0, 0.1)' }}
                  onPress={() => router.replace('/(tabs)')}
                >
                  <HStack space={4} alignItems="center">
                    <Icon as={<MaterialIcons name="exit-to-app" />} size={6} color="error.500" />
                    <Text fontSize="md" color="error.500" fontWeight="medium">Sair do Admin</Text>
                  </HStack>
                </Pressable>
            </VStack>
          </VStack>
        </Pressable>
      </Box>
    </Pressable>
  );
};
