import React, { useState } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Pressable, 
  Heading, 
  Divider,
  useColorModeValue,
  Center,
  SimpleGrid,
  Progress,
  Badge
} from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';

type Sector = 'administrativo' | 'contabil' | 'acessoria' | 'suporte' | 'rh' | 'ti';

interface SectorInfo {
  title: string;
  icon: any;
  iconType: 'MaterialIcons' | 'MaterialCommunityIcons';
  color: string;
  stats: { label: string; value: string; progress?: number }[];
  actions: { label: string; icon: string; color: string }[];
}

const SECTORS: Record<Sector, SectorInfo> = {
  administrativo: {
    title: 'Administrativo',
    icon: 'business',
    iconType: 'MaterialIcons',
    color: 'blue.500',
    stats: [
      { label: 'Processos Ativos', value: '24', progress: 65 },
      { label: 'Eficiência Mensal', value: '92%', progress: 92 },
      { label: 'SLA Interno', value: '95%', progress: 95 },
      { label: 'Gargalos', value: '2' },
    ],
    actions: [
      { label: 'Novo Processo', icon: 'add-business', color: 'blue.600' },
      { label: 'Fluxos Trabalho', icon: 'account-tree', color: 'blue.600' },
      { label: 'Documentos', icon: 'description', color: 'blue.600' },
      { label: 'KPIs Operac.', icon: 'analytics', color: 'blue.600' },
      { label: 'Delegar Tarefa', icon: 'assignment-ind', color: 'blue.600' },
      { label: 'Orçamentos', icon: 'payments', color: 'blue.600' },
    ]
  },
  contabil: {
    title: 'Contábil',
    icon: 'account-balance',
    iconType: 'MaterialIcons',
    color: 'emerald.500',
    stats: [
      { label: 'Fluxo de Caixa', value: 'R$ 450k', progress: 80 },
      { label: 'Obrigações Fiscais', value: '100%', progress: 100 },
      { label: 'Conformidade', value: '98%', progress: 98 },
    ],
    actions: [
      { label: 'Emitir NF-e', icon: 'receipt', color: 'emerald.600' },
      { label: 'Balanços', icon: 'assessment', color: 'emerald.600' },
      { label: 'Contas Pagar/Rec', icon: 'swap-horiz', color: 'emerald.600' },
      { label: 'Impostos', icon: 'request-quote', color: 'emerald.600' },
      { label: 'Auditoria', icon: 'fact_check', color: 'emerald.600' },
    ]
  },
  acessoria: {
    title: 'Assessoria',
    icon: 'trending-up',
    iconType: 'MaterialIcons',
    color: 'amber.500',
    stats: [
      { label: 'AUM Total', value: 'R$ 2.5M', progress: 75 },
      { label: 'Captação Líquida', value: 'R$ 120k', progress: 60 },
      { label: 'ROI Médio', value: '12.5%' },
    ],
    actions: [
      { label: 'Novo Cliente', icon: 'person-add', color: 'amber.600' },
      { label: 'Operações', icon: 'currency-exchange', color: 'amber.600' },
      { label: 'Rentabilidade', icon: 'show-chart', color: 'amber.600' },
      { label: 'Metas Comerc.', icon: 'flag', color: 'amber.600' },
      { label: 'Risco Perfil', icon: 'psychology', color: 'amber.600' },
    ]
  },
  suporte: {
    title: 'Suporte',
    icon: 'headset-mic',
    iconType: 'MaterialIcons',
    color: 'purple.500',
    stats: [
      { label: 'Tickets Abertos', value: '8', progress: 20 },
      { label: 'SLA Atendido', value: '98%', progress: 98 },
      { label: 'TMA Médio', value: '15 min' },
    ],
    actions: [
      { label: 'Novo Ticket', icon: 'add-comment', color: 'purple.600' },
      { label: 'Gerenciar SLA', icon: 'timer', color: 'purple.600' },
      { label: 'Escalonar', icon: 'low-priority', color: 'purple.600' },
      { label: 'Base Conhec.', icon: 'menu-book', color: 'purple.600' },
    ]
  },
  rh: {
    title: 'RH',
    icon: 'people',
    iconType: 'MaterialIcons',
    color: 'rose.500',
    stats: [
      { label: 'Headcount', value: '42', progress: 100 },
      { label: 'Turnover', value: '2.1%', progress: 90 },
      { label: 'Recrutamento', value: '3', progress: 30 },
    ],
    actions: [
      { label: 'Admissão', icon: 'person-add-alt', color: 'rose.600' },
      { label: 'Folha Pagto', icon: 'payments', color: 'rose.600' },
      { label: 'Férias/Benef.', icon: 'beach-access', color: 'rose.600' },
      { label: 'Avaliações', icon: 'star_rate', color: 'rose.600' },
      { label: 'Treinamentos', icon: 'school', color: 'rose.600' },
    ]
  },
  ti: {
    title: 'TI',
    icon: 'computer',
    iconType: 'MaterialIcons',
    color: 'indigo.500',
    stats: [
      { label: 'Uptime Sistemas', value: '100%', progress: 100 },
      { label: 'Segurança', value: 'OK', progress: 100 },
      { label: 'Uso CPU/Mem', value: '45%', progress: 45 },
    ],
    actions: [
      { label: 'Sistemas', icon: 'dvr', color: 'indigo.600' },
      { label: 'Acessos/Roles', icon: 'admin-panel-settings', color: 'indigo.600' },
      { label: 'Backups/Logs', icon: 'storage', color: 'indigo.600' },
      { label: 'Incidentes', icon: 'report-problem', color: 'indigo.600' },
    ]
  }
};


