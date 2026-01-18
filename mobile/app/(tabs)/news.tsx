import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { 
  VStack, 
  HStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  Pressable, 
  ScrollView, 
  Skeleton,
  Image,
  Badge,
  Spacer
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function NewsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const NewsItem = ({ category, title, time, imageUrl }: any) => (
    <Pressable>
      <HStack space={4} alignItems="center" py={4}>
        <VStack flex={1} space={2}>
          <Badge colorScheme="amber" _text={{ fontSize: '10px' }} alignSelf="flex-start" variant="subtle" rounded="md">
            {category}
          </Badge>
          <Heading size="xs" color={themeColors.text} numberOfLines={2}>
            {title}
          </Heading>
          <Text fontSize="xs" color={themeColors.icon}>{time}</Text>
        </VStack>
        <Box rounded="lg" overflow="hidden">
          <Box bg="coolGray.200" w="24" h="20" />
        </Box>
      </HStack>
    </Pressable>
  );

  if (isLoading) {
    return (
      <ScrollView bg={themeColors.background} p={6}>
        <VStack space={6}>
          <Heading color={themeColors.text}>Notícias</Heading>
          
          {/* Featured News Skeleton */}
          <VStack space={3}>
            <Skeleton h="48" w="100%" rounded="xl" />
            <Skeleton h="6" w="80%" rounded="full" />
            <Skeleton h="4" w="40%" rounded="full" />
          </VStack>

          {/* News List Skeleton */}
          <VStack space={6} mt={4}>
            {[1, 2, 3, 4].map(i => (
              <HStack key={i} space={4} alignItems="center">
                <VStack flex={1} space={2}>
                  <Skeleton h="4" w="24" rounded="md" />
                  <Skeleton h="5" w="100%" rounded="full" />
                  <Skeleton h="3" w="32" rounded="full" />
                </VStack>
                <Skeleton w="24" h="20" rounded="lg" />
              </HStack>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <Heading color={themeColors.text}>Notícias</Heading>

        {/* Featured News */}
        <Pressable>
          <VStack space={3}>
            <Box bg="coolGray.300" h="48" w="100%" rounded="xl" justifyContent="flex-end" p={4}>
               <Badge colorScheme="amber" position="absolute" top={4} left={4} rounded="md">DESTAQUE</Badge>
               <VStack space={1}>
                 <Heading size="md" color="white" shadow={2}>Ibovespa sobe 2% com otimismo no setor financeiro</Heading>
                 <Text color="white" fontSize="xs" opacity={0.8}>Há 2 horas • Mercado Financeiro</Text>
               </VStack>
            </Box>
          </VStack>
        </Pressable>

        {/* News List */}
        <VStack space={2} mt={2}>
          <NewsItem 
            category="ECONOMIA" 
            title="Inflação oficial fecha o ano dentro da meta estipulada" 
            time="Há 4 horas" 
          />
          <NewsItem 
            category="INVESTIMENTOS" 
            title="Como a queda da Selic afeta sua rentabilidade fixa" 
            time="Há 6 horas" 
          />
          <NewsItem 
            category="TECNOLOGIA" 
            title="Novas regras para o PIX entram em vigor na próxima semana" 
            time="Há 8 horas" 
          />
          <NewsItem 
            category="MUNDO" 
            title="Tensões no Oriente Médio impactam preço do barril de petróleo" 
            time="Há 12 horas" 
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

