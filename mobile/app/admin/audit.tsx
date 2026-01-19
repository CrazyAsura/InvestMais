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
  Badge,
  Avatar,
  ScrollView
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AuditScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', 'black');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  const logs = [
    { id: '1', user: 'Admin', action: 'Alterou permissões', target: 'Gerente', date: 'Hoje, 10:30', icon: 'lock-open', color: 'orange.500' },
    { id: '2', user: 'Matheus', action: 'Criou novo processo', target: 'ADM-2026-001', date: 'Hoje, 09:15', icon: 'add-circle', color: 'blue.500' },
    { id: '3', user: 'Lucas', action: 'Exportou relatório', target: 'Financeiro Q4', date: 'Ontem, 17:45', icon: 'file-download', color: 'emerald.500' },
    { id: '4', user: 'Admin', action: 'Excluiu usuário', target: 'Joao Silva', date: 'Ontem, 16:20', icon: 'person-remove', color: 'rose.500' },
    { id: '5', user: 'Carla', action: 'Login no sistema', target: 'Web Browser', date: 'Ontem, 08:00', icon: 'login', color: 'indigo.500' },
  ];

  return (
    <Box flex={1} bg={appBg}>
      <AdminHeader title="Auditoria" showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} p={4}>
        <VStack space={6} pb={10}>
          <VStack space={1}>
            <Heading size="md" color={themeColors.text}>Logs de Atividade</Heading>
            <Text color="coolGray.500">Histórico completo de ações realizadas no sistema</Text>
          </VStack>

          <VStack space={3}>
            {logs.map((log) => (
              <Box key={log.id} bg={cardBg} p={4} borderRadius="2xl" shadow={2} borderWidth={1} borderColor={borderColor}>
                <HStack space={4} alignItems="center">
                  <Center bg={`${log.color}15`} p={3} borderRadius="xl">
                    <Icon as={MaterialIcons} name={log.icon as any} size={6} color={log.color} />
                  </Center>
                  <VStack flex={1}>
                    <HStack justifyContent="space-between">
                      <Text fontWeight="bold" color={themeColors.text}>{log.user}</Text>
                      <Text fontSize="10" color="coolGray.400">{log.date}</Text>
                    </HStack>
                    <Text fontSize="sm" color="coolGray.500">
                      {log.action} <Text fontWeight="bold" color={themeColors.text}>{log.target}</Text>
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          <Center p={4}>
            <Text color="coolGray.400" fontSize="xs">Mostrando últimos 50 registros</Text>
          </Center>
        </VStack>
      </ScrollView>
    </Box>
  );
}
