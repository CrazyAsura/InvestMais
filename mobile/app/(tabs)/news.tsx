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
import { TextInput } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { NewsService } from '@/services/newsService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default function NewsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [activeCategory, setActiveCategory] = useState('Tudo');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Tudo', 'Mercado', 'Economia', 'Investimentos', 'Cripto', 'Educação'];

  const { data: newsData = [], isLoading } = useQuery({
    queryKey: ['news-list'],
    queryFn: NewsService.getNews,
  });

  const filteredNews = newsData.filter(news => {
    const matchesCategory = activeCategory === 'Tudo' || news.category === activeCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (news.excerpt && news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredNews = newsData.find(n => n.featured);

  const NewsItem = ({ id, category, title, createdAt, imageUrl }: any) => (
    <Pressable onPress={() => router.push(`/news/${id}` as any)} _pressed={{ opacity: 0.7 }}>
      <HStack space={4} alignItems="center" py={4} borderBottomWidth={1} borderBottomColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
        <VStack flex={1} space={2}>
          <Badge colorScheme="amber" _text={{ fontSize: '10px', fontWeight: 'bold' }} alignSelf="flex-start" variant="subtle" rounded="md">
            {category.toUpperCase()}
          </Badge>
          <Heading size="xs" color={themeColors.text} numberOfLines={2} lineHeight="sm">
            {title}
          </Heading>
          <Text fontSize="xs" color={themeColors.icon}>
            {dayjs(createdAt).fromNow()}
          </Text>
        </VStack>
        <Box rounded="xl" overflow="hidden">
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              alt={title}
              w="24" 
              h="20"
              resizeMode="cover"
            />
          ) : (
            <Box bg="coolGray.200" w="24" h="20" />
          )}
        </Box>
      </HStack>
    </Pressable>
  );

  if (isLoading) {
    return (
      <ScrollView bg={themeColors.background} p={6}>
        <VStack space={6}>
          <Heading color={themeColors.text}>Notícias</Heading>
          
          <Skeleton h="12" w="100%" rounded="xl" />

          <HStack space={2}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} h="8" w="20" rounded="full" />
            ))}
          </HStack>

          <VStack space={3}>
            <Skeleton h="48" w="100%" rounded="2xl" />
            <Skeleton h="6" w="80%" rounded="full" />
            <Skeleton h="4" w="40%" rounded="full" />
          </VStack>

          <VStack space={6} mt={4}>
            {[1, 2, 3].map(i => (
              <HStack key={i} space={4} alignItems="center">
                <VStack flex={1} space={2}>
                  <Skeleton h="4" w="24" rounded="md" />
                  <Skeleton h="5" w="100%" rounded="full" />
                  <Skeleton h="3" w="32" rounded="full" />
                </VStack>
                <Skeleton w="24" h="20" rounded="xl" />
              </HStack>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView bg={themeColors.background} showsVerticalScrollIndicator={false}>
      <VStack space={6} p={6}>
        <Heading color={themeColors.text} size="xl">Notícias</Heading>

        {/* Search Bar */}
        <HStack 
          bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
          borderRadius="xl"
          alignItems="center"
          px={4}
          py={2}
        >
          <Icon
            as={<MaterialIcons name="search" />}
            size={5}
            color="coolGray.400"
          />
          <TextInput
            placeholder="Buscar notícias..."
            placeholderTextColor="#9ca3af"
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 8,
              color: themeColors.text,
              fontSize: 16
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </HStack>

        {/* Categories Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space={2}>
            {categories.map((cat) => (
              <Pressable 
                key={cat} 
                onPress={() => setActiveCategory(cat)}
                px={4} 
                py={2} 
                rounded="full"
                bg={activeCategory === cat ? 'amber.500' : (colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100')}
              >
                <Text 
                  color={activeCategory === cat ? 'white' : themeColors.text}
                  fontWeight={activeCategory === cat ? 'bold' : 'normal'}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>

        {/* Featured News */}
        {activeCategory === 'Tudo' && searchQuery === '' && featuredNews && (
          <Pressable onPress={() => router.push(`/news/${featuredNews._id}` as any)} _pressed={{ opacity: 0.9 }}>
            <Box w="100%" h="56" rounded="3xl" overflow="hidden" shadow={6}>
              <Image 
                source={{ uri: featuredNews.imageUrl }} 
                alt="Featured"
                w="100%" 
                h="100%"
                resizeMode="cover"
              />
              <Box 
                position="absolute" 
                bottom={0} 
                left={0} 
                right={0} 
                bg={{
                  linearGradient: {
                    colors: ['transparent', 'rgba(0,0,0,0.9)'],
                    start: [0, 0],
                    end: [0, 1],
                  },
                }}
                p={5}
                pt={10}
              >
                <Badge colorScheme="amber" _text={{ fontWeight: 'bold' }} alignSelf="flex-start" mb={2} rounded="md">
                  DESTAQUE
                </Badge>
                <Heading size="md" color="white" numberOfLines={2} lineHeight="sm">
                  {featuredNews.title}
                </Heading>
                <Text color="coolGray.300" fontSize="xs" mt={1}>
                  {dayjs(featuredNews.createdAt).fromNow()} • {featuredNews.category}
                </Text>
              </Box>
            </Box>
          </Pressable>
        )}

        {/* News List */}
        <VStack space={2}>
          {filteredNews.length > 0 ? (
            filteredNews
              .filter(news => searchQuery !== '' || !news.featured || activeCategory !== 'Tudo')
              .map((news) => (
                <NewsItem 
                  key={news._id}
                  id={news._id}
                  category={news.category}
                  title={news.title}
                  createdAt={news.createdAt}
                  imageUrl={news.imageUrl}
                />
              ))
          ) : (
            <VStack py={10} alignItems="center" space={2}>
              <Icon as={<MaterialIcons name="search-off" />} size={12} color="coolGray.400" />
              <Text color="coolGray.400">Nenhuma notícia encontrada</Text>
            </VStack>
          )}
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

