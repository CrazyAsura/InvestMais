import React, { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  IconButton, 
  Button, 
  Spinner, 
  Center,
  useColorModeValue,
  Avatar,
  Badge
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsService } from '@/services/newsService';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminNews() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { data: news, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => NewsService.getNews(),
  });

  const deleteMutation = useMutation({
    mutationFn: NewsService.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      Alert.alert('Sucesso', 'Notícia excluída com sucesso');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao excluir notícia');
    },
  });

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a notícia "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id)
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <Box 
      bg={cardBg} 
      p={4} 
      borderRadius="2xl" 
      mb={3} 
      borderWidth={1} 
      borderColor={borderColor}
      shadow={1}
    >
      <HStack space={3} alignItems="center">
        <Avatar 
          source={{ uri: item.imageUrl }} 
          size="lg" 
          borderRadius="xl"
          bg="gray.200"
        >
          {item.title.charAt(0)}
        </Avatar>
        
        <VStack space={1} flex={1}>
          <Heading size="xs" color={textColor} fontWeight="700" noOfLines={1}>{item.title}</Heading>
          <HStack space={2} alignItems="center">
            <Badge colorScheme="amber" variant="subtle" rounded="md" _text={{ fontSize: 10 }}>
              {item.category}
            </Badge>
            {item.featured && (
              <Badge colorScheme="orange" variant="solid" rounded="md" _text={{ fontSize: 10 }}>
                DESTAQUE
              </Badge>
            )}
          </HStack>
          <Text color={secondaryTextColor} fontSize="xs">
            {item.likes?.length || 0} likes • {item.comments?.length || 0} comentários
          </Text>
        </VStack>

        <HStack space={1}>
          <IconButton 
            icon={<Icon as={MaterialIcons} name="edit" size="sm" color="blue.500" />}
            onPress={() => router.push(`/admin/news/news-form?id=${item._id}` as any)}
            variant="ghost"
            _pressed={{ bg: 'blue.50' }}
          />
          <IconButton 
            icon={<Icon as={MaterialIcons} name="delete" size="sm" color="red.500" />}
            onPress={() => handleDelete(item._id, item.title)}
            variant="ghost"
            _pressed={{ bg: 'red.50' }}
          />
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1} bg={colorScheme === 'dark' ? 'coolGray.900' : 'coolGray.50'}>
      <AdminHeader onMenuPress={toggleSidebar} title="Gerenciar Notícias" />
      <AdminSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} activePage="news" />

      <VStack flex={1} p={4} space={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="md" color={textColor}>Notícias</Heading>
          <Button 
            leftIcon={<Icon as={MaterialIcons} name="add" size="sm" />}
            onPress={() => router.push('/admin/news/news-form' as any)}
            colorScheme="amber"
            borderRadius="xl"
          >
            Nova Notícia
          </Button>
        </HStack>

        {isLoading ? (
          <Center flex={1}>
            <Spinner color="amber.500" size="lg" />
          </Center>
        ) : (
          <FlatList 
            data={news}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Center py={10}>
                <Icon as={MaterialIcons} name="article" size="xl" color="coolGray.300" />
                <Text color="coolGray.400" mt={2}>Nenhuma notícia cadastrada</Text>
              </Center>
            }
          />
        )}
      </VStack>
    </Box>
  );
}
