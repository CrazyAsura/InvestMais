import React, { useState, useEffect } from 'react';
import { Alert, TextInput } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Spinner, 
  Center,
  useColorModeValue,
  FormControl,
  Switch,
  ScrollView,
} from 'native-base';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StoreService } from '@/services/storeService';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminCategoryForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
    imageUrl: '',
  });

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ['admin-category', id],
    queryFn: () => StoreService.getCategories().then(cats => cats.find(c => c._id === id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        active: category.active !== false,
        imageUrl: category.imageUrl || '',
      });
    }
  }, [category]);

  const mutation = useMutation({
    mutationFn: (data: any) => id 
      ? StoreService.updateCategory(id, data) 
      : StoreService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      Alert.alert('Sucesso', `Categoria ${id ? 'atualizada' : 'criada'} com sucesso`);
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao salvar categoria');
    },
  });

  const handleSubmit = () => {
    if (!formData.name) {
      Alert.alert('Erro', 'O nome da categoria é obrigatório');
      return;
    }
    mutation.mutate(formData);
  };

  if (id && isLoadingCategory) {
    return (
      <Center flex={1}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title={id ? 'Editar Categoria' : 'Nova Categoria'} onBackPress={() => router.back()} />
      
      <ScrollView p={4} showsVerticalScrollIndicator={false}>
        <VStack space={6} bg={cardBg} p={5} borderRadius="3xl" shadow={1} borderWidth={1} borderColor={borderColor}>
          <FormControl isRequired>
            <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>Nome</FormControl.Label>
            <Box 
              bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'} 
              borderRadius="xl" 
              px={3} 
              py={2}
              borderWidth={1}
              borderColor={borderColor}
            >
              <TextInput
                placeholder="Ex: Eletrônicos"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={{ color: textColor, fontSize: 16 }}
                placeholderTextColor="#9ca3af"
              />
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>Descrição</FormControl.Label>
            <Box 
              bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'} 
              borderRadius="xl" 
              px={3} 
              py={2}
              borderWidth={1}
              borderColor={borderColor}
            >
              <TextInput
                placeholder="Descrição opcional..."
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
                style={{ color: textColor, fontSize: 16, textAlignVertical: 'top', height: 80 }}
                placeholderTextColor="#9ca3af"
              />
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>URL da Imagem</FormControl.Label>
            <Box 
              bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'} 
              borderRadius="xl" 
              px={3} 
              py={2}
              borderWidth={1}
              borderColor={borderColor}
            >
              <TextInput
                placeholder="https://exemplo.com/imagem.png"
                value={formData.imageUrl}
                onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                style={{ color: textColor, fontSize: 16 }}
                placeholderTextColor="#9ca3af"
              />
            </Box>
          </FormControl>

          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text color={textColor} fontWeight="700">Categoria Ativa</Text>
              <Text color={secondaryTextColor} fontSize="xs">Define se a categoria aparece na loja</Text>
            </VStack>
            <Switch 
              isChecked={formData.active} 
              onToggle={(val) => setFormData({ ...formData, active: val })}
              colorScheme="primary"
            />
          </HStack>

          <Button 
            onPress={handleSubmit} 
            isLoading={mutation.isPending}
            borderRadius="xl"
            size="lg"
            mt={4}
          >
            {id ? 'Atualizar Categoria' : 'Criar Categoria'}
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
