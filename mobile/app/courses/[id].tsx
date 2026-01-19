import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { 
  VStack, 
  HStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  Pressable, 
  ScrollView, 
  Spinner,
  Circle,
  Divider,
  Button,
  useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CourseService, Course, Lesson } from '@/services/courseService';
import { Quiz } from '@/components/Quiz';

const { width } = Dimensions.get('window');

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const toast = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      const data = await CourseService.getCourse(id as string);
      setCourse(data);
      if (data.lessonsList && data.lessonsList.length > 0) {
        setCurrentLesson(data.lessonsList[0]);
      }
    } catch (error) {
      console.error('Error fetching course detail:', error);
      toast.show({
        description: "Erro ao carregar detalhes do curso",
        placement: "top"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    if (lesson.type === 'quiz') {
      setShowQuiz(true);
    } else {
      setShowQuiz(false);
    }
  };

  if (isLoading) {
    return (
      <Box flex={1} bg={themeColors.background} justifyContent="center" alignItems="center">
        <Spinner size="lg" color={themeColors.tint} />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box flex={1} bg={themeColors.background} justifyContent="center" alignItems="center" p={6}>
        <Text color={themeColors.text}>Curso não encontrado.</Text>
        <Button mt={4} onPress={() => router.back()}>Voltar</Button>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={themeColors.background}>
      {/* Header */}
      <HStack p={4} alignItems="center" space={4} borderBottomWidth={1} borderBottomColor={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
        <Pressable onPress={() => router.back()}>
          <Icon as={<MaterialIcons name="arrow-back" />} size={6} color={themeColors.text} />
        </Pressable>
        <VStack flex={1}>
          <Heading size="sm" color={themeColors.text} numberOfLines={1}>{course.title}</Heading>
          <Text fontSize="xs" color={themeColors.icon}>{course.instructor}</Text>
        </VStack>
      </HStack>

      <ScrollView flex={1}>
        {/* Lesson Content Area */}
        <Box w="full" bg="black" style={{ height: width * 0.5625 }}>
          {currentLesson?.type === 'video' ? (
            <Video
              ref={videoRef}
              source={{ uri: currentLesson.videoUrl || '' }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              style={{ width: '100%', height: '100%' }}
            />
          ) : currentLesson?.type === 'quiz' ? (
            <Box flex={1} justifyContent="center" alignItems="center" bg="coolGray.900">
              <Icon as={<MaterialIcons name="quiz" />} size={12} color="white" />
              <Text color="white" mt={2}>Quiz disponível abaixo</Text>
              <Button 
                mt={4} 
                colorScheme="amber" 
                size="sm"
                onPress={() => setShowQuiz(true)}
              >
                Começar Quiz
              </Button>
            </Box>
          ) : (
            <Box flex={1} justifyContent="center" alignItems="center" bg="coolGray.900">
              <Icon as={<MaterialIcons name="description" />} size={12} color="white" />
              <Text color="white" mt={2}>Texto disponível abaixo</Text>
            </Box>
          )}
        </Box>

        {showQuiz && currentLesson?.quiz ? (
          <Box flex={1} minH={400} bg={themeColors.background}>
            <Quiz 
              questions={currentLesson.quiz} 
              onComplete={(score) => {
                setShowQuiz(false);
                toast.show({
                  description: `Quiz completado! Pontuação: ${score.toFixed(0)}%`,
                  placement: "top"
                });
              }}
              onCancel={() => setShowQuiz(false)}
            />
          </Box>
        ) : (
          <VStack p={6} space={6}>
            {/* Current Lesson Info */}
            <VStack space={2}>
              <Heading size="md" color={themeColors.text}>{currentLesson?.title}</Heading>
              {currentLesson?.duration && (
                <HStack alignItems="center" space={1}>
                  <Icon as={<MaterialIcons name="access-time" />} size={4} color={themeColors.icon} />
                  <Text fontSize="xs" color={themeColors.icon}>{currentLesson.duration}</Text>
                </HStack>
              )}
            </VStack>

            {currentLesson?.type === 'text' && (
              <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.50'} p={4} rounded="xl">
                <Text color={themeColors.text} fontSize="md" lineHeight="24">
                  {currentLesson.textContent}
                </Text>
              </Box>
            )}

            <Divider />

            {/* Lessons List */}
            <VStack space={4}>
              <Heading size="sm" color={themeColors.text}>Aulas do Curso</Heading>
              {course.lessonsList?.map((lesson, index) => (
                <Pressable key={index} onPress={() => handleLessonPress(lesson)}>
                  <Box 
                    bg={currentLesson?.title === lesson.title ? (colorScheme === 'dark' ? 'coolGray.700' : 'amber.50') : 'transparent'}
                    p={3}
                    rounded="lg"
                    borderWidth={1}
                    borderColor={currentLesson?.title === lesson.title ? 'amber.400' : 'transparent'}
                  >
                    <HStack space={3} alignItems="center">
                      <Circle size="8" bg={lesson.type === 'video' ? 'blue.100' : lesson.type === 'quiz' ? 'amber.100' : 'green.100'}>
                        <Icon 
                          as={<MaterialIcons name={lesson.type === 'video' ? 'play-arrow' : lesson.type === 'quiz' ? 'quiz' : 'description'} />} 
                          size={5} 
                          color={lesson.type === 'video' ? 'blue.600' : lesson.type === 'quiz' ? 'amber.600' : 'green.600'} 
                        />
                      </Circle>
                      <VStack flex={1}>
                        <Text 
                          fontWeight={currentLesson?.title === lesson.title ? 'bold' : 'normal'}
                          color={themeColors.text}
                        >
                          {index + 1}. {lesson.title}
                        </Text>
                        <Text fontSize="xs" color={themeColors.icon}>
                          {lesson.type === 'video' ? 'Vídeo' : lesson.type === 'quiz' ? 'Quiz' : 'Texto'} 
                          {lesson.duration ? ` • ${lesson.duration}` : ''}
                        </Text>
                      </VStack>
                      {lesson.completed && (
                        <Icon as={<MaterialIcons name="check-circle" />} size={5} color="green.500" />
                      )}
                    </HStack>
                  </Box>
                </Pressable>
              ))}
            </VStack>

            {/* Course Description */}
            <VStack space={2} mt={4}>
              <Heading size="sm" color={themeColors.text}>Sobre este curso</Heading>
              <Text color={themeColors.text} opacity={0.8}>
                {course.description || 'Sem descrição disponível.'}
              </Text>
            </VStack>
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
}
