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
  Badge,
  ScrollView
} from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Avatar } from 'native-base';

type Sector = 'administrativo' | 'contabil' | 'acessoria' | 'suporte' | 'rh' | 'ti';

interface Action {
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface Employee {
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

interface SectorInfo {
  title: string;
  icon: string;
  iconType: 'MaterialIcons' | 'MaterialCommunityIcons';
  color: string;
  actions: Action[];
  employees: Employee[];
}

const SECTOR_DATA: Record<Sector, SectorInfo> = {
  administrativo: {
    title: 'Administrativo',
    icon: 'business',
    iconType: 'MaterialIcons',
    color: 'blue.500',
    actions: [
      { label: 'Novo Processo', icon: 'add-business', color: 'blue.600', description: 'Criar novo fluxo interno' },
      { label: 'Fluxos Trabalho', icon: 'account-tree', color: 'blue.600', description: 'Gerenciar processos ativos' },
      { label: 'Documentos', icon: 'description', color: 'blue.600', description: 'Repositório de documentos' },
      { label: 'KPIs Operac.', icon: 'analytics', color: 'blue.600', description: 'Indicadores de eficiência' },
      { label: 'Delegar Tarefa', icon: 'assignment-ind', color: 'blue.600', description: 'Distribuir demandas' },
      { label: 'Orçamentos', icon: 'payments', color: 'blue.600', description: 'Controle orçamentário' },
    ],
    employees: [
      { name: 'Ana Silva', role: 'Gerente Adm', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', status: 'online' },
      { name: 'Carlos Lima', role: 'Analista Pleno', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', status: 'away' },
      { name: 'Beatriz Santos', role: 'Assistente', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', status: 'online' },
    ]
  },
  contabil: {
    title: 'Contábil',
    icon: 'account-balance',
    iconType: 'MaterialIcons',
    color: 'emerald.500',
    actions: [
      { label: 'Notas Fiscais', icon: 'receipt', color: 'emerald.600', description: 'Histórico de notas fiscais em PDF' },
      { label: 'Balanços', icon: 'assessment', color: 'emerald.600', description: 'Relatórios contábeis' },
      { label: 'Contas Pagar/Rec', icon: 'swap-horiz', color: 'emerald.600', description: 'Fluxo financeiro' },
      { label: 'Impostos', icon: 'request-quote', color: 'emerald.600', description: 'Apuração de tributos' },
      { label: 'Auditoria', icon: 'fact_check', color: 'emerald.600', description: 'Verificação de conformidade' },
    ],
    employees: [
      { name: 'Ricardo Oliveira', role: 'Contador Senior', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', status: 'online' },
      { name: 'Mariana Costa', role: 'Analista Fiscal', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', status: 'offline' },
    ]
  },
  acessoria: {
    title: 'Assessoria',
    icon: 'trending-up',
    iconType: 'MaterialIcons',
    color: 'amber.500',
    actions: [
      { label: 'Novo Cliente', icon: 'person-add', color: 'amber.600', description: 'Cadastrar novo investidor' },
      { label: 'Operações', icon: 'currency-exchange', color: 'amber.600', description: 'Registrar movimentações' },
      { label: 'Rentabilidade', icon: 'show-chart', color: 'amber.600', description: 'Análise de performance' },
      { label: 'Metas Comerc.', icon: 'flag', color: 'amber.600', description: 'Acompanhamento de vendas' },
      { label: 'Risco Perfil', icon: 'psychology', color: 'amber.600', description: 'Suitability do cliente' },
    ],
    employees: [
      { name: 'João Pedro', role: 'Assessor Invest.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', status: 'online' },
      { name: 'Sofia Mendes', role: 'Relacionamento', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4', status: 'online' },
    ]
  },
  suporte: {
    title: 'Suporte',
    icon: 'headset-mic',
    iconType: 'MaterialIcons',
    color: 'purple.500',
    actions: [
      { label: 'Novo Ticket', icon: 'add-comment', color: 'purple.600', description: 'Abrir chamado de suporte' },
      { label: 'Gerenciar SLA', icon: 'timer', color: 'purple.600', description: 'Monitorar prazos' },
      { label: 'Escalonar', icon: 'low-priority', color: 'purple.600', description: 'Subir nível do chamado' },
      { label: 'Base Conhec.', icon: 'menu-book', color: 'purple.600', description: 'Tutoriais e FAQs' },
    ],
    employees: [
      { name: 'Lucas Gabriel', role: 'Suporte N2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', status: 'online' },
      { name: 'Elena Vaz', role: 'Atendimento', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b', status: 'away' },
    ]
  },
  rh: {
    title: 'RH',
    icon: 'people',
    iconType: 'MaterialIcons',
    color: 'rose.500',
    actions: [
      { label: 'Admissão', icon: 'person-add-alt', color: 'rose.600', description: 'Processo de contratação' },
      { label: 'Folha Pagto', icon: 'payments', color: 'rose.600', description: 'Gestão de salários' },
      { label: 'Férias/Benef.', icon: 'beach-access', color: 'rose.600', description: 'Controle de ausências' },
      { label: 'Avaliações', icon: 'star_rate', color: 'rose.600', description: 'Feedback e desempenho' },
      { label: 'Treinamentos', icon: 'school', color: 'rose.600', description: 'Capacitação interna' },
    ],
    employees: [
      { name: 'Fernanda Luz', role: 'Business Partner', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', status: 'online' },
    ]
  },
  ti: {
    title: 'TI',
    icon: 'computer',
    iconType: 'MaterialIcons',
    color: 'indigo.500',
    actions: [
      { label: 'Sistemas', icon: 'dvr', color: 'indigo.600', description: 'Status dos serviços' },
      { label: 'Acessos/Roles', icon: 'admin-panel-settings', color: 'indigo.600', description: 'Permissões de usuário' },
      { label: 'Backups/Logs', icon: 'storage', color: 'indigo.600', description: 'Integridade de dados' },
      { label: 'Incidentes', icon: 'report-problem', color: 'indigo.600', description: 'Gestão de crises' },
    ],
    employees: [
      { name: 'Matheus Leon', role: 'CTO', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef', status: 'online' },
      { name: 'Igor Silva', role: 'DevOps', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6', status: 'online' },
    ]
  }
};

export default function SectorDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const sectorKey = id as Sector;
  const sector = SECTOR_DATA[sectorKey];

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', '#050505');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');

  if (!sector) {
    return (
      <Box flex={1} bg={appBg} justifyContent="center" alignItems="center">
        <Text color={themeColors.text}>Setor não encontrado</Text>
        <Pressable onPress={() => router.back()} mt={4}>
          <Text color="blue.500">Voltar</Text>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={appBg}>
      <AdminHeader title={sector.title} showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={4} pb={10}>
          {/* Header do Setor */}
          <Box 
            bg={cardBg} 
            p={6} 
            borderRadius="3xl" 
            shadow={3} 
            borderWidth={1} 
            borderColor={borderColor}
          >
            <HStack space={5} alignItems="center">
              <Center bg={sector.color} p={5} borderRadius="2xl">
                <Icon 
                  as={sector.iconType === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons} 
                  name={sector.icon} 
                  size={10} 
                  color="white" 
                />
              </Center>
              <VStack flex={1}>
                <Heading size="lg" color={themeColors.text}>{sector.title}</Heading>
                <Text color={secondaryTextColor} fontSize="sm">Monitoramento e ferramentas</Text>
                <HStack mt={3} space={2}>
                  <Badge colorScheme="success" variant="solid" rounded="full" _text={{ fontSize: '10', fontWeight: 'bold' }}>ATIVO</Badge>
                  <Badge colorScheme="info" variant="subtle" rounded="full" _text={{ fontSize: '10' }}>{sector.employees.length} MEMBROS</Badge>
                </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Seção de Membros */}
          <VStack space={4}>
            <HStack justifyContent="space-between" alignItems="center" px={1}>
              <Heading size="sm" color={themeColors.text}>Membros da Equipe</Heading>
              <Pressable>
                <Text color={sector.color} fontWeight="bold" fontSize="xs">GERENCIAR</Text>
              </Pressable>
            </HStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} mx={-4} contentContainerStyle={{ paddingHorizontal: 16 }}>
              <HStack space={4}>
                {sector.employees.map((emp, index) => (
                  <VStack key={index} space={2} alignItems="center" bg={cardBg} p={4} borderRadius="2xl" borderWidth={1} borderColor={borderColor} minW={120}>
                    <Box position="relative">
                      <Avatar 
                        source={{ uri: emp.avatar }} 
                        size="md"
                        borderWidth={2}
                        borderColor={sector.color}
                      />
                      <Box 
                        position="absolute" 
                        bottom={0} 
                        right={0} 
                        w={3} 
                        h={3} 
                        rounded="full" 
                        bg={emp.status === 'online' ? 'emerald.500' : emp.status === 'away' ? 'amber.500' : 'coolGray.400'}
                        borderWidth={2}
                        borderColor={cardBg}
                      />
                    </Box>
                    <VStack alignItems="center">
                      <Text fontWeight="bold" fontSize="xs" color={themeColors.text} textAlign="center" numberOfLines={1}>{emp.name}</Text>
                      <Text fontSize="10" color={secondaryTextColor} textAlign="center">{emp.role}</Text>
                    </VStack>
                  </VStack>
                ))}
                <Pressable>
                  <Center bg={cardBg} p={4} borderRadius="2xl" borderWidth={1} borderColor={borderColor} borderStyle="dashed" minW={120} h="full">
                    <Center bg={`${sector.color}15`} p={2} borderRadius="full" mb={2}>
                      <Icon as={MaterialIcons} name="add" size={6} color={sector.color} />
                    </Center>
                    <Text fontWeight="bold" fontSize="xs" color={sector.color}>Adicionar</Text>
                  </Center>
                </Pressable>
              </HStack>
            </ScrollView>
          </VStack>

          <Heading size="sm" color={themeColors.text} px={1}>Ações do Setor</Heading>

          {/* Lista de Ações */}
          <VStack space={3}>
            {sector.actions.map((action, index) => (
              <Pressable 
                key={index}
                onPress={() => {
                  if (sectorKey === 'contabil' && action.label === 'Notas Fiscais') {
                    router.push('/admin/invoices' as any);
                  } else {
                    console.log(`Ação: ${action.label}`);
                  }
                }}
              >
                {({ isPressed }) => (
                  <HStack 
                    bg={cardBg} 
                    p={4} 
                    borderRadius="2xl" 
                    shadow={isPressed ? 1 : 2} 
                    alignItems="center" 
                    space={4}
                    borderWidth={1}
                    borderColor={borderColor}
                    style={{ transform: [{ scale: isPressed ? 0.98 : 1 }] }}
                  >
                    <Center bg={`${action.color}20`} p={3} borderRadius="xl">
                      <Icon as={MaterialIcons} name={action.icon as any} size={6} color={action.color} />
                    </Center>
                    <VStack flex={1}>
                      <Text fontWeight="bold" fontSize="md" color={themeColors.text}>{action.label}</Text>
                      <Text fontSize="xs" color={secondaryTextColor} numberOfLines={1}>{action.description}</Text>
                    </VStack>
                    <Icon as={MaterialIcons} name="chevron-right" size={5} color={secondaryTextColor} />
                  </HStack>
                )}
              </Pressable>
            ))}
          </VStack>

          {/* Resumo de Atividades do Setor */}
          <Box bg={cardBg} p={6} borderRadius="3xl" shadow={2} borderWidth={1} borderColor={borderColor}>
            <HStack justifyContent="space-between" alignItems="center" mb={6}>
              <Heading size="xs" color={themeColors.text}>ESTATÍSTICAS</Heading>
              <Icon as={MaterialIcons} name="bar-chart" color={sector.color} size={5} />
            </HStack>
            
            <VStack space={5}>
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space={3} alignItems="center">
                  <Center bg="blue.100" _dark={{ bg: 'blue.900' }} p={2} borderRadius="lg">
                    <Icon as={MaterialIcons} name="assignment" size={4} color="blue.500" />
                  </Center>
                  <Text color={secondaryTextColor} fontWeight="medium">Tickets Pendentes</Text>
                </HStack>
                <Text fontWeight="bold" color={themeColors.text} fontSize="md">12</Text>
              </HStack>
              
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space={3} alignItems="center">
                  <Center bg="emerald.100" _dark={{ bg: 'emerald.900' }} p={2} borderRadius="lg">
                    <Icon as={MaterialIcons} name="speed" size={4} color="emerald.500" />
                  </Center>
                  <Text color={secondaryTextColor} fontWeight="medium">SLA Médio</Text>
                </HStack>
                <Text fontWeight="bold" color="emerald.500" fontSize="md">98%</Text>
              </HStack>
              
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space={3} alignItems="center">
                  <Center bg="purple.100" _dark={{ bg: 'purple.900' }} p={2} borderRadius="lg">
                    <Icon as={MaterialIcons} name="groups" size={4} color="purple.500" />
                  </Center>
                  <Text color={secondaryTextColor} fontWeight="medium">Membros Ativos</Text>
                </HStack>
                <Text fontWeight="bold" color={themeColors.text} fontSize="md">{sector.employees.length}</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
