import React from 'react';
import { useColorScheme, Dimensions } from 'react-native';
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
  useColorModeValue,
  Avatar
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage?: string;
}

export const AdminSidebar = ({ isOpen, onClose, activePage }: AdminSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user } = useAppSelector((state) => state.auth);
  
  const bgColor = useColorModeValue('white', 'coolGray.900');
  const activeBg = useColorModeValue('rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.2)');
  const inactiveColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const pressedBg = useColorModeValue('coolGray.100', 'coolGray.800');
  const profileSummaryBg = useColorModeValue('coolGray.50', 'coolGray.800');

  const menuOptions = [
    { name: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { name: 'Produtos', icon: 'inventory', route: '/admin/store/products' },
    { name: 'Categorias', icon: 'category', route: '/admin/store/categories' },
    { name: 'Notícias', icon: 'article', route: '/admin/news' },
    { name: 'Cursos', icon: 'school', route: '/admin/courses' },
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
                _pressed={{ bg: pressedBg }}
              />
            </HStack>

            {/* User Profile Summary */}
            <HStack space={3} alignItems="center" mb={8} bg={profileSummaryBg} p={3} borderRadius="2xl">
              <Avatar bg={themeColors.tint} size="sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <VStack>
                <Text fontWeight="bold" fontSize="sm" color={textColor} numberOfLines={1}>
                  {user?.name || 'Administrador'}
                </Text>
                <Text fontSize="xs" color={inactiveColor} numberOfLines={1}>
                  {user?.email || 'admin@investmais.com'}
                </Text>
              </VStack>
            </HStack>

            <VStack space={2}>
              {menuOptions.map((item) => {
                const isActive = pathname === item.route;
                return (
                  <Pressable 
                    key={item.name} 
                    py={3.5} 
                    px={4}
                    borderRadius="2xl"
                    bg={isActive ? activeBg : 'transparent'}
                    onPress={() => {
                      onClose();
                      router.push(item.route as any);
                    }}
                  >
                    <HStack space={4} alignItems="center">
                      <Box 
                        p={2} 
                        borderRadius="xl" 
                        bg={isActive ? themeColors.tint : 'transparent'}
                      >
                        <Icon 
                          as={<MaterialIcons name={item.icon as any} />} 
                          size={5} 
                          color={isActive ? 'white' : inactiveColor} 
                        />
                      </Box>
                      <Text 
                        fontSize="md" 
                        fontWeight={isActive ? '700' : '600'}
                        color={isActive ? themeColors.tint : textColor}
                      >
                        {item.name}
                      </Text>
                    </HStack>
                  </Pressable>
                );
              })}
            </VStack>

            <VStack mt="auto" space={4}>
                <Divider opacity={0.1} />
                <Pressable 
                  py={3.5} 
                  px={4}
                  borderRadius="2xl"
                  _pressed={{ bg: 'rgba(239, 68, 68, 0.1)' }}
                  onPress={() => router.replace('/(tabs)')}
                >
                  <HStack space={4} alignItems="center">
                    <Box p={2} borderRadius="xl" bg="rgba(239, 68, 68, 0.1)">
                      <Icon as={<MaterialIcons name="logout" />} size={5} color="error.500" />
                    </Box>
                    <Text fontSize="md" color="error.500" fontWeight="700">Sair do Admin</Text>
                  </HStack>
                </Pressable>
            </VStack>
          </VStack>
        </Pressable>
      </Box>
    </Pressable>
  );
};
