import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  IconButton, 
  Heading, 
  Spinner, 
  Button, 
  FormControl, 
  Select, 
  useToast,
  ScrollView,
  useColorModeValue,
  Divider
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FormInput } from '@/components/ui/form-input';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function UserDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const bgColor = useColorModeValue('white', 'coolGray.900');
  const cardBg = useColorModeValue('white', 'coolGray.800');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/${id}`);
        setUserData(response.data);
      } catch (error) {
        toast.show({ description: "Erro ao carregar usuário", bg: "error.500" });
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await api.patch(`/user/${id}`, {
        name: userData.name,
        role: userData.role
      });
      toast.show({ description: "Usuário atualizado", bg: "success.500" });
    } catch (error) {
      toast.show({ description: "Erro ao atualizar", bg: "error.500" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Center flex={1}><Spinner size="lg" color={themeColors.tint} /></Center>;

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Detalhes do Usuário" showBackButton />
      <ScrollView p={4}>
        <VStack space={6}>
          <Box bg={cardBg} p={6} borderRadius="2xl" shadow={2}>
            <VStack space={4}>
              <Heading size="md" color={themeColors.text}>Editar Usuário</Heading>
              
              <FormInput
                label="Nome"
                value={userData.name} 
                onChangeText={v => setUserData({...userData, name: v})}
                placeholder="Digite o nome"
              />

              <FormInput
                label="E-mail (Não editável)"
                value={userData.email}
                editable={false}
                onChangeText={() => {}}
              />

              <FormControl>
                <FormControl.Label>Nível de Acesso</FormControl.Label>
                <Select 
                  selectedValue={userData.role} 
                  onValueChange={v => setUserData({...userData, role: v})}
                  color={themeColors.text}
                >
                  <Select.Item label="Usuário" value="user" />
                  <Select.Item label="Administrador" value="admin" />
                </Select>
              </FormControl>

              <Button 
                mt={4} 
                onPress={handleUpdate} 
                isLoading={saving}
                bg={themeColors.tint}
              >
                Salvar Alterações
              </Button>
            </VStack>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="2xl" shadow={2}>
            <Heading size="sm" mb={4} color={themeColors.text}>Informações Adicionais</Heading>
            <VStack space={3}>
              <HStack justifyContent="space-between">
                <Text color="coolGray.500">Documento:</Text>
                <Text color={themeColors.text}>{userData.document || 'N/A'}</Text>
              </HStack>
              <Divider />
              <HStack justifyContent="space-between">
                <Text color="coolGray.500">Criado em:</Text>
                <Text color={themeColors.text}>{new Date(userData.createdAt).toLocaleDateString()}</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}

function Center({ children, ...props }: any) {
  return (
    <Box justifyContent="center" alignItems="center" {...props}>
      {children}
    </Box>
  );
}
