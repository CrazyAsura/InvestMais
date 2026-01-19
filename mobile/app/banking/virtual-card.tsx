import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  Heading, 
  Text, 
  Box, 
  HStack, 
  Icon, 
  Circle, 
  Pressable, 
  ScrollView, 
  Button, 
  useToast,
  Spinner,
  Badge,
  Divider,
  Center,
  Actionsheet,
  useDisclose,
  AlertDialog
} from 'native-base';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, CardData, CardStatus, CardType, CardClass } from '@/services/bankingService';
import * as Clipboard from 'expo-clipboard';

export default function VirtualCardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const toast = useToast();
  
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclose();
  const [cardToDelete, setCardToDelete] = useState<CardData | null>(null);
  const cancelRef = React.useRef(null);

  useEffect(() => {
    fetchVirtualCards();
  }, []);

  const fetchVirtualCards = async () => {
    setIsLoading(true);
    try {
      const allCards = await bankingService.getCards();
      const virtualCards = allCards.filter(card => card.isVirtual);
      setCards(virtualCards);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar cartões virtuais",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVirtualCard = async () => {
    setIsCreating(true);
    try {
      // Get user name from existing card or just use a default for now
      // In a real app, we might get this from the auth profile
      const allCards = await bankingService.getCards();
      const holderName = allCards.length > 0 ? allCards[0].holderName : "USUÁRIO INVESTMAIS";

      await bankingService.createCard({
        holderName,
        type: CardType.CREDIT,
        class: CardClass.STANDARD,
        brand: 'Visa',
        isVirtual: true,
        creditLimit: 5000 // Default limit for virtual card
      });
      
      toast.show({
        description: "Cartão virtual gerado com sucesso!",
        bg: "success.500"
      });
      fetchVirtualCards();
    } catch (error) {
      toast.show({
        description: "Erro ao gerar cartão virtual",
        bg: "error.500"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleDetails = (cardId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    toast.show({
      description: `${label} copiado!`,
      bg: "success.500",
      duration: 2000
    });
  };

  const handleToggleBlock = async (card: CardData) => {
    try {
      if (card.status === CardStatus.ACTIVE) {
        await bankingService.blockCard(card._id!);
        toast.show({ description: "Cartão bloqueado", bg: "warning.500" });
      } else {
        await bankingService.unblockCard(card._id!);
        toast.show({ description: "Cartão desbloqueado", bg: "success.500" });
      }
      fetchVirtualCards();
    } catch (error) {
      toast.show({ description: "Erro ao alterar status", bg: "error.500" });
    }
  };

  const handleDeleteCard = async () => {
    if (!cardToDelete) return;
    try {
      await bankingService.deleteCard(cardToDelete._id!);
      toast.show({ description: "Cartão virtual excluído", bg: "success.500" });
      onDeleteClose();
      fetchVirtualCards();
    } catch (error) {
      toast.show({ description: "Erro ao excluir cartão", bg: "error.500" });
    }
  };

  const renderVirtualCard = (card: CardData) => {
    const isShowing = showDetails[card._id!];
    
    return (
      <VStack key={card._id} space={4} mb={8}>
        <Box 
          bg="coolGray.800" 
          p={6} 
          rounded="2xl" 
          h={56} 
          justifyContent="space-between"
          shadow={9}
          position="relative"
          overflow="hidden"
        >
          {/* Card Pattern/Decoration */}
          <Box 
            position="absolute" 
            top={-20} 
            right={-20} 
            w={40} 
            h={40} 
            bg="teal.500" 
            opacity={0.1} 
            rounded="full" 
          />
          
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text color="white" fontWeight="bold" fontSize="md">Cartão Virtual</Text>
              <Text color="teal.400" fontSize="xs" fontWeight="bold">{card.brand.toUpperCase()}</Text>
            </VStack>
            <Icon as={<MaterialCommunityIcons name="chip" />} size={10} color="yellow.500" />
          </HStack>

          <VStack space={1}>
            <HStack alignItems="center" space={2}>
              <Text color="white" fontSize="2xl" letterSpacing={4} fontWeight="medium">
                {isShowing ? card.cardNumber.replace(/(\d{4})/g, '$1 ').trim() : `**** **** **** ${card.cardNumber.slice(-4)}`}
              </Text>
              {isShowing && (
                <Pressable onPress={() => copyToClipboard(card.cardNumber, "Número do cartão")}>
                  <Icon as={<MaterialIcons name="content-copy" />} size={5} color="teal.400" />
                </Pressable>
              )}
            </HStack>
            
            <HStack space={8}>
              <VStack>
                <Text color="white" opacity={0.6} fontSize="xs">VALIDADE</Text>
                <Text color="white" fontSize="md">{card.expirationDate}</Text>
              </VStack>
              <VStack>
                <Text color="white" opacity={0.6} fontSize="xs">CVV</Text>
                <HStack alignItems="center" space={2}>
                  <Text color="white" fontSize="md">{isShowing ? card.cvv : '***'}</Text>
                  {isShowing && (
                    <Pressable onPress={() => copyToClipboard(card.cvv, "CVV")}>
                      <Icon as={<MaterialIcons name="content-copy" />} size={4} color="teal.400" />
                    </Pressable>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </VStack>

          <HStack justifyContent="space-between" alignItems="flex-end">
            <Text color="white" fontWeight="medium" fontSize="sm">{card.holderName.toUpperCase()}</Text>
            <Icon as={<FontAwesome name="cc-visa" />} size={12} color="white" />
          </HStack>

          {card.status === CardStatus.BLOCKED && (
            <Center position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(0,0,0,0.6)">
              <Icon as={<MaterialIcons name="lock" />} size={12} color="white" />
              <Text color="white" fontWeight="bold" fontSize="lg">BLOQUEADO</Text>
            </Center>
          )}
        </Box>

        <HStack justifyContent="space-around" bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={2} rounded="xl" shadow={1}>
          <Pressable onPress={() => toggleDetails(card._id!)} flex={1}>
            <VStack alignItems="center" space={1}>
              <Circle size="10" bg="teal.100">
                <Icon as={<MaterialIcons name={isShowing ? "visibility-off" : "visibility"} />} size={5} color="teal.600" />
              </Circle>
              <Text fontSize="xs" color={themeColors.text}>{isShowing ? "Ocultar" : "Dados"}</Text>
            </VStack>
          </Pressable>

          <Pressable onPress={() => handleToggleBlock(card)} flex={1}>
            <VStack alignItems="center" space={1}>
              <Circle size="10" bg={card.status === CardStatus.ACTIVE ? "orange.100" : "green.100"}>
                <Icon as={<MaterialIcons name={card.status === CardStatus.ACTIVE ? "lock" : "lock-open"} />} size={5} color={card.status === CardStatus.ACTIVE ? "orange.600" : "green.600"} />
              </Circle>
              <Text fontSize="xs" color={themeColors.text}>{card.status === CardStatus.ACTIVE ? "Bloquear" : "Ativar"}</Text>
            </VStack>
          </Pressable>

          <Pressable 
            onPress={() => {
              setCardToDelete(card);
              onDeleteOpen();
            }} 
            flex={1}
          >
            <VStack alignItems="center" space={1}>
              <Circle size="10" bg="red.100">
                <Icon as={<MaterialIcons name="delete-outline" />} size={5} color="red.600" />
              </Circle>
              <Text fontSize="xs" color={themeColors.text}>Excluir</Text>
            </VStack>
          </Pressable>
        </HStack>
      </VStack>
    );
  };

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <VStack>
          <Heading color={themeColors.text}>Cartão Virtual</Heading>
          <Text color={themeColors.icon}>Use para compras online com mais segurança</Text>
        </VStack>

        {isLoading ? (
          <Center h={40}>
            <Spinner color={themeColors.tint} size="lg" />
          </Center>
        ) : cards.length > 0 ? (
          <VStack>
            {cards.map(renderVirtualCard)}
            <Button 
              onPress={handleCreateVirtualCard} 
              isLoading={isCreating}
              variant="outline"
              colorScheme="teal"
              rounded="xl"
              leftIcon={<Icon as={<MaterialIcons name="add" />} size="sm" />}
            >
              Gerar novo cartão virtual
            </Button>
          </VStack>
        ) : (
          <Center h={64} bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} rounded="2xl" borderStyle="dashed" borderWidth={1} borderColor={themeColors.icon} p={6}>
            <Circle size="20" bg="teal.100" mb={4}>
              <Icon as={<MaterialCommunityIcons name="credit-card-plus" />} size={10} color="teal.600" />
            </Circle>
            <Heading size="sm" color={themeColors.text} textAlign="center">Você ainda não tem um cartão virtual</Heading>
            <Text color={themeColors.icon} textAlign="center" mt={2} mb={6}>
              O cartão virtual é ideal para compras na internet e aplicativos, protegendo seu cartão físico.
            </Text>
            <Button 
              onPress={handleCreateVirtualCard} 
              isLoading={isCreating}
              bg={themeColors.tint}
              rounded="xl"
              px={8}
            >
              Gerar meu cartão virtual
            </Button>
          </Center>
        )}

        <Box bg="info.100" p={4} rounded="xl" _text={{ color: "info.800", fontSize: "xs" }}>
          <HStack space={2} alignItems="flex-start">
            <Icon as={<MaterialIcons name="info" />} size={5} color="info.600" />
            <VStack flex={1}>
              <Text fontWeight="bold" color="info.800">Dica de segurança</Text>
              <Text fontSize="xs" color="info.700">
                Você pode excluir seu cartão virtual a qualquer momento e gerar um novo se suspeitar de qualquer atividade irregular.
              </Text>
            </VStack>
          </HStack>
        </Box>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Excluir Cartão Virtual</AlertDialog.Header>
          <AlertDialog.Body>
            Tem certeza que deseja excluir este cartão virtual? Você não poderá mais realizar compras com este número.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onDeleteClose} ref={cancelRef}>
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={handleDeleteCard}>
                Excluir
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </ScrollView>
  );
}