export default function EmployeesScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [selectedSector, setSelectedSector] = useState<Sector>('administrativo');

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', 'black');
  const borderColor = useColorModeValue('coolGray.200', 'coolGray.800');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const headingColor = useColorModeValue('coolGray.800', 'white');
  const sectorInfo = SECTORS[selectedSector];

  return (
    <Box flex={1} bg={appBg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <VStack space={6} p={4} pb={10}>
          <VStack space={1}>
            <Heading size="xl" color={headingColor}>Setores</Heading>
            <Text color={secondaryTextColor} fontSize="md">Gestão e monitoramento por departamento</Text>
          </VStack>

          {/* Seletor de Setores */}
          <Box mx={-4}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              <HStack space={3} pb={4}>
                {(Object.keys(SECTORS) as Sector[]).map((key) => {
                  const isSelected = selectedSector === key;
                  const info = SECTORS[key];
                  return (
                    <Pressable 
                      key={key}
                      onPress={() => setSelectedSector(key)}
                    >
                      <VStack 
                        bg={isSelected ? info.color : cardBg} 
                        p={4} 
                        borderRadius="2xl" 
                        alignItems="center" 
                        justifyContent="center"
                        minW={width * 0.28}
                        maxW={width * 0.35}
                        shadow={isSelected ? 4 : 1}
                        borderWidth={1}
                        borderColor={isSelected ? info.color : borderColor}
                      >
                        <Center 
                          bg={isSelected ? 'white:alpha.20' : `${info.color}15`} 
                          p={3} 
                          borderRadius="full"
                          mb={2}
                        >
                          <Icon 
                            as={info.iconType === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons} 
                            name={info.icon} 
                            size={6} 
                            color={isSelected ? 'white' : info.color} 
                          />
                        </Center>
                        <Text 
                          fontSize="xs" 
                          fontWeight="bold" 
                          color={isSelected ? 'white' : headingColor}
                          textAlign="center"
                          numberOfLines={1}
                        >
                          {info.title}
                        </Text>
                      </VStack>
                    </Pressable>
                  );
                })}
              </HStack>
            </ScrollView>
          </Box>

          {/* Dashboard do Setor */}
          <VStack space={5}>
            <Box 
              bg={cardBg} 
              p={5} 
              borderRadius="3xl" 
              borderWidth={1} 
              borderColor={borderColor}
              shadow={2}
            >
              <HStack alignItems="center" justifyContent="space-between" mb={6}>
                <HStack space={3} alignItems="center">
                  <Center p={3} borderRadius="2xl" bg={sectorInfo.color}>
                    <Icon 
                      as={sectorInfo.iconType === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons} 
                      name={sectorInfo.icon} 
                      size={6} 
                      color="white" 
                    />
                  </Center>
                  <VStack>
                    <Heading size="md" color={headingColor}>{sectorInfo.title}</Heading>
                    <HStack space={1} alignItems="center">
                      <Box w={2} h={2} rounded="full" bg="emerald.500" />
                      <Text fontSize="xs" color="emerald.500" fontWeight="bold">SISTEMA ATIVO</Text>
                    </HStack>
                  </VStack>
                </HStack>
                <Pressable onPress={() => router.push(`/admin/sectors/${selectedSector}` as Href)}>
                  <Center bg="coolGray.100" _dark={{ bg: 'coolGray.800' }} p={2.5} borderRadius="full">
                    <Icon as={MaterialIcons} name="arrow-forward" size={5} color={headingColor} />
                  </Center>
                </Pressable>
              </HStack>

              <SimpleGrid columns={width > 400 ? 2 : 1} space={4}>
                {sectorInfo.stats.map((stat, index) => (
                  <VStack key={index} space={1} p={2} bg="coolGray.50" _dark={{ bg: 'coolGray.800' }} borderRadius="xl">
                    <Text fontSize="xs" color={secondaryTextColor} fontWeight="medium">{stat.label}</Text>
                    <Text fontSize="lg" fontWeight="bold" color={headingColor}>{stat.value}</Text>
                    {stat.progress !== undefined && (
                      <Progress 
                        mt={1} 
                        value={stat.progress} 
                        size="xs" 
                        rounded="full"
                        colorScheme={stat.progress > 80 ? 'emerald' : stat.progress > 50 ? 'blue' : 'amber'} 
                        bg="coolGray.200"
                        _dark={{ bg: 'coolGray.700' }}
                      />
                    )}
                  </VStack>
                ))}
              </SimpleGrid>
            </Box>

            {/* Ações Rápidas */}
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between" px={1}>
                <Heading size="sm" color={headingColor}>Ações Rápidas</Heading>
                <Pressable>
                  <Text color={sectorInfo.color} fontWeight="bold" fontSize="xs">VER TODAS</Text>
                </Pressable>
              </HStack>
              
              <SimpleGrid columns={width > 400 ? 2 : 1} space={3}>
                {sectorInfo.actions.slice(0, 4).map((action, index) => (
                  <Pressable 
                    key={index}
                    onPress={() => router.push(`/admin/sectors/${selectedSector}` as Href)}
                  >
                    <HStack 
                      bg={cardBg} 
                      p={4} 
                      borderRadius="2xl" 
                      shadow={1} 
                      alignItems="center" 
                      space={3}
                      borderWidth={1}
                      borderColor={borderColor}
                    >
                      <Center bg={`${action.color}20`} p={2.5} borderRadius="xl">
                        <Icon as={MaterialIcons} name={action.icon as any} size={5} color={action.color} />
                      </Center>
                      <Text fontWeight="bold" fontSize="xs" color={headingColor} flex={1}>{action.label}</Text>
                    </HStack>
                  </Pressable>
                ))}
              </SimpleGrid>
            </VStack>

            {/* Desempenho */}
            <Box bg={cardBg} p={6} borderRadius="3xl" shadow={2} borderWidth={1} borderColor={borderColor}>
              <HStack justifyContent="space-between" alignItems="center" mb={6}>
                <VStack>
                  <Text fontWeight="bold" fontSize="md" color={headingColor}>Desempenho Semanal</Text>
                  <Text fontSize="xs" color={secondaryTextColor}>Métricas de produtividade</Text>
                </VStack>
                <Icon as={MaterialIcons} name="insights" color={sectorInfo.color} size={6} />
              </HStack>
              
              <HStack h={32} alignItems="flex-end" justifyContent="space-between" space={2}>
                {[40, 60, 45, 90, 70, 85, 100].map((h, i) => (
                  <VStack key={i} flex={1} alignItems="center" space={2}>
                    <Box 
                      w="full" 
                      h={`${h}%`} 
                      bg={i === 6 ? sectorInfo.color : `${sectorInfo.color}30`} 
                      borderRadius="lg"
                    />
                    <Text fontSize="10" fontWeight="bold" color={secondaryTextColor}>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</Text>
                  </VStack>
                ))}
              </HStack>
            </Box>

            {/* Ações de Administração */}
            {isAdmin && (
              <VStack space={4} mt={4}>
                <Divider bg={borderColor} />
                <HStack space={2} alignItems="center" px={1}>
                  <Icon as={MaterialIcons} name="admin-panel-settings" size={6} color={secondaryTextColor} />
                  <Heading size="sm" color={headingColor}>Administração Global</Heading>
                </HStack>
                
                <SimpleGrid columns={width > 400 ? 3 : 2} space={3}>
                  {[
                    { label: 'Setores', icon: 'category', color: 'blue.500' },
                    { label: 'Acessos', icon: 'lock-open', color: 'orange.500' },
                    { label: 'Auditoria', icon: 'history_edu', color: 'purple.500' },
                  ].map((action, index) => (
                    <Pressable key={index} flex={1}>
                      <VStack 
                        bg={cardBg} 
                        p={4} 
                        borderRadius="2xl" 
                        alignItems="center" 
                        space={2}
                        borderWidth={1}
                        borderColor={borderColor}
                        shadow={1}
                      >
                        <Center bg={`${action.color}15`} p={3} borderRadius="full">
                          <Icon as={MaterialIcons} name={action.icon as any} size={5} color={action.color} />
                        </Center>
                        <Text fontWeight="bold" fontSize="xs" color={headingColor} textAlign="center">{action.label}</Text>
                      </VStack>
                    </Pressable>
                  ))}
                </SimpleGrid>
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
