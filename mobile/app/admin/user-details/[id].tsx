import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  Spinner, 
  Button, 
  FormControl, 
  Select, 
  useToast,
  ScrollView,
  useColorModeValue,
  Divider,
  Avatar,
  Center,
  Badge
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

  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.50', 'coolGray.700');
  const inputBg = useColorModeValue('coolGray.50', 'coolGray.800');
  const selectBg = useColorModeValue('coolGray.50', '#374151');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/${id}`);
        setUserData(response.data);
      } catch (error) {
        toast.show({ 
          description: "Erro ao carregar usuário", 
          bg: "error.500",
          placement: "top"
        });
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
        role: userData.role,
        sector: userData.sector
      });
      toast.show({ 
        description: "Usuário atualizado com sucesso", 
        bg: "success.500",
        placement: "top"
      });
    } catch (error) {
      toast.show({ 
        description: "Erro ao atualizar usuário", 
        bg: "error.500",
        placement: "top"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Detalhes" showBackButton />
      <Center flex={1}>
        <Spinner size="lg" color={themeColors.tint} />
      </Center>
    </Box>
  );

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Editar Perfil" showBackButton />
      <ScrollView p={4} showsVerticalScrollIndicator={false}>
        <VStack space={6} pb={10}>
          {/* Profile Header Card */}
          <Box bg={cardBg} p={6} borderRadius="3xl" shadow={1} alignItems="center">
            <Avatar 
              bg={userData.role === 'admin' ? 'error.500' : themeColors.tint} 
              size="2xl" 
              mb={4}
              borderWidth={4}
              borderColor={borderColor}
            >
              {userData.name.charAt(0).toUpperCase()}
            </Avatar>
            <Heading size="md" color={textColor} fontWeight="800">{userData.name}</Heading>
            <Text color={secondaryTextColor} fontSize="sm">{userData.email}</Text>
            <Badge 
              mt={3}
              variant="subtle" 
              colorScheme={userData.role === 'admin' ? 'error' : 'blue'} 
              rounded="full"
              px={4}
              py={1}
              _text={{ fontSize: 12, fontWeight: '800' }}
            >
              {userData.role.toUpperCase()}
            </Badge>
          </Box>

          {/* Form Card */}
          <Box bg={cardBg} p={6} borderRadius="3xl" shadow={1}>
            <VStack space={5}>
              <HStack alignItems="center" space={2} mb={2}>
                <Icon as={<MaterialIcons name="edit" />} size={5} color={themeColors.tint} />
                <Heading size="xs" color={textColor} fontWeight="700">INFORMAÇÕES BÁSICAS</Heading>
              </HStack>
              
              <FormInput
                label="Nome Completo"
                value={userData.name} 
                onChangeText={v => setUserData({...userData, name: v})}
                placeholder="Digite o nome"
                icon="person"
              />

              <FormInput
                label="Endereço de E-mail"
                value={userData.email}
                editable={false}
                onChangeText={() => {}}
                icon="email"
                bg={inputBg}
              />

              <FormControl>
                <FormControl.Label _text={{ fontWeight: '700', fontSize: 'sm', color: textColor }}>
                  Nível de Acesso
                </FormControl.Label>
                <Select 
                  selectedValue={userData.role} 
                  minWidth="200" 
                  accessibilityLabel="Escolha o cargo"
                  placeholder="Escolha o cargo" 
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <Icon as={<MaterialIcons name="check" />} size="5" />
                  }} 
                  mt={1}
                  onValueChange={v => setUserData({...userData, role: v})}
                  borderRadius="xl"
                  h={12}
                  bg={selectBg}
                  borderColor="transparent"
                  color={textColor}
                >
                  <Select.Item label="Usuário Comum" value="user" />
                  <Select.Item label="Administrador" value="admin" />
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label _text={{ fontWeight: '700', fontSize: 'sm', color: textColor }}>
                  Setor / Departamento
                </FormControl.Label>
                <Select 
                  selectedValue={userData.sector} 
                  minWidth="200" 
                  accessibilityLabel="Escolha o setor"
                  placeholder="Escolha o setor" 
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <Icon as={<MaterialIcons name="check" />} size="5" />
                  }} 
                  mt={1}
                  onValueChange={v => setUserData({...userData, sector: v})}
                  borderRadius="xl"
                  h={12}
                  bg={selectBg}
                  borderColor="transparent"
                  color={textColor}
                >
                  <Select.Item label="Nenhum" value="" />
                  <Select.Item label="Administrativo" value="administrativo" />
                  <Select.Item label="Contábil" value="contabil" />
                  <Select.Item label="Assessoria de Investimento" value="acessoria" />
                  <Select.Item label="Suporte" value="suporte" />
                  <Select.Item label="RH" value="rh" />
                  <Select.Item label="TI" value="ti" />
                </Select>
              </FormControl>

              <Button 
                mt={4} 
                onPress={handleUpdate} 
                isLoading={saving}
                bg={themeColors.tint}
                borderRadius="2xl"
                h={12}
                _text={{ fontWeight: '800', fontSize: 'md' }}
                _pressed={{ opacity: 0.8 }}
              >
                Salvar Alterações
              </Button>
            </VStack>
          </Box>

          {/* Additional Info Card */}
          <Box bg={cardBg} p={6} borderRadius="3xl" shadow={1}>
            <HStack alignItems="center" space={2} mb={4}>
              <Icon as={<MaterialIcons name="info" />} size={5} color={themeColors.tint} />
              <Heading size="xs" color={textColor} fontWeight="700">DETALHES DA CONTA</Heading>
            </HStack>
            <VStack space={4}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={secondaryTextColor} fontWeight="600">Documento (CPF/CNPJ)</Text>
                <Text color={textColor} fontWeight="700">{userData.document || 'Não informado'}</Text>
              </HStack>
              <Divider opacity={0.5} />
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={secondaryTextColor} fontWeight="600">Membro desde</Text>
                <Text color={textColor} fontWeight="700">
                  {new Date(userData.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </HStack>
              <Divider opacity={0.5} />
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={secondaryTextColor} fontWeight="600">ID do Sistema</Text>
                <Text color={textColor} fontSize="xs" fontWeight="700">{userData._id}</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
