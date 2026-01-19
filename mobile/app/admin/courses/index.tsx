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
  Badge
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CourseService } from '@/services/courseService';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminCourses() {
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

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => CourseService.getCourses(),
  });

  const deleteMutation = useMutation({
    mutationFn: CourseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      Alert.alert('Sucesso', 'Curso excluído com sucesso');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao excluir curso');
    },
  });

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o curso "${title}"?`,
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
        <Box 
          p={3} 
          borderRadius="xl" 
          bg="primary.100" 
          _dark={{ bg: 'primary.900:alpha.20' }}
        >
          <Icon as={<MaterialIcons name={item.icon || 'school'} />} size={6} color="primary.600" />
        </Box>
        
        <VStack space={1} flex={1}>
          <Heading size="xs" color={textColor} fontWeight="700" noOfLines={1}>{item.title}</Heading>
          <Text fontSize="2xs" color={secondaryTextColor} fontWeight="600">{item.instructor}</Text>
          <HStack space={2} alignItems="center">
            <Badge colorScheme="blue" variant="subtle" rounded="md" _text={{ fontSize: 10 }}>
              {item.category || 'Geral'}
            </Badge>
            {item.recommended && (
              <Badge colorScheme="success" variant="solid" rounded="md" _text={{ fontSize: 10 }}>
                RECOMENDADO
              </Badge>
            )}
          </HStack>
        </VStack>

        <HStack space={1}>
          <IconButton 
            variant="ghost" 
            _icon={{ as: MaterialIcons, name: 'edit', color: 'coolGray.400' }}
            onPress={() => router.push({ pathname: '/admin/courses/course-form' as any, params: { id: item._id } })}
          />
          <IconButton 
            variant="ghost" 
            _icon={{ as: MaterialIcons, name: 'delete', color: 'error.500' }}
            onPress={() => handleDelete(item._id, item.title)}
          />
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Cursos" onMenuPress={toggleSidebar} />
      <AdminSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <VStack flex={1} p={4} space={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Heading size="md" color={textColor} fontWeight="800">Todos os Cursos</Heading>
            <Text color={secondaryTextColor} fontSize="xs">{courses?.length || 0} cursos cadastrados</Text>
          </VStack>
          <Button 
            leftIcon={<Icon as={MaterialIcons} name="add" size="sm" />}
            onPress={() => router.push('/admin/courses/course-form' as Href)}
            colorScheme="primary"
            borderRadius="xl"
            _text={{ fontWeight: '700' }}
          >
            Novo Curso
          </Button>
        </HStack>

        {isLoading ? (
          <Center flex={1}>
            <Spinner size="lg" color="primary.600" />
          </Center>
        ) : (
          <FlatList 
            data={courses}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Center mt={10}>
                <Icon as={MaterialIcons} name="school" size={12} color="coolGray.300" />
                <Text color="coolGray.400" mt={2} fontWeight="600">Nenhum curso encontrado</Text>
              </Center>
            }
          />
        )}
      </VStack>
    </Box>
  );
}
