import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  Pressable, 
  useColorModeValue,
  Center,
  Switch,
  Divider,
  Badge,
  ScrollView
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function PermissionsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', 'black');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const roles = [
    { id: 'admin', label: 'Administrador', color: 'error.500' },
    { id: 'manager', label: 'Gerente', color: 'warning.500' },
    { id: 'user', label: 'Usuário', color: 'blue.500' },
  ];

  const permissions = [
    { id: 'view_dashboards', label: 'Visualizar Dashboards', description: 'Acesso aos gráficos e KPIs globais' },
    { id: 'manage_users', label: 'Gerenciar Usuários', description: 'Criar, editar e excluir colaboradores' },
    { id: 'edit_settings', label: 'Alterar Configurações', description: 'Acesso às configurações do sistema' },
    { id: 'view_audit', label: 'Ver Auditoria', description: 'Acesso aos logs de ações' },
    { id: 'manage_financial', label: 'Gestão Financeira', description: 'Acesso a dados contábeis e fiscais' },
  ];

  return (
    <Box flex={1} bg={appBg}>
      <AdminHeader title="Permissões" showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} p={4}>
        <VStack space={6} pb={10}>
          <VStack space={1}>
            <Heading size="md" color={themeColors.text}>Controle de Acesso</Heading>
            <Text color="coolGray.500">Defina o que cada cargo pode acessar no sistema</Text>
          </VStack>

          {/* Seletor de Cargo */}
          <HStack space={2} pb={2}>
            {roles.map((role) => (
              <Pressable key={role.id} flex={1}>
                <Center 
                  bg={role.id === 'admin' ? role.color : cardBg} 
                  p={3} 
                  borderRadius="xl" 
                  borderWidth={1} 
                  borderColor={role.id === 'admin' ? role.color : borderColor}
                >
                  <Text fontWeight="bold" color={role.id === 'admin' ? 'white' : themeColors.text}>
                    {role.label}
                  </Text>
                </Center>
              </Pressable>
            ))}
          </HStack>

          {/* Lista de Permissões */}
          <VStack bg={cardBg} borderRadius="2xl" shadow={2} borderWidth={1} borderColor={borderColor} overflow="hidden">
            {permissions.map((perm, index) => (
              <Box key={perm.id}>
                <HStack p={4} justifyContent="space-between" alignItems="center">
                  <VStack flex={1} space={1}>
                    <Text fontWeight="bold" color={themeColors.text}>{perm.label}</Text>
                    <Text fontSize="xs" color="coolGray.500">{perm.description}</Text>
                  </VStack>
                  <Switch colorScheme="teal" defaultIsChecked={index < 2} />
                </HStack>
                {index < permissions.length - 1 && <Divider />}
              </Box>
            ))}
          </VStack>

          <Box bg="teal.600" p={4} borderRadius="2xl" shadow={4}>
            <HStack space={3} alignItems="center">
              <Icon as={MaterialIcons} name="info" color="white" size={6} />
              <Text color="white" fontSize="sm" flex={1}>
                As alterações de permissão entram em vigor imediatamente para todos os usuários do cargo selecionado.
              </Text>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
