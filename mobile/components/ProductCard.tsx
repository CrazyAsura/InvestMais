import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { Box, Text, Button, Icon, HStack, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../types/store';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={{ width: '48%', marginBottom: 16 }}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product._id } } as any)}
    >
      <Box
        bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'}
        shadow={3}
        rounded="2xl"
        width="100%"
        overflow="hidden"
        borderWidth={1}
        borderColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
      >
      <Box height={150} bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} position="relative">
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Center flex={1}>
            <Icon as={MaterialIcons} name="image" size="xl" color={themeColors.icon} />
          </Center>
        )}
        {(product.discount || 0) > 0 && (
          <Box 
            position="absolute" 
            top={2} 
            right={2} 
            bg={themeColors.tint} 
            px={2} 
            py={1} 
            rounded="lg"
          >
            <Text color="white" fontSize="xs" fontWeight="bold">
              -{product.discount}%
            </Text>
          </Box>
        )}
      </Box>
      <VStack p={3} space={1}>
        <Text fontWeight="bold" fontSize="sm" color={themeColors.text} noOfLines={1}>
          {product.name}
        </Text>
        <Text fontSize="xs" color={themeColors.icon} noOfLines={2} height={8}>
          {product.description}
        </Text>
        <HStack justifyContent="space-between" alignItems="center" mt={2}>
          <VStack>
            {(product.discount || 0) > 0 && (
              <Text fontSize="xs" color={themeColors.icon} strikeThrough>
                R$ {(product.price / (1 - (product.discount || 0) / 100)).toFixed(2)}
              </Text>
            )}
            <Text fontWeight="bold" color={themeColors.tint} fontSize="md">
              R$ {product.price.toFixed(2)}
            </Text>
          </VStack>
          <TouchableOpacity onPress={handleAddToCart}>
            <Icon as={MaterialIcons} name="add-shopping-cart" size="sm" color={themeColors.tint} />
          </TouchableOpacity>
        </HStack>
      </VStack>
    </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

import { Center } from 'native-base';
