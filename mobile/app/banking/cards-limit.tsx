import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  ScrollView, 
  HStack,
  Slider,
  Button,
  useToast,
  Center,
  Spinner,
  Select,
  FormControl
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { bankingService, CardData, CardType } from '@/services/bankingService';

export default function CardsLimitScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [limit, setLimit] = useState(0);
  const [maxLimit] = useState(50000);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await bankingService.getCards();
      const creditCards = data.filter(c => c.type !== CardType.DEBIT);
      setCards(creditCards);
      if (creditCards.length > 0) {
        setSelectedCardId(creditCards[0]._id!);
        setLimit(creditCards[0].creditLimit);
      }
    } catch (error) {
      toast.show({ description: "Erro ao buscar cartões", bg: "error.500" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardChange = (id: string) => {
    setSelectedCardId(id);
    const card = cards.find(c => c._id === id);
    if (card) {
      setLimit(card.creditLimit);
    }
  };

  const handleSaveLimit = async () => {
    if (!selectedCardId) return;
    setIsSaving(true);
    try {
      await bankingService.updateCard(selectedCardId, { creditLimit: limit });
      toast.show({
        description: "Limite atualizado com sucesso!",
        bg: "success.500"
      });
      router.back();
    } catch (error) {
      toast.show({ description: "Erro ao atualizar limite", bg: "error.500" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Center flex={1} bg={themeColors.background}>
        <Spinner color={themeColors.tint} size="lg" />
      </Center>
    );
  }

  if (cards.length === 0) {
    return (
      <Center flex={1} bg={themeColors.background} p={6}>
        <Icon as={<MaterialIcons name="info-outline" />} size={12} color={themeColors.icon} mb={4} />
        <Text textAlign="center" color={themeColors.text} fontSize="lg" fontWeight="bold">
          Nenhum cartão de crédito encontrado
        </Text>
        <Text textAlign="center" color={themeColors.icon} mt={2}>
          Você precisa de um cartão de crédito ou múltiplo para ajustar limites.
        </Text>
        <Button mt={6} variant="outline" colorScheme="teal" onPress={() => router.back()}>
          Voltar
        </Button>
      </Center>
    );
  }

  const selectedCard = cards.find(c => c._id === selectedCardId);

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={8}>
        <VStack space={2}>
          <Heading size="lg" color={themeColors.text}>Ajustar Limites</Heading>
          <Text color={themeColors.icon}>Escolha o cartão e defina o limite de crédito desejado.</Text>
        </VStack>

        <FormControl>
          <FormControl.Label>Selecione o Cartão</FormControl.Label>
          <Select 
            selectedValue={selectedCardId} 
            onValueChange={handleCardChange}
            bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'}
            rounded="xl"
            p={3}
          >
            {cards.map(card => (
              <Select.Item 
                key={card._id} 
                label={`${card.brand} ${card.class} (**** ${card.cardNumber.slice(-4)})`} 
                value={card._id!} 
              />
            ))}
          </Select>
        </FormControl>

        <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={8} rounded="2xl" shadow={4}>
          <VStack space={8} alignItems="center">
            <VStack alignItems="center" space={1}>
              <Text color={themeColors.icon} fontSize="sm">Limite total disponível</Text>
              <Heading color={themeColors.tint} size="2xl">
                R$ {limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Heading>
              {selectedCard && (
                <Text fontSize="xs" color="orange.500">
                  Usado: R$ {selectedCard.usedLimit.toLocaleString('pt-BR')}
                </Text>
              )}
            </VStack>

            <Box w="100%" px={4}>
              <Slider 
                value={limit} 
                minValue={0} 
                maxValue={maxLimit} 
                step={100} 
                onChange={(v: number) => setLimit(Math.floor(v))}
                colorScheme="teal"
              >
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
              <HStack justifyContent="space-between" mt={2}>
                <Text fontSize="xs" color={themeColors.icon}>R$ 0,00</Text>
                <Text fontSize="xs" color={themeColors.icon}>R$ {maxLimit.toLocaleString('pt-BR')}</Text>
              </HStack>
            </Box>

            <VStack w="100%" space={4} mt={4}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={themeColors.text}>Limite para compras online</Text>
                <Text fontWeight="bold" color={themeColors.text}>R$ {limit.toLocaleString('pt-BR')}</Text>
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={themeColors.text}>Limite para saques</Text>
                <Text fontWeight="bold" color={themeColors.text}>R$ {(limit * 0.1).toLocaleString('pt-BR')}</Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        <Box bg="orange.50" _dark={{ bg: 'orange.900' }} p={4} rounded="xl">
          <HStack space={3} alignItems="center">
            <Icon as={<MaterialIcons name="warning" />} size={6} color="orange.500" />
            <Text flex={1} fontSize="xs" color="orange.700" _dark={{ color: 'orange.200' }}>
              O novo limite entrará em vigor imediatamente após a confirmação. Sujeito a análise de crédito.
            </Text>
          </HStack>
        </Box>

        <Button 
          onPress={handleSaveLimit} 
          isLoading={isSaving}
          bg={themeColors.tint}
          h={12}
          rounded="xl"
          _text={{ fontWeight: 'bold' }}
        >
          Confirmar Novo Limite
        </Button>
      </VStack>
    </ScrollView>
  );
}
