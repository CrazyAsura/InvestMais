import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput, Image } from 'react-native';
import { 
  Box, 
  Text, 
  Icon, 
  HStack, 
  VStack, 
  ScrollView, 
  Spinner, 
  Center, 
  Badge,
  IconButton
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { StoreService } from '../../services/storeService';
import { ProductCard } from '../../components/ProductCard';
import { useAppSelector } from '../../store/hooks';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function StoreScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const cartItems = useAppSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { 
    data: products, 
    isLoading: isLoadingProducts, 
    refetch: refetchProducts,
    isRefetching: isRefetchingProducts
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => StoreService.getProducts(selectedCategory),
  });

  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: StoreService.getCategories,
  });

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (b.discount || 0) - (a.discount || 0));

  const discountedProducts = products?.filter(p => (p.discount || 0) > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 5);

  const onRefresh = () => {
    refetchProducts();
  };

  return (
    <Box flex={1} bg={themeColors.background} safeAreaTop>
      {/* Header */}
      <HStack px={4} py={3} justifyContent="space-between" alignItems="center" bg={themeColors.background} borderBottomWidth={1} borderBottomColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
        <VStack>
          <Text fontSize="xl" fontWeight="bold" color={themeColors.tint}>InvestMais Store</Text>
          <Text fontSize="xs" color={themeColors.icon}>Produtos exclusivos para você</Text>
        </VStack>
        <Box>
          <IconButton 
            icon={<Icon as={MaterialIcons} name="shopping-cart" size="md" color={themeColors.tint} />}
            onPress={() => router.push('/cart')}
            _pressed={{ bg: themeColors.tint, opacity: 0.1 }}
          />
          {cartCount > 0 && (
            <Badge 
              bg={themeColors.tint}
              rounded="full" 
              mb={-4} 
              mr={-4} 
              zIndex={1} 
              variant="solid" 
              alignSelf="flex-end"
              _text={{ fontSize: 'xs', color: 'white' }}
              position="absolute"
              top={0}
              right={0}
            >
              {cartCount}
            </Badge>
          )}
        </Box>
      </HStack>

      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={isRefetchingProducts} onRefresh={onRefresh} tintColor={themeColors.tint} />
        }
      >
        {/* Search */}
        <Box px={4} py={3}>
          <HStack 
            bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} 
            borderRadius="xl" 
            px={3} 
            alignItems="center" 
            height={12}
          >
            <Icon as={MaterialIcons} name="search" size="sm" color={themeColors.icon} mr={2} />
            <TextInput
              placeholder="Buscar produtos..."
              value={search}
              onChangeText={setSearch}
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholderTextColor={themeColors.icon}
            />
          </HStack>
        </Box>

        {/* Discount Carousel */}
        {discountedProducts && discountedProducts.length > 0 && !search && (
          <Box mb={6}>
            <HStack px={4} mb={3} justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" fontWeight="bold" color={themeColors.text}>Ofertas Imperdíveis</Text>
              <Badge bg={themeColors.tint} _text={{ color: 'white' }} variant="solid" rounded="md">Até 50% OFF</Badge>
            </HStack>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {discountedProducts.map((product) => (
                <TouchableOpacity 
                  key={`featured-${product._id}`}
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: '/product/[id]', params: { id: product._id } } as any)}
                >
                  <Box 
                    width={280} 
                    mr={4} 
                    bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'} 
                    rounded="2xl" 
                    overflow="hidden" 
                    shadow={3}
                    borderWidth={1}
                    borderColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
                  >
                    <Box height={160} bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} position="relative">
                      {product.imageUrl ? (
                        <Image 
                          source={{ uri: product.imageUrl }} 
                          style={{ width: '100%', height: '100%' }} 
                          resizeMode="cover" 
                        />
                      ) : (
                        <Center flex={1}>
                          <Icon as={MaterialIcons} name="image" size="4xl" color={themeColors.icon} />
                        </Center>
                      )}
                      <Box 
                        position="absolute" 
                        top={3} 
                        right={3} 
                        bg={themeColors.tint} 
                        px={2} 
                        py={1} 
                        rounded="lg"
                      >
                        <Text color="white" fontSize="xs" fontWeight="bold">-{product.discount || 0}%</Text>
                      </Box>
                    </Box>
                    <VStack p={4} space={1}>
                      <Text fontWeight="bold" fontSize="md" color={themeColors.text} noOfLines={1}>{product.name}</Text>
                      <HStack alignItems="center" space={2}>
                        <Text fontSize="sm" color={themeColors.icon} strikeThrough>
                          R$ {(product.price / (1 - (product.discount || 0) / 100)).toFixed(2)}
                        </Text>
                        <Text fontWeight="bold" color={themeColors.tint} fontSize="xl">
                          R$ {product.price.toFixed(2)}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Box>
        )}

        {/* Categories */}
        <Box mb={6}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <TouchableOpacity 
              onPress={() => setSelectedCategory(undefined)}
              style={[
                styles.categoryItem, 
                !selectedCategory ? { backgroundColor: themeColors.tint, borderColor: themeColors.tint } : { backgroundColor: colorScheme === 'dark' ? '#1f2937' : 'white', borderColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb' }
              ]}
            >
              <Text color={!selectedCategory ? "white" : themeColors.text} fontWeight="medium">Todos</Text>
            </TouchableOpacity>
            
            {categories?.map((category) => (
              <TouchableOpacity 
                key={category._id}
                onPress={() => setSelectedCategory(category._id)}
                style={[
                  styles.categoryItem, 
                  selectedCategory === category._id ? { backgroundColor: themeColors.tint, borderColor: themeColors.tint } : { backgroundColor: colorScheme === 'dark' ? '#1f2937' : 'white', borderColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb' }
                ]}
              >
                <HStack space={2} alignItems="center">
                  {category.imageUrl && (
                    <Image 
                      source={{ uri: category.imageUrl }} 
                      style={{ width: 20, height: 20, borderRadius: 10 }} 
                    />
                  )}
                  <Text color={selectedCategory === category._id ? "white" : themeColors.text} fontWeight="medium">
                    {category.name}
                  </Text>
                </HStack>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Box>

        {/* Product List */}
        {isLoadingProducts && !isRefetchingProducts ? (
          <Center py={20}>
            <Spinner size="lg" color={themeColors.tint} />
            <Text mt={2} color={themeColors.icon}>Carregando produtos...</Text>
          </Center>
        ) : (
          <Box px={4} pb={10}>
            <HStack flexWrap="wrap" justifyContent="space-between">
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <Center w="100%" py={20}>
                  <Icon as={MaterialIcons} name="search-off" size="5xl" color={themeColors.icon} />
                  <Text color={themeColors.icon} mt={2}>Nenhum produto encontrado</Text>
                </Center>
              )}
            </HStack>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
  },
});
