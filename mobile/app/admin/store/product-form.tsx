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
} from 'native-base';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StoreService } from '@/services/storeService';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminProductForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: '',
    discount: '0',
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => StoreService.getProduct(id!),
    enabled: !!id,
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: StoreService.getCategories,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        imageUrl: product.imageUrl || '',
        category: typeof product.category === 'object' ? (product.category as any)._id : product.category,
        stock: product.stock.toString(),
        discount: (product.discount || 0).toString(),
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (data: any) => id 
      ? StoreService.updateProduct(id, data) 
      : StoreService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      Alert.alert('Sucesso', `Produto ${id ? 'atualizado' : 'criado'} com sucesso`);
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao salvar produto');
    },
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discount: parseFloat(formData.discount || '0'),
    };

    mutation.mutate(payload);
  };

  if (id && isLoadingProduct) {
    return (
      <Center flex={1}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title={id ? 'Editar Produto' : 'Novo Produto'} onBackPress={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack p={4} space={6}>
          <VStack space={5} bg={cardBg} p={5} borderRadius="3xl" shadow={1} borderWidth={1} borderColor={borderColor}>
            <FormControl isRequired>
              <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>Nome do Produto</FormControl.Label>
              <Box 
                bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'} 
                borderRadius="xl" 
                px={3} 
                py={2}
                borderWidth={1}
                borderColor={borderColor}
              >
                <TextInput
                  placeholder="Ex: Smartphone XYZ"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  style={{ color: textColor, fontSize: 16 }}
                  placeholderTextColor="#9ca3af"
                />
              </Box>
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>Categoria</FormControl.Label>
              <Select
                selectedValue={formData.category}
                minWidth="200"
                accessibilityLabel="Escolha a categoria"
                placeholder="Escolha a categoria"
                _selectedItem={{
                  bg: "primary.600",
                  endIcon: <CheckIcon size="5" color="white" />,
                }}
                mt={1}
                onValueChange={(itemValue) => setFormData({ ...formData, category: itemValue })}
                borderRadius="xl"
                bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'}
                borderColor={borderColor}
                color={textColor}
              >
                {categories?.map((cat) => (
                  <Select.Item key={cat._id} label={cat.name} value={cat._id} />
                ))}
              </Select>
            </FormControl>

            <HStack space={4}>
              <FormControl isRequired flex={1}>
                <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>Preço (R$)</FormControl.Label>
                <Box 
                  bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'} 
                  borderRadius="xl" 
                  px={3} 
                  py={2}
                  borderWidth={1}
                  borderColor={borderColor}
                >
                  <TextInput
                    placeholder="0.00"
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                    keyboardType="numeric"
                    style={{ color: textColor, fontSize: 16 }}
                    placeholderTextColor="#9ca3af"
                  />
                </Box>
              </FormControl>

              <FormControl flex={1}>
                <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>Desconto (%)</FormControl.Label>
                <Box 
                  bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'} 
                  borderRadius="xl" 
                  px={3} 
                  py={2}
                  borderWidth={1}
                  borderColor={borderColor}
                >
                  <TextInput
                    placeholder="0"
                    value={formData.discount}
                    onChangeText={(text) => setFormData({ ...formData, discount: text })}
                    keyboardType="numeric"
                    style={{ color: textColor, fontSize: 16 }}
                    placeholderTextColor="#9ca3af"
                  />
                </Box>
              </FormControl>
            </HStack>

            <FormControl isRequired>
              <FormControl.Label _text={{ color: textColor, fontWeight: '700' }}>Estoque</FormControl.Label>
              <Box 
                bg={colorScheme === 'light' ? 'coolGray.50' : 'coolGray.800'} 
                borderRadius="xl" 
                px={3} 
                py={2}
                borderWidth={1}
                borderColor={borderColor}
              >
                <TextInput
                  placeholder="0"
                  value={formData.stock}
                  onChangeText={(text) => setFormData({ ...formData, stock: text })}
                  keyboardType="numeric"
                  style={{ color: textColor, fontSize: 16 }}
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
                  placeholder="Detalhes do produto..."
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={4}
                  style={{ color: textColor, fontSize: 16, textAlignVertical: 'top', height: 100 }}
                  placeholderTextColor="#9ca3af"
                />
              </Box>
            </FormControl>

            <Button 
              onPress={handleSubmit} 
              isLoading={mutation.isPending}
              borderRadius="xl"
              size="lg"
              mt={4}
            >
              {id ? 'Atualizar Produto' : 'Criar Produto'}
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
