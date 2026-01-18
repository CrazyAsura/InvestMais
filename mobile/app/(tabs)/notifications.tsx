import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Button, 
  Badge, 
  Spinner, 
  Pressable,
  useColorModeValue,
  Center,
  Heading
} from 'native-base';
import { FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '@/services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
}

export default function UserNotifications() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'coolGray.800');

  const fetchMyNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/my');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'success.500';
      case 'warning': return 'warning.500';
      case 'error': return 'error.500';
      default: return 'info.500';
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable onPress={() => markAsRead(item._id)}>
      <Box 
        bg={cardBg} 
        p={4} 
        mb={3} 
        borderRadius="xl" 
        shadow={item.isRead ? 0 : 2}
        borderLeftWidth={4}
        borderLeftColor={getTypeColor(item.type)}
        opacity={item.isRead ? 0.7 : 1}
      >
        <VStack space={1}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontWeight={item.isRead ? "medium" : "bold"} fontSize="md" color={themeColors.text}>
              {item.title}
            </Text>
            {!item.isRead && <Box w={2} h={2} borderRadius="full" bg="error.500" />}
          </HStack>
          <Text color={themeColors.text} fontSize="sm">{item.message}</Text>
          <Text fontSize="xs" color="coolGray.400" mt={2}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );

  return (
    <Box flex={1} bg={themeColors.background}>
      <VStack p={4} space={4} flex={1}>
        <Heading size="md" color={themeColors.text} mb={2}>Minhas Notificações</Heading>
        
        {loading ? (
          <Center flex={1}>
            <Spinner size="lg" color={themeColors.tint} />
          </Center>
        ) : (
          <FlatList 
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Center mt={10}>
                <Icon as={<MaterialIcons name="notifications-none" />} size={12} color="coolGray.300" />
                <Text color="coolGray.500" mt={2}>Você não tem notificações</Text>
              </Center>
            }
          />
        )}
      </VStack>
    </Box>
  );
}
