import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Heading, 
  useColorModeValue,
  Center,
  Pressable,
  ScrollView,
  Spinner,
  Badge,
  Divider,
  Button,
  useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { bankingService } from '@/services/bankingService';
import { StoreService } from '@/services/storeService';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs';

interface InvoiceData {
  id: string;
  type: 'transaction' | 'order';
  title: string;
  amount: number;
  date: string;
  status: string;
  details: any;
}

export default function InvoicesHistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  const cardBg = useColorModeValue('white', 'coolGray.900');
  const appBg = useColorModeValue('coolGray.50', 'black');
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactions, orders] = await Promise.all([
        bankingService.getTransactions(),
        StoreService.getOrders()
      ]);

      const formattedTransactions: InvoiceData[] = transactions.map((t: any) => ({
        id: t._id,
        type: 'transaction',
        title: t.description || 'Transação Bancária',
        amount: t.amount,
        date: t.date,
        status: 'Concluído',
        details: t
      }));

      const formattedOrders: InvoiceData[] = orders.map((o: any) => ({
        id: o._id,
        type: 'order',
        title: `Pedido #${o._id.substring(o._id.length - 6).toUpperCase()}`,
        amount: o.totalPrice,
        date: o.createdAt,
        status: o.status,
        details: o
      }));

      const allInvoices = [...formattedTransactions, ...formattedOrders].sort((a, b) => 
        dayjs(b.date).unix() - dayjs(a.date).unix()
      );

      setInvoices(allInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.show({
        description: "Erro ao carregar histórico de notas fiscais",
        placement: "top",
        bg: "red.500"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (invoice: InvoiceData) => {
    try {
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .subtitle { font-size: 14px; color: #666; }
              .section { margin-bottom: 20px; }
              .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .label { font-weight: bold; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
              .total { font-size: 20px; font-weight: bold; color: #000; margin-top: 10px; border-top: 2px solid #000; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">InvestMais - Nota Fiscal</div>
              <div class="subtitle">Documento Auxiliar de Transação</div>
            </div>

            <div class="section">
              <div class="section-title">Informações do Documento</div>
              <div class="row"><span class="label">ID:</span> <span>${invoice.id}</span></div>
              <div class="row"><span class="label">Data:</span> <span>${dayjs(invoice.date).format('DD/MM/YYYY HH:mm')}</span></div>
              <div class="row"><span class="label">Tipo:</span> <span>${invoice.type === 'transaction' ? 'Transação Bancária' : 'Compra na Loja'}</span></div>
              <div class="row"><span class="label">Status:</span> <span>${invoice.status}</span></div>
            </div>

            <div class="section">
              <div class="section-title">Detalhes</div>
              <div class="row"><span class="label">Descrição:</span> <span>${invoice.title}</span></div>
              ${invoice.type === 'order' ? `
                <div style="margin-top: 10px;">
                  <div class="label">Itens:</div>
                  ${invoice.details.items.map((item: any) => `
                    <div class="row" style="margin-left: 10px; font-size: 14px;">
                      <span>${item.product?.name || 'Produto'} x${item.quantity}</span>
                      <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <div class="total">
              <div class="row">
                <span>TOTAL</span>
                <span>R$ ${invoice.amount.toFixed(2)}</span>
              </div>
            </div>

            <div class="footer">
              Este é um documento gerado eletronicamente pelo sistema InvestMais.<br/>
              © ${new Date().getFullYear()} InvestMais Inc. Todos os direitos reservados.
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.show({
        description: "Erro ao gerar PDF da nota fiscal",
        placement: "top",
        bg: "red.500"
      });
    }
  };

  return (
    <Box flex={1} bg={appBg}>
      <AdminHeader title="Histórico de Notas Fiscais" showBackButton />
      
      {loading ? (
        <Center flex={1}>
          <Spinner size="lg" color={themeColors.tint} />
          <Text mt={2} color="coolGray.500">Carregando notas fiscais...</Text>
        </Center>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} p={4}>
          <VStack space={4} pb={10}>
            {invoices.length === 0 ? (
              <Center py={20}>
                <Icon as={MaterialIcons} name="receipt-long" size={16} color="coolGray.300" />
                <Text color="coolGray.500" mt={4} fontSize="lg">Nenhuma nota fiscal encontrada</Text>
              </Center>
            ) : (
              invoices.map((invoice) => (
                <Box 
                  key={invoice.id}
                  bg={cardBg} 
                  p={4} 
                  borderRadius="2xl" 
                  shadow={2} 
                  borderWidth={1} 
                  borderColor={borderColor}
                >
                  <HStack justifyContent="space-between" alignItems="flex-start">
                    <VStack space={1} flex={1}>
                      <HStack space={2} alignItems="center">
                        <Icon 
                          as={MaterialIcons} 
                          name={invoice.type === 'transaction' ? 'account-balance-wallet' : 'shopping-bag'} 
                          size={5} 
                          color={invoice.type === 'transaction' ? 'blue.500' : 'emerald.500'} 
                        />
                        <Text fontWeight="bold" fontSize="md" color={themeColors.text} numberOfLines={1}>
                          {invoice.title}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="coolGray.500">
                        {dayjs(invoice.date).format('DD/MM/YYYY [às] HH:mm')}
                      </Text>
                      <HStack mt={1} space={2}>
                        <Badge 
                          colorScheme={invoice.type === 'transaction' ? 'blue' : 'emerald'} 
                          variant="subtle" 
                          rounded="full"
                          _text={{ fontSize: '10px' }}
                        >
                          {invoice.type === 'transaction' ? 'Transação' : 'Compra'}
                        </Badge>
                        <Badge 
                          colorScheme={invoice.status === 'paid' || invoice.status === 'Concluído' ? 'success' : 'warning'} 
                          variant="subtle" 
                          rounded="full"
                          _text={{ fontSize: '10px' }}
                        >
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </HStack>
                    </VStack>
                    
                    <VStack alignItems="flex-end" space={2}>
                      <Text fontWeight="bold" fontSize="lg" color={themeColors.text}>
                        R$ {invoice.amount.toFixed(2)}
                      </Text>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        colorScheme="emerald"
                        leftIcon={<Icon as={MaterialIcons} name="picture-as-pdf" size={4} />}
                        onPress={() => generatePDF(invoice)}
                        rounded="xl"
                      >
                        PDF
                      </Button>
                    </VStack>
                  </HStack>
                </Box>
              ))
            )}
          </VStack>
        </ScrollView>
      )}
    </Box>
  );
}
