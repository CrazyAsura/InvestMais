import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  IconButton, 
  Icon, 
  Button, 
  Spinner, 
  Center,
  Heading,
  Badge,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { StoreService } from '../../services/storeService';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => StoreService.getProduct(id),
  });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      // Use toast instead of alert for better UI if possible, but keeping it simple for now
    }
  };

  if (isLoading) {
    return (
      <Center flex={1} bg={themeColors.background}>
        <Spinner size="lg" color={themeColors.tint} />
      </Center>
    );
  }

  if (!product) {
    return (
      <Center flex={1} bg={themeColors.background}>
        <Text color={themeColors.text}>Produto não encontrado</Text>
        <Button mt={4} onPress={() => router.back()} bg={themeColors.tint}>Voltar</Button>
      </Center>
    );
  }

  return (
    <Box flex={1} bg={themeColors.background} safeArea>
      <HStack p={4} alignItems="center" bg={themeColors.background} borderBottomWidth={1} borderBottomColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
        <IconButton 
          icon={<Icon as={MaterialIcons} name="arrow-back" color={themeColors.text} />} 
          onPress={() => router.back()} 
          _pressed={{ bg: themeColors.tint, opacity: 0.1 }}
        />
        <Heading size="md" ml={2} color={themeColors.text}>Detalhes do Produto</Heading>
      </HStack>

      <ScrollView>
        <Box height={350} bg={colorScheme === 'dark' ? 'coolGray.800' : 'gray.50'}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
          ) : (
            <Center flex={1}>
              <Icon as={MaterialIcons} name="image" size="6xl" color={themeColors.icon} />
            </Center>
          )}
        </Box>

        <VStack p={6} space={4}>
          <VStack space={1}>
            <Heading size="lg" color={themeColors.text}>{product.name}</Heading>
            <HStack space={2} alignItems="center" justifyContent="space-between">
              <VStack>
                {(product.discount || 0) > 0 && (
                  <Text fontSize="md" color={themeColors.icon} strikeThrough>
                    R$ {(product.price / (1 - (product.discount || 0) / 100)).toFixed(2)}
                  </Text>
                )}
                <Text fontSize="3xl" fontWeight="bold" color={themeColors.tint}>
                  R$ {product.price.toFixed(2)}
                </Text>
              </VStack>
              {product.stock <= 5 && product.stock > 0 && (
                <Badge bg="orange.500" _text={{ color: 'white' }} variant="solid" rounded="lg">
                  Apenas {product.stock} restantes!
                </Badge>
              )}
            </HStack>
          </VStack>

          <Divider bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} />

          <VStack space={2}>
            <Text fontWeight="bold" fontSize="md" color={themeColors.text}>Descrição</Text>
            <Text color={themeColors.icon} lineHeight="md" fontSize="md">
              {product.description || 'Nenhuma descrição disponível para este produto.'}
            </Text>
          </VStack>

          <Divider bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} />

          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text color={themeColors.icon} fontSize="sm">Categoria</Text>
              <Text fontWeight="bold" color={themeColors.text} fontSize="md">
                {typeof product.category === 'object' ? product.category.name : 'Geral'}
              </Text>
            </VStack>
            <VStack alignItems="flex-end">
              <Text color={themeColors.icon} fontSize="sm">Disponibilidade</Text>
              <Text fontWeight="bold" color={product.stock > 0 ? "success.600" : "danger.600"} fontSize="md">
                {product.stock > 0 ? 'Em estoque' : 'Esgotado'}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </ScrollView>

      <Box p={6} bg={themeColors.background} borderTopWidth={1} borderColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} shadow={9}>
        <Button 
          size="lg" 
          bg={themeColors.tint}
          _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
          borderRadius="2xl"
          onPress={handleAddToCart}
          isDisabled={product.stock <= 0}
          _text={{ fontWeight: 'bold', fontSize: 'lg' }}
          leftIcon={<Icon as={MaterialIcons} name="add-shopping-cart" size="sm" color="white" />}
        >
          {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </Button>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

import { Divider } from 'native-base';
