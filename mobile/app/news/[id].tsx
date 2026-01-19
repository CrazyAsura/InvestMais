import React, { useState } from 'react';
import { ScrollView, Share, Alert, TextInput } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Heading, 
  Image, 
  Icon, 
  IconButton, 
  Badge, 
  Divider, 
  Avatar, 
  Button, 
  Spinner, 
  Center,
  useColorModeValue,
  Pressable
} from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsService } from '@/services/newsService';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export default function NewsDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const [comment, setComment] = useState('');

  const bgColor = useColorModeValue('white', 'coolGray.900');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');
  const inputBg = useColorModeValue('coolGray.50', '#111827');

  const { data: news, isLoading } = useQuery({
    queryKey: ['news-detail', id],
    queryFn: () => NewsService.getNewsById(id!),
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: () => NewsService.likeNews(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news-detail', id] }),
  });

  const dislikeMutation = useMutation({
    mutationFn: () => NewsService.dislikeNews(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news-detail', id] }),
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => NewsService.addComment(id!, content),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['news-detail', id] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => NewsService.deleteComment(id!, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news-detail', id] }),
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${news?.title}\n\nConfira esta notícia no InvestMais!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      'Remover Comentário',
      'Deseja realmente remover este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive', 
          onPress: () => deleteCommentMutation.mutate(commentId) 
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <Center flex={1} bg={bgColor}>
        <Spinner color="amber.500" size="lg" />
      </Center>
    );
  }

  if (!news) {
    return (
      <Center flex={1} bg={bgColor}>
        <Text color={textColor}>Notícia não encontrada</Text>
        <Button onPress={() => router.back()} mt={4}>Voltar</Button>
      </Center>
    );
  }

  return (
    <Box flex={1} bg={bgColor}>
      <HStack 
        px={4} 
        py={3} 
        alignItems="center" 
        justifyContent="space-between"
        borderBottomWidth={1}
        borderBottomColor={borderColor}
      >
        <IconButton 
          icon={<Icon as={MaterialIcons} name="arrow-back" size="md" color={textColor} />}
          onPress={() => router.back()}
          variant="ghost"
        />
        <HStack space={2}>
          <IconButton 
            icon={<Icon as={MaterialIcons} name="share" size="md" color={textColor} />}
            onPress={handleShare}
            variant="ghost"
          />
        </HStack>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack p={4} space={4}>
          <Badge colorScheme="amber" alignSelf="flex-start" rounded="md">
            {news.category.toUpperCase()}
          </Badge>
          
          <Heading size="lg" color={textColor} lineHeight="sm">
            {news.title}
          </Heading>

          <HStack space={2} alignItems="center">
            <Text color={secondaryTextColor} fontSize="xs">
              Publicado em {dayjs(news.createdAt).format("DD [de] MMMM, YYYY")}
            </Text>
          </HStack>

          {news.imageUrl && (
            <Image 
              source={{ uri: news.imageUrl }} 
              alt={news.title}
              w="full"
              h="200"
              borderRadius="2xl"
              resizeMode="cover"
            />
          )}

          <Text color={textColor} fontSize="md" lineHeight="lg">
            {news.content}
          </Text>

          <Divider my={4} />

          <HStack justifyContent="space-between" alignItems="center">
            <HStack space={4}>
              <Pressable onPress={() => likeMutation.mutate()} alignItems="center" flexDirection="row">
                <Icon 
                  as={Ionicons} 
                  name={news.likes?.length > 0 ? "thumbs-up" : "thumbs-up-outline"} 
                  size="sm" 
                  color={news.likes?.length > 0 ? "amber.500" : secondaryTextColor} 
                />
                <Text ml={1} color={secondaryTextColor}>{news.likes?.length || 0}</Text>
              </Pressable>

              <Pressable onPress={() => dislikeMutation.mutate()} alignItems="center" flexDirection="row">
                <Icon 
                  as={Ionicons} 
                  name={news.dislikes?.length > 0 ? "thumbs-down" : "thumbs-down-outline"} 
                  size="sm" 
                  color={news.dislikes?.length > 0 ? "red.500" : secondaryTextColor} 
                />
                <Text ml={1} color={secondaryTextColor}>{news.dislikes?.length || 0}</Text>
              </Pressable>
            </HStack>
            
            <HStack alignItems="center" space={1}>
              <Icon as={MaterialIcons} name="chat-bubble-outline" size="xs" color={secondaryTextColor} />
              <Text color={secondaryTextColor}>{news.comments?.length || 0} comentários</Text>
            </HStack>
          </HStack>

          <VStack space={4} mt={4}>
            <Heading size="sm" color={textColor}>Comentários</Heading>
            
            <HStack space={2} alignItems="center">
              <Box flex={1} bg={inputBg} borderRadius="xl" px={4} py={2} borderWidth={1} borderColor={borderColor}>
                <TextInput 
                  placeholder="Adicione um comentário..."
                  placeholderTextColor="gray"
                  value={comment}
                  onChangeText={setComment}
                  style={{ color: textColor }}
                  multiline
                />
              </Box>
              <IconButton 
                icon={<Icon as={MaterialIcons} name="send" color="amber.500" />}
                onPress={() => comment.trim() && commentMutation.mutate(comment)}
                isDisabled={!comment.trim() || commentMutation.isPending}
                variant="ghost"
              />
            </HStack>

            <VStack space={4} mb={10}>
              {news.comments?.map((c: any) => (
                <HStack key={c._id} space={3}>
                  <Avatar size="sm" bg="amber.500">
                    {c.userName.charAt(0)}
                  </Avatar>
                  <VStack flex={1}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontWeight="bold" color={textColor} fontSize="sm">{c.userName}</Text>
                      <Text fontSize="2xs" color={secondaryTextColor}>
                        {dayjs(c.createdAt).format("DD/MM/YY HH:mm")}
                      </Text>
                    </HStack>
                    <Text color={textColor} fontSize="sm">{c.content}</Text>
                  </VStack>
                  <IconButton 
                    icon={<Icon as={MaterialIcons} name="more-vert" size="xs" color={secondaryTextColor} />}
                    onPress={() => handleDeleteComment(c._id)}
                    variant="ghost"
                  />
                </HStack>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
