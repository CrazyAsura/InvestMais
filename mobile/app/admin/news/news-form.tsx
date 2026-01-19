import React, { useState, useEffect } from 'react';
import { Alert, TextInput, ScrollView } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Button, 
  Spinner, 
  Center,
  useColorModeValue,
  FormControl,
  Select,
  CheckIcon,
  Switch,
  Text,
} from 'native-base';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsService } from '@/services/newsService';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminNewsForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');
  const inputBg = useColorModeValue('coolGray.50', '#111827');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    imageUrl: '',
    featured: false,
  });

  const { data: news, isLoading: isLoadingNews } = useQuery({
    queryKey: ['admin-news-item', id],
    queryFn: () => NewsService.getNewsById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        excerpt: news.excerpt || '',
        category: news.category,
        imageUrl: news.imageUrl || '',
        featured: news.featured || false,
      });
    }
  }, [news]);

  const mutation = useMutation({
    mutationFn: (data: any) => id 
      ? NewsService.updateNews(id, data) 
      : NewsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      Alert.alert('Sucesso', `Notícia ${id ? 'atualizada' : 'criada'} com sucesso`);
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao salvar notícia');
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.category) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Título, Conteúdo e Categoria)');
      return;
    }

    mutation.mutate(formData);
  };

  if (id && isLoadingNews) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'coolGray.900' : 'coolGray.50'}>
        <Spinner color="amber.500" size="lg" />
      </Center>
    );
  }

  const categories = ['Investimentos', 'Economia', 'Cripto', 'Bolsa', 'Educação'];

  return (
    <Box flex={1} bg={colorScheme === 'dark' ? 'coolGray.900' : 'coolGray.50'}>
      <AdminHeader title={id ? 'Editar Notícia' : 'Nova Notícia'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack p={4} space={4}>
          <Box bg={cardBg} p={5} borderRadius="2xl" borderWidth={1} borderColor={borderColor} shadow={1}>
            <VStack space={4}>
              <FormControl isRequired>
                <FormControl.Label _text={{ color: textColor, fontWeight: 'bold' }}>Título</FormControl.Label>
                <Box bg={inputBg} borderRadius="xl" px={4} py={3} borderWidth={1} borderColor={borderColor}>
                  <TextInput
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="Título da notícia"
                    placeholderTextColor="gray"
                    style={{ color: textColor }}
                  />
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label _text={{ color: textColor, fontWeight: 'bold' }}>Categoria</FormControl.Label>
                <Select
                  selectedValue={formData.category}
                  minWidth="200"
                  accessibilityLabel="Escolha a categoria"
                  placeholder="Escolha a categoria"
                  _selectedItem={{
                    bg: "amber.600",
                    endIcon: <CheckIcon size="5" />
                  }}
                  mt={1}
                  onValueChange={itemValue => setFormData({ ...formData, category: itemValue })}
                  bg={inputBg}
                  borderRadius="xl"
                  color={textColor}
                  borderColor={borderColor}
                >
                  {categories.map(cat => (
                    <Select.Item key={cat} label={cat} value={cat} />
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ color: textColor, fontWeight: 'bold' }}>Resumo (Opcional)</FormControl.Label>
                <Box bg={inputBg} borderRadius="xl" px={4} py={3} borderWidth={1} borderColor={borderColor}>
                  <TextInput
                    value={formData.excerpt}
                    onChangeText={(text) => setFormData({ ...formData, excerpt: text })}
                    placeholder="Breve resumo da notícia"
                    placeholderTextColor="gray"
                    multiline
                    numberOfLines={2}
                    style={{ color: textColor, textAlignVertical: 'top' }}
                  />
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label _text={{ color: textColor, fontWeight: 'bold' }}>Conteúdo</FormControl.Label>
                <Box bg={inputBg} borderRadius="xl" px={4} py={3} borderWidth={1} borderColor={borderColor}>
                  <TextInput
                    value={formData.content}
                    onChangeText={(text) => setFormData({ ...formData, content: text })}
                    placeholder="Conteúdo completo da notícia"
                    placeholderTextColor="gray"
                    multiline
                    numberOfLines={10}
                    style={{ color: textColor, minHeight: 150, textAlignVertical: 'top' }}
                  />
                </Box>
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ color: textColor, fontWeight: 'bold' }}>URL da Imagem</FormControl.Label>
                <Box bg={inputBg} borderRadius="xl" px={4} py={3} borderWidth={1} borderColor={borderColor}>
                  <TextInput
                    value={formData.imageUrl}
                    onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    placeholderTextColor="gray"
                    style={{ color: textColor }}
                  />
                </Box>
              </FormControl>

              <HStack justifyContent="space-between" alignItems="center" py={2}>
                <VStack>
                  <Text color={textColor} fontWeight="bold">Destaque</Text>
                  <Text color="coolGray.500" fontSize="xs">Aparecerá no carrossel superior</Text>
                </VStack>
                <Switch 
                  isChecked={formData.featured}
                  onToggle={(val) => setFormData({ ...formData, featured: val })}
                  colorScheme="amber"
                />
              </HStack>

              <Button 
                onPress={handleSubmit} 
                isLoading={mutation.isPending}
                colorScheme="amber"
                borderRadius="xl"
                py={3}
                mt={4}
                _text={{ fontWeight: 'bold' }}
              >
                {id ? 'Atualizar Notícia' : 'Publicar Notícia'}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
