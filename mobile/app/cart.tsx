import React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  IconButton, 
  Icon, 
  Button, 
  Divider, 
  Center,
  Heading
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CartScreen() {
  const cartItems = useAppSelector(state => state.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    // Placeholder for checkout logic
    alert('Funcionalidade de checkout em breve!');
  };

  if (cartItems.length === 0) {
    return (
      <Box flex={1} bg={themeColors.background} safeArea>
        <HStack p={4} alignItems="center" bg={themeColors.background}>
          <IconButton 
            icon={<Icon as={MaterialIcons} name="arrow-back" color={themeColors.text} />} 
            onPress={() => router.back()} 
            _pressed={{ bg: themeColors.tint, opacity: 0.1 }}
          />
          <Heading size="md" ml={2} color={themeColors.text}>Meu Carrinho</Heading>
        </HStack>
        <Center flex={1} p={10}>
          <Icon as={MaterialIcons} name="shopping-basket" size="8xl" color={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} />
          <Text fontSize="xl" fontWeight="bold" mt={4} color={themeColors.text}>Seu carrinho está vazio</Text>
          <Text textAlign="center" color={themeColors.icon} mt={2}>
            Parece que você ainda não adicionou nenhum produto ao seu carrinho.
          </Text>
          <Button 
            mt={8} 
            bg={themeColors.tint}
            _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
            onPress={() => router.back()}
            borderRadius="xl"
            px={8}
            _text={{ fontWeight: 'bold' }}
          >
            Começar a comprar
          </Button>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={colorScheme === 'dark' ? 'black' : 'coolGray.50'} safeArea>
      {/* Header */}
      <HStack p={4} alignItems="center" bg={themeColors.background} borderBottomWidth={1} borderBottomColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
        <IconButton 
          icon={<Icon as={MaterialIcons} name="arrow-back" color={themeColors.text} />} 
          onPress={() => router.back()} 
          _pressed={{ bg: themeColors.tint, opacity: 0.1 }}
        />
        <Heading size="md" ml={2} color={themeColors.text}>Meu Carrinho ({cartItems.length})</Heading>
        <Button 
          variant="ghost" 
          colorScheme="danger" 
          ml="auto" 
          onPress={() => dispatch(clearCart())}
          _text={{ fontSize: 'xs' }}
        >
          Limpar
        </Button>
      </HStack>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <Box bg={themeColors.background} p={4} mb={2} borderBottomWidth={1} borderBottomColor={colorScheme === 'dark' ? 'coolGray.900' : 'coolGray.100'}>
            <HStack space={4}>
              <Box width={100} height={100} bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} borderRadius="xl" overflow="hidden">
                {item.product.imageUrl ? (
                  <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
                ) : (
                  <Center flex={1}>
                    <Icon as={MaterialIcons} name="image" size="lg" color={themeColors.icon} />
                  </Center>
                )}
              </Box>
              <VStack flex={1} justifyContent="space-between" py={1}>
                <VStack>
                  <HStack justifyContent="space-between" alignItems="flex-start">
                    <Text fontWeight="bold" fontSize="md" color={themeColors.text} noOfLines={1} flex={1}>
                      {item.product.name}
                    </Text>
                    <IconButton 
                      icon={<Icon as={MaterialIcons} name="delete-outline" size="sm" color="danger.500" />} 
                      onPress={() => handleRemove(item.product._id)}
                      p={1}
                      _pressed={{ bg: 'danger.50', opacity: 0.2 }}
                    />
                  </HStack>
                  <Text color={themeColors.tint} fontWeight="bold" fontSize="lg">
                    R$ {item.product.price.toFixed(2)}
                  </Text>
                </VStack>
                <HStack alignItems="center" space={4}>
                  <HStack alignItems="center" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} borderRadius="lg" p={1}>
                    <IconButton 
                      icon={<Icon as={MaterialIcons} name="remove" size="xs" color={themeColors.text} />} 
                      onPress={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      p={1}
                      isDisabled={item.quantity <= 1}
                    />
                    <Text fontWeight="bold" width={8} textAlign="center" color={themeColors.text}>{item.quantity}</Text>
                    <IconButton 
                      icon={<Icon as={MaterialIcons} name="add" size="xs" color={themeColors.text} />} 
                      onPress={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      p={1}
                    />
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        )}
        contentContainerStyle={{ paddingBottom: 180 }}
      />

      {/* Footer / Summary */}
      <Box 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0} 
        bg={themeColors.background} 
        p={6} 
        shadow={9}
        borderTopRadius="3xl"
        borderTopWidth={1}
        borderColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
      >
        <VStack space={4}>
          <VStack space={2}>
            <HStack justifyContent="space-between">
              <Text color={themeColors.icon}>Subtotal</Text>
              <Text fontWeight="medium" color={themeColors.text}>R$ {total.toFixed(2)}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="xl" fontWeight="bold" color={themeColors.text}>Total</Text>
              <Text fontSize="xl" fontWeight="bold" color={themeColors.tint}>
                R$ {total.toFixed(2)}
              </Text>
            </HStack>
          </VStack>
          <Button 
            bg={themeColors.tint}
            _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
            size="lg" 
            borderRadius="2xl"
            onPress={handleCheckout}
            _text={{ fontWeight: 'bold', fontSize: 'lg' }}
          >
            Finalizar Compra
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
