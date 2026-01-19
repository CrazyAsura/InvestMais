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
  Actionsheet, 
  useDisclose, 
  Button, 
  useToast,
  Spinner,
  Badge,
  Divider,
  Select,
  FormControl,
  Slider,
  AlertDialog,
  Center
} from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, CardData, CardType, CardClass, CardStatus } from '@/services/bankingService';
import { FormInput } from '@/components/ui/form-input';

export default function CardsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclose();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclose();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclose();
  
  const toast = useToast();
  const router = useRouter();
  
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // New Card Form State
  const [newCard, setNewCard] = useState({
    holderName: '',
    type: CardType.DEBIT,
    class: CardClass.STANDARD,
    brand: 'Visa',
    creditLimit: 0,
    isVirtual: false
  });

  const cancelRef = React.useRef(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const data = await bankingService.getCards();
      setCards(data);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar cartões",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCard = async () => {
    if (!newCard.holderName) {
      toast.show({
        description: "Preencha o nome do titular",
        bg: "warning.500"
      });
      return;
    }

    setIsActionLoading(true);
    try {
      await bankingService.createCard(newCard);
      toast.show({
        description: "Cartão solicitado com sucesso!",
        bg: "success.500"
      });
      onAddClose();
      fetchCards();
      setNewCard({
        holderName: '',
        type: CardType.DEBIT,
        class: CardClass.STANDARD,
        brand: 'Visa',
        creditLimit: 0,
        isVirtual: false
      });
    } catch (error) {
      toast.show({
        description: "Erro ao solicitar cartão",
        bg: "error.500"
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleBlock = async (card: CardData) => {
    setIsActionLoading(true);
    try {
      if (card.status === CardStatus.ACTIVE) {
        await bankingService.blockCard(card._id!);
        toast.show({ description: "Cartão bloqueado", bg: "warning.500" });
      } else {
        await bankingService.unblockCard(card._id!);
        toast.show({ description: "Cartão desbloqueado", bg: "success.500" });
      }
      onDetailClose();
      fetchCards();
    } catch (error) {
      toast.show({ description: "Erro ao alterar status", bg: "error.500" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;
    setIsActionLoading(true);
    try {
      await bankingService.deleteCard(selectedCard._id!);
      toast.show({ description: "Cartão excluído", bg: "success.500" });
      onDeleteClose();
      onDetailClose();
      fetchCards();
    } catch (error) {
      toast.show({ description: "Erro ao excluir cartão", bg: "error.500" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateLimit = async (newLimit: number) => {
    if (!selectedCard) return;
    try {
      await bankingService.updateCard(selectedCard._id!, { creditLimit: newLimit });
      toast.show({ description: "Limite atualizado", bg: "success.500" });
      fetchCards();
    } catch (error) {
      toast.show({ description: "Erro ao atualizar limite", bg: "error.500" });
    }
  };

  const getCardColor = (cardClass: CardClass) => {
    switch (cardClass) {
      case CardClass.BLACK: return "coolGray.900";
      case CardClass.PLATINUM: return "teal.800";
      case CardClass.GOLD: return "yellow.600";
      default: return "blue.700";
    }
  };

  const renderCard = (card: CardData) => (
    <Pressable 
      key={card._id} 
      onPress={() => {
        setSelectedCard(card);
        onDetailOpen();
      }}
    >
      <Box 
        bg={getCardColor(card.class)} 
        p={6} 
        rounded="2xl" 
        h={48} 
        justifyContent="space-between"
        shadow={6}
        mb={4}
        opacity={card.status === CardStatus.BLOCKED ? 0.6 : 1}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Icon as={<MaterialIcons name="contactless" />} size={8} color="white" />
          <VStack alignItems="flex-end">
            <Text color="white" fontWeight="bold" fontSize="xs">{card.brand} {card.class}</Text>
            {card.isVirtual && <Badge colorScheme="info" rounded="md">VIRTUAL</Badge>}
          </VStack>
        </HStack>
        
        <VStack>
          <Text color="white" fontSize="xl" letterSpacing={4}>
            **** **** **** {card.cardNumber.slice(-4)}
          </Text>
          <HStack justifyContent="space-between" mt={2}>
            <Text color="white" opacity={0.8} fontSize="sm">{card.holderName.toUpperCase()}</Text>
            <Text color="white" opacity={0.8} fontSize="sm">{card.expirationDate}</Text>
          </HStack>
        </VStack>

        {card.status === CardStatus.BLOCKED && (
          <Center position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(0,0,0,0.4)" rounded="2xl">
            <Icon as={<MaterialIcons name="lock" />} size={10} color="white" />
            <Text color="white" fontWeight="bold">BLOQUEADO</Text>
          </Center>
        )}
      </Box>
    </Pressable>
  );

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Heading color={themeColors.text}>Meus Cartões</Heading>
            <Text color={themeColors.icon}>Gerencie seus cartões físicos e virtuais</Text>
          </VStack>
          <Pressable onPress={onAddOpen}>
            <Circle size="12" bg={themeColors.tint}>
              <Icon as={<MaterialIcons name="add" />} size={6} color="white" />
            </Circle>
          </Pressable>
        </HStack>
        
        {isLoading ? (
          <Center h={40}>
            <Spinner color={themeColors.tint} size="lg" />
          </Center>
        ) : cards.length > 0 ? (
          <VStack>
            {cards.map(renderCard)}
          </VStack>
        ) : (
          <Center h={40} bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} rounded="2xl" borderStyle="dashed" borderWidth={1} borderColor={themeColors.icon}>
            <Icon as={<MaterialIcons name="credit-card" />} size={10} color={themeColors.icon} mb={2} />
            <Text color={themeColors.icon}>Nenhum cartão encontrado</Text>
            <Button variant="link" colorScheme="teal" onPress={onAddOpen}>Solicitar meu primeiro cartão</Button>
          </Center>
        )}

        <VStack space={4}>
          <Heading size="sm" color={themeColors.text}>Serviços</Heading>
          
          <Pressable onPress={() => router.push('/banking/virtual-card')}>
            <HStack space={4} alignItems="center" bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" shadow={1}>
              <Circle size="10" bg="blue.100">
                <Icon as={<MaterialCommunityIcons name="credit-card-plus" />} size={5} color="blue.500" />
              </Circle>
              <VStack flex={1}>
                <Text fontWeight="bold" color={themeColors.text}>Cartão Virtual</Text>
                <Text fontSize="xs" color={themeColors.icon}>Segurança para suas compras online</Text>
              </VStack>
              <MaterialIcons name="chevron-right" size={24} color={themeColors.icon} />
            </HStack>
          </Pressable>

          <Pressable onPress={() => router.push('/banking/cards-limit')}>
            <HStack space={4} alignItems="center" bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" shadow={1}>
              <Circle size="10" bg="orange.100">
                <Icon as={<MaterialIcons name="settings" />} size={5} color="orange.500" />
              </Circle>
              <VStack flex={1}>
                <Text fontWeight="bold" color={themeColors.text}>Gestão de Limites</Text>
                <Text fontSize="xs" color={themeColors.icon}>Ajuste o limite de todos os seus cartões</Text>
              </VStack>
              <MaterialIcons name="chevron-right" size={24} color={themeColors.icon} />
            </HStack>
          </Pressable>
        </VStack>

        {/* Add Card Actionsheet */}
        <Actionsheet isOpen={isAddOpen} onClose={onAddClose}>
          <Actionsheet.Content bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'}>
            <ScrollView w="100%">
              <VStack w="100%" p={4} space={4}>
                <Heading size="md" color={themeColors.text}>Solicitar Novo Cartão</Heading>
                
                <FormInput 
                  label="Nome do Titular"
                  placeholder="Como aparecerá no cartão" 
                  value={newCard.holderName}
                  onChangeText={(v: string) => setNewCard({...newCard, holderName: v})}
                  autoCapitalize="characters"
                />

                <HStack space={4}>
                  <FormControl flex={1}>
                    <FormControl.Label>Tipo</FormControl.Label>
                    <Select 
                      selectedValue={newCard.type} 
                      onValueChange={(v: string) => setNewCard({...newCard, type: v as CardType})}
                      bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
                      rounded="xl"
                    >
                      <Select.Item label="Débito" value={CardType.DEBIT} />
                      <Select.Item label="Crédito" value={CardType.CREDIT} />
                      <Select.Item label="Múltiplo" value={CardType.MULTIPLE} />
                    </Select>
                  </FormControl>

                  <FormControl flex={1}>
                    <FormControl.Label>Categoria</FormControl.Label>
                    <Select 
                      selectedValue={newCard.class} 
                      onValueChange={(v: string) => setNewCard({...newCard, class: v as CardClass})}
                      bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
                      rounded="xl"
                    >
                      <Select.Item label="Standard" value={CardClass.STANDARD} />
                      <Select.Item label="Gold" value={CardClass.GOLD} />
                      <Select.Item label="Platinum" value={CardClass.PLATINUM} />
                      <Select.Item label="Black" value={CardClass.BLACK} />
                    </Select>
                  </FormControl>
                </HStack>

                <Button 
                  onPress={handleCreateCard} 
                  isLoading={isActionLoading}
                  bg={themeColors.tint}
                  rounded="xl"
                  h={12}
                >
                  Confirmar Solicitação
                </Button>
                <Box h={10} />
              </VStack>
            </ScrollView>
          </Actionsheet.Content>
        </Actionsheet>

        {/* Card Detail Actionsheet */}
        <Actionsheet isOpen={isDetailOpen} onClose={onDetailClose}>
          <Actionsheet.Content bg={colorScheme === 'dark' ? 'coolGray.900' : 'white'}>
            {selectedCard && (
              <VStack w="100%" p={4} space={6}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Heading size="md" color={themeColors.text}>{selectedCard.brand} {selectedCard.class}</Heading>
                    <Text color={themeColors.icon}>Final **** {selectedCard.cardNumber.slice(-4)}</Text>
                  </VStack>
                  <Badge colorScheme={selectedCard.status === CardStatus.ACTIVE ? "success" : "warning"}>
                    {selectedCard.status}
                  </Badge>
                </HStack>

                <Divider />

                <VStack space={4}>
                  <Pressable onPress={() => handleToggleBlock(selectedCard)}>
                    <HStack space={4} alignItems="center">
                      <Circle size="10" bg={selectedCard.status === CardStatus.ACTIVE ? "orange.100" : "green.100"}>
                        <Icon as={<MaterialIcons name={selectedCard.status === CardStatus.ACTIVE ? "lock" : "lock-open"} />} size={5} color={selectedCard.status === CardStatus.ACTIVE ? "orange.500" : "green.500"} />
                      </Circle>
                      <VStack flex={1}>
                        <Text fontWeight="bold" color={themeColors.text}>
                          {selectedCard.status === CardStatus.ACTIVE ? "Bloquear Cartão" : "Desbloquear Cartão"}
                        </Text>
                        <Text fontSize="xs" color={themeColors.icon}>
                          {selectedCard.status === CardStatus.ACTIVE ? "Bloqueio temporário para segurança" : "Ative seu cartão para uso"}
                        </Text>
                      </VStack>
                    </HStack>
                  </Pressable>

                  {selectedCard.type !== CardType.DEBIT && (
                    <VStack space={2}>
                      <HStack justifyContent="space-between">
                        <Text fontWeight="bold" color={themeColors.text}>Limite de Crédito</Text>
                        <Text color={themeColors.tint}>R$ {selectedCard.creditLimit.toLocaleString('pt-BR')}</Text>
                      </HStack>
                      <Slider 
                        defaultValue={selectedCard.creditLimit} 
                        minValue={0} 
                        maxValue={20000} 
                        step={500}
                        onChangeEnd={(v: number) => handleUpdateLimit(v)}
                      >
                        <Slider.Track><Slider.FilledTrack /></Slider.Track>
                        <Slider.Thumb />
                      </Slider>
                    </VStack>
                  )}

                  <Pressable onPress={onDeleteOpen}>
                    <HStack space={4} alignItems="center">
                      <Circle size="10" bg="red.100">
                        <Icon as={<MaterialIcons name="delete" />} size={5} color="red.500" />
                      </Circle>
                      <VStack flex={1}>
                        <Text fontWeight="bold" color="red.500">Cancelar Cartão</Text>
                        <Text fontSize="xs" color={themeColors.icon}>Excluir permanentemente este cartão</Text>
                      </VStack>
                    </HStack>
                  </Pressable>
                </VStack>
                <Box h={6} />
              </VStack>
            )}
          </Actionsheet.Content>
        </Actionsheet>

        {/* Delete Confirmation Dialog */}
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Cancelar Cartão</AlertDialog.Header>
            <AlertDialog.Body>
              Tem certeza que deseja cancelar este cartão? Esta ação é irreversível e você perderá o acesso a este número de cartão.
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button variant="unstyled" colorScheme="coolGray" onPress={onDeleteClose} ref={cancelRef}>
                  Cancelar
                </Button>
                <Button colorScheme="danger" onPress={handleDeleteCard} isLoading={isActionLoading}>
                  Confirmar Exclusão
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>

      </VStack>
    </ScrollView>
  );
}
