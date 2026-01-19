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
  Circle,
  Progress,
  Spacer
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CourseService, Course } from '@/services/courseService';

export default function CoursesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const [allCourses, recCourses] = await Promise.all([
        CourseService.getCourses(),
        CourseService.getRecommendedCourses()
      ]);
      setCourses(allCourses);
      setRecommended(recCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const CourseCard = ({ id, title, instructor, progress = 0, lessonsCount, icon }: any) => (
    <Pressable onPress={() => router.push(`/courses/${id}` as any)}>
      <Box 
        bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} 
        p={4} 
        rounded="xl" 
        shadow={2}
        borderWidth={1}
        borderColor={colorScheme === 'dark' ? 'coolGray.700' : 'coolGray.100'}
      >
        <HStack space={4} alignItems="center">
          <Circle size="12" bg={themeColors.tint} opacity={0.1}>
            <Icon as={<MaterialIcons name={icon} />} size={6} color={themeColors.tint} />
          </Circle>
          <VStack flex={1} space={1}>
            <Heading size="xs" color={themeColors.text}>{title}</Heading>
            <Text fontSize="xs" color={themeColors.icon}>{instructor} • {lessonsCount} aulas</Text>
            <VStack space={1} mt={2}>
               <HStack justifyContent="space-between">
                 <Text fontSize={10} color={themeColors.icon}>Progresso</Text>
                 <Text fontSize={10} fontWeight="bold" color={themeColors.tint}>{progress}%</Text>
               </HStack>
               <Progress value={progress} size="xs" colorScheme="amber" />
            </VStack>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );

  if (isLoading) {
    return (
      <ScrollView bg={themeColors.background} p={6}>
        <VStack space={6}>
          <Heading color={themeColors.text}>Meus Cursos</Heading>
          
          <VStack space={4}>
            {[1, 2, 3, 4].map(i => (
              <Box key={i} bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" shadow={2}>
                <HStack space={4} alignItems="center">
                  <Skeleton size="12" rounded="full" />
                  <VStack flex={1} space={2}>
                    <Skeleton h="4" w="80%" rounded="full" />
                    <Skeleton h="3" w="40%" rounded="full" />
                    <VStack space={2} mt={2}>
                      <HStack justifyContent="space-between">
                        <Skeleton h="2" w="10" rounded="full" />
                        <Skeleton h="2" w="6" rounded="full" />
                      </HStack>
                      <Skeleton h="1.5" w="100%" rounded="full" />
                    </VStack>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          <Heading size="md" color={themeColors.text} mt={4}>Recomendados</Heading>
          <HStack space={4}>
            {[1, 2].map(i => (
              <VStack key={i} flex={1} space={2}>
                <Skeleton h="32" rounded="xl" />
                <Skeleton h="4" w="100%" rounded="full" />
                <Skeleton h="3" w="60%" rounded="full" />
              </VStack>
            ))}
          </HStack>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <Heading color={themeColors.text}>Meus Cursos</Heading>

        <VStack space={4}>
          {courses.map((course) => (
            <CourseCard 
              key={course._id}
              id={course._id}
              title={course.title}
              instructor={course.instructor}
              progress={course.progress || 0}
              lessonsCount={course.lessonsCount}
              icon={course.icon}
            />
          ))}
          {courses.length === 0 && (
            <Box p={4} bg={themeColors.card} rounded="xl" alignItems="center">
              <Text color={themeColors.icon}>Nenhum curso encontrado</Text>
            </Box>
          )}
        </VStack>

        <Heading size="md" color={themeColors.text} mt={4}>Recomendados</Heading>
        <HStack space={4}>
          {recommended.map((course) => (
            <Pressable key={course._id} flex={1} onPress={() => router.push(`/courses/${course._id}` as any)}>
              <VStack space={2}>
                <Box bg="amber.100" h="32" rounded="xl" justifyContent="center" alignItems="center">
                  <Icon as={<MaterialIcons name={course.icon as any} />} size={12} color="amber.500" />
                </Box>
                <Text fontWeight="bold" fontSize="xs" color={themeColors.text}>{course.title}</Text>
                <Text fontSize={10} color={themeColors.icon}>
                  {course.price === 0 ? 'Grátis' : `R$ ${course.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </Text>
              </VStack>
            </Pressable>
          ))}
          {recommended.length === 0 && (
            <Box p={4} flex={1} bg={themeColors.card} rounded="xl" alignItems="center">
              <Text color={themeColors.icon}>Nenhuma recomendação</Text>
            </Box>
          )}
        </HStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

