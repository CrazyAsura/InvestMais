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

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CoursesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const CourseCard = ({ title, instructor, progress, lessons, icon }: any) => (
    <Pressable>
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
            <Text fontSize="xs" color={themeColors.icon}>{instructor} • {lessons} aulas</Text>
            <VStack space={1} mt={2}>
               <HStack justifyContent="space-between">
                 <Text fontSize="10px" color={themeColors.icon}>Progresso</Text>
                 <Text fontSize="10px" fontWeight="bold" color={themeColors.tint}>{progress}%</Text>
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
          <CourseCard 
            title="Introdução aos Investimentos" 
            instructor="Prof. Ricardo" 
            progress={75} 
            lessons={12} 
            icon="school" 
          />
          <CourseCard 
            title="Renda Fixa na Prática" 
            instructor="Dra. Mariana" 
            progress={30} 
            lessons={8} 
            icon="account-balance" 
          />
          <CourseCard 
            title="Mentalidade Financeira" 
            instructor="Coach Carlos" 
            progress={100} 
            lessons={5} 
            icon="psychology" 
          />
        </VStack>

        <Heading size="md" color={themeColors.text} mt={4}>Recomendados</Heading>
        <HStack space={4}>
          <Pressable flex={1}>
            <VStack space={2}>
              <Box bg="amber.100" h="32" rounded="xl" justifyContent="center" alignItems="center">
                <Icon as={<MaterialIcons name="show-chart" />} size={12} color="amber.500" />
              </Box>
              <Text fontWeight="bold" fontSize="xs" color={themeColors.text}>Day Trade para Iniciantes</Text>
              <Text fontSize="10px" color={themeColors.icon}>R$ 199,90</Text>
            </VStack>
          </Pressable>
          <Pressable flex={1}>
            <VStack space={2}>
              <Box bg="blue.100" h="32" rounded="xl" justifyContent="center" alignItems="center">
                <Icon as={<MaterialIcons name="business" />} size={12} color="blue.500" />
              </Box>
              <Text fontWeight="bold" fontSize="xs" color={themeColors.text}>Fundos Imobiliários</Text>
              <Text fontSize="10px" color={themeColors.icon}>R$ 149,90</Text>
            </VStack>
          </Pressable>
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

