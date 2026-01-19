import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  useColorModeValue,
  Center,
  Divider,
  Pressable,
  Switch,
  ScrollView
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminSettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', 'black');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const SettingItem = ({ icon, label, description, hasSwitch = false }: any) => (
    <HStack p={4} justifyContent="space-between" alignItems="center">
      <HStack space={4} flex={1} alignItems="center">
        <Center bg="coolGray.100" _dark={{ bg: 'coolGray.800' }} p={2} borderRadius="lg">
          <Icon as={MaterialIcons} name={icon} size={5} color="coolGray.500" />
        </Center>
        <VStack flex={1}>
          <Text fontWeight="bold" color={themeColors.text}>{label}</Text>
          <Text fontSize="xs" color="coolGray.500">{description}</Text>
        </VStack>
      </HStack>
      {hasSwitch ? (
        <Switch colorScheme="teal" defaultIsChecked />
      ) : (
        <Icon as={MaterialIcons} name="chevron-right" size={5} color="coolGray.300" />
      )}
    </HStack>
  );

  return (
    <Box flex={1} bg={appBg}>
      <AdminHeader title="Configurações" showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} p={4}>
        <VStack space={6} pb={10}>
          <VStack space={4}>
            <Heading size="xs" color="coolGray.500" px={1}>SISTEMA</Heading>
            <Box bg={cardBg} borderRadius="2xl" shadow={2} borderWidth={1} borderColor={borderColor} overflow="hidden">
              <SettingItem 
                icon="notifications-active" 
                label="Notificações Globais" 
                description="Alertas para todos os administradores"
                hasSwitch 
              />
              <Divider />
              <SettingItem 
                icon="security" 
                label="Autenticação em Duas Etapas" 
                description="Obrigatório para cargos administrativos"
                hasSwitch 
              />
              <Divider />
              <SettingItem 
                icon="cloud-upload" 
                label="Backup Automático" 
                description="Sincronizar dados diariamente"
                hasSwitch 
              />
            </Box>
          </VStack>

          <VStack space={4}>
            <Heading size="xs" color="coolGray.500" px={1}>MANUTENÇÃO</Heading>
            <Box bg={cardBg} borderRadius="2xl" shadow={2} borderWidth={1} borderColor={borderColor} overflow="hidden">
              <SettingItem 
                icon="cleaning-services" 
                label="Limpar Cache" 
                description="Remover arquivos temporários do sistema" 
              />
              <Divider />
              <SettingItem 
                icon="update" 
                label="Verificar Atualizações" 
                description="Versão atual: 2.4.0" 
              />
            </Box>
          </VStack>

          <Pressable>
            <Box bg="rose.50" _dark={{ bg: 'rose.900' }} p={4} borderRadius="2xl" borderWidth={1} borderColor="rose.200">
              <HStack space={3} alignItems="center" justifyContent="center">
                <Icon as={MaterialIcons} name="delete-forever" color="rose.600" size={5} />
                <Text color="rose.600" fontWeight="bold">Resetar Dados do Sistema</Text>
              </HStack>
            </Box>
          </Pressable>
        </VStack>
      </ScrollView>
    </Box>
  );
}
