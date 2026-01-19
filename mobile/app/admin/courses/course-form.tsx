import React, { useState, useEffect } from 'react';
import { Alert, TextInput, ScrollView } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Button, 
  Spinner, 
  Center,
  useColorModeValue,
  FormControl,
  Select,
  CheckIcon,
  Switch,
  Text,
  Icon,
  Heading,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CourseService } from '@/services/courseService';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminCourseForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');
  const inputBg = useColorModeValue('coolGray.50', '#111827');

  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    description: '',
    category: '',
    icon: 'school',
    price: 0,
    recommended: false,
    lessonsCount: 0,
  });

  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['admin-course-item', id],
    queryFn: () => CourseService.getCourse(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        instructor: course.instructor,
        description: course.description || '',
        category: course.category || '',
        icon: course.icon || 'school',
        price: course.price || 0,
        recommended: course.recommended || false,
        lessonsCount: course.lessonsCount || 0,
      });
    }
  }, [course]);

  const mutation = useMutation({
    mutationFn: (data: any) => id 
      ? CourseService.updateCourse(id, data) 
      : CourseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      Alert.alert('Sucesso', `Curso ${id ? 'atualizado' : 'criado'} com sucesso`);
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao salvar curso');
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.instructor || !formData.category) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (Título, Instrutor e Categoria)');
      return;
    }

    mutation.mutate({
      ...formData,
      price: Number(formData.price),
      lessonsCount: Number(formData.lessonsCount)
    });
  };

  if (id && isLoadingCourse) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'coolGray.900' : 'coolGray.50'}>
        <Spinner color="primary.500" size="lg" />
      </Center>
    );
  }

  const categories = ['Investimentos', 'Renda Fixa', 'Renda Variável', 'Cripto', 'Educação Financeira'];
  const icons = ['school', 'trending-up', 'account-balance', 'attach-money', 'pie-chart'];

  return (
    <Box flex={1} bg={colorScheme === 'dark' ? 'coolGray.900' : 'coolGray.50'}>
      <AdminHeader title={id ? 'Editar Curso' : 'Novo Curso'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack p={4} space={5}>
          <Box bg={cardBg} p={5} borderRadius="2xl" borderWidth={1} borderColor={borderColor} shadow={1}>
            <VStack space={4}>
              <FormControl isRequired>
                <FormControl.Label _text={{ fontWeight: '700', fontSize: 'xs', color: secondaryTextColor }}>TÍTULO DO CURSO</FormControl.Label>
                <Box bg={inputBg} borderRadius="xl" borderWidth={1} borderColor={borderColor} px={4} py={3}>
                  <TextInput 
                    value={formData.title}
                    onChangeText={(text) => setFormData({...formData, title: text})}
                    placeholder="Ex: Do Zero ao Investidor"
                    placeholderTextColor="#9ca3af"
                    style={{ color: textColor, fontSize: 16, fontWeight: '600' }}
                  />
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label _text={{ fontWeight: '700', fontSize: 'xs', color: secondaryTextColor }}>INSTRUTOR</FormControl.Label>
                <Box bg={inputBg} borderRadius="xl" borderWidth={1} borderColor={borderColor} px={4} py={3}>
                  <TextInput 
                    value={formData.instructor}
                    onChangeText={(text) => setFormData({...formData, instructor: text})}
                    placeholder="Nome do instrutor"
                    placeholderTextColor="#9ca3af"
                    style={{ color: textColor, fontSize: 16, fontWeight: '600' }}
                  />
                </Box>
              </FormControl>

              <HStack space={4}>
                <FormControl isRequired flex={1}>
                  <FormControl.Label _text={{ fontWeight: '700', fontSize: 'xs', color: secondaryTextColor }}>CATEGORIA</FormControl.Label>
                  <Select 
                    selectedValue={formData.category} 
                    minWidth="150" 
                    accessibilityLabel="Escolha a categoria" 
                    placeholder="Escolha a categoria" 
                    _selectedItem={{
                      bg: "primary.600",
                      endIcon: <CheckIcon size="5" color="white" />
                    }} 
                    mt={1}
                    onValueChange={itemValue => setFormData({...formData, category: itemValue})}
                    bg={inputBg}
                    borderRadius="xl"
                    borderWidth={1}
                    borderColor={borderColor}
                    color={textColor}
                    fontSize="md"
                    fontWeight="600"
                  >
                    {categories.map(cat => (
                      <Select.Item key={cat} label={cat} value={cat} />
                    ))}
                  </Select>
                </FormControl>

                <FormControl flex={1}>
                  <FormControl.Label _text={{ fontWeight: '700', fontSize: 'xs', color: secondaryTextColor }}>ÍCONE</FormControl.Label>
                  <Select 
                    selectedValue={formData.icon} 
                    minWidth="150" 
                    accessibilityLabel="Escolha o ícone" 
                    placeholder="Escolha o ícone" 
                    _selectedItem={{
                      bg: "primary.600",
                      endIcon: <CheckIcon size="5" color="white" />
                    }} 
                    mt={1}
                    onValueChange={itemValue => setFormData({...formData, icon: itemValue})}
                    bg={inputBg}
                    borderRadius="xl"
                    borderWidth={1}
                    borderColor={borderColor}
                    color={textColor}
                    fontSize="md"
                    fontWeight="600"
                  >
                    {icons.map(icon => (
                      <Select.Item 
                        key={icon} 
                        label={icon.replace('-', ' ').toUpperCase()} 
                        value={icon} 
                        leftIcon={<Icon as={MaterialIcons} name={icon as any} size="sm" mr={2} />}
                      />
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormControl.Label _text={{ fontWeight: '700', fontSize: 'xs', color: secondaryTextColor }}>DESCRIÇÃO</FormControl.Label>
                <Box bg={inputBg} borderRadius="xl" borderWidth={1} borderColor={borderColor} px={4} py={3}>
                  <TextInput 
                    value={formData.description}
                    onChangeText={(text) => setFormData({...formData, description: text})}
                    placeholder="Sobre o que é este curso?"
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={4}
                    style={{ color: textColor, fontSize: 16, fontWeight: '600', minHeight: 100, textAlignVertical: 'top' }}
                  />
                </Box>
              </FormControl>

              <HStack space={4}>
                <FormControl flex={1}>
                  <FormControl.Label _text={{ fontWeight: '700', fontSize: 'xs', color: secondaryTextColor }}>PREÇO (R$)</FormControl.Label>
                  <Box bg={inputBg} borderRadius="xl" borderWidth={1} borderColor={borderColor} px={4} py={3}>
                    <TextInput 
                      value={formData.price.toString()}
                      onChangeText={(text) => setFormData({...formData, price: text as any})}
                      placeholder="0.00"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      style={{ color: textColor, fontSize: 16, fontWeight: '600' }}
                    />
                  </Box>
                </FormControl>

                <FormControl flex={1}>
                  <FormControl.Label _text={{ fontWeight: '700', fontSize: 'xs', color: secondaryTextColor }}>Nº DE AULAS</FormControl.Label>
                  <Box bg={inputBg} borderRadius="xl" borderWidth={1} borderColor={borderColor} px={4} py={3}>
                    <TextInput 
                      value={formData.lessonsCount.toString()}
                      onChangeText={(text) => setFormData({...formData, lessonsCount: text as any})}
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      style={{ color: textColor, fontSize: 16, fontWeight: '600' }}
                    />
                  </Box>
                </FormControl>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center" bg={inputBg} p={4} borderRadius="xl" borderWidth={1} borderColor={borderColor}>
                <VStack>
                  <Text color={textColor} fontWeight="700">Curso Recomendado</Text>
                  <Text color={secondaryTextColor} fontSize="xs">Aparecerá na seção de recomendados</Text>
                </VStack>
                <Switch 
                  isChecked={formData.recommended}
                  onToggle={(val) => setFormData({...formData, recommended: val})}
                  colorScheme="primary"
                />
              </HStack>
            </VStack>
          </Box>

          <Button 
            onPress={handleSubmit}
            isLoading={mutation.isPending}
            bg="primary.600"
            _pressed={{ bg: 'primary.700' }}
            py={4}
            borderRadius="2xl"
            _text={{ fontWeight: '800', fontSize: 'md' }}
            shadow={3}
          >
            {id ? 'ATUALIZAR CURSO' : 'CRIAR CURSO'}
          </Button>

          <Button 
            variant="ghost"
            onPress={() => router.back()}
            colorScheme="coolGray"
            _text={{ fontWeight: '700' }}
          >
            CANCELAR
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
