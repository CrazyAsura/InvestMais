import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  Box, 
  Text, 
  Heading, 
  Button, 
  useToast,
  Spinner,
  Center,
  Actionsheet,
  useDisclose,
  HStack,
  Icon,
  Circle
} from 'native-base';
import { StyleSheet, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, DecodedPix } from '@/services/bankingService';

export default function PixScanScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<DecodedPix | null>(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setIsDecoding(true);

    try {
      const decoded = await bankingService.decodePixQrCode(data);
      setDecodedData(decoded);
      onOpen();
    } catch (error: any) {
      toast.show({
        description: "Código Pix inválido",
        bg: "error.500"
      });
      setScanned(false);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!decodedData) return;
    
    onClose();
    // Redirecionar para a tela principal de Pix preenchendo os dados
    router.replace({
      pathname: '/banking/pix',
      params: { 
        amount: decodedData.amount.toString(),
        pixKey: decodedData.pixKey,
        scanned: 'true'
      }
    });
  };

  if (!permission) {
    return <Center flex={1} bg={themeColors.background}><Spinner color={themeColors.tint} /></Center>;
  }

  if (!permission.granted) {
    return (
      <Center flex={1} bg={themeColors.background} p={6}>
        <VStack space={4} alignItems="center">
          <Icon as={<MaterialIcons name="camera-alt" />} size={12} color="coolGray.400" />
          <Text textAlign="center" color={themeColors.text}>Precisamos de permissão para usar a câmera e escanear o QR Code.</Text>
          <Button onPress={requestPermission} bg={themeColors.tint}>Conceder Permissão</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack flex={1} bg="black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      <VStack flex={1} justifyContent="space-between" p={6}>
        <HStack justifyContent="space-between" alignItems="center">
          <Pressable onPress={() => router.back()}>
            <Circle size="10" bg="rgba(0,0,0,0.5)">
              <Icon as={<MaterialIcons name="close" />} color="white" size={6} />
            </Circle>
          </Pressable>
          <Heading color="white" size="md">Escanear QR Code</Heading>
          <Box w="10" />
        </HStack>

        <Center>
          <Box 
            w="64" 
            h="64" 
            borderWidth={2} 
            borderColor="white" 
            rounded="3xl" 
            style={{ backgroundColor: 'transparent' }} 
          />
          <Text color="white" mt={4} fontWeight="medium">Posicione o QR Code no quadrado</Text>
        </Center>

        <Box h="20" />
      </VStack>

      {isDecoding && (
        <Center style={StyleSheet.absoluteFillObject} bg="rgba(0,0,0,0.7)">
          <VStack space={4} alignItems="center">
            <Spinner color="white" size="lg" />
            <Text color="white">Processando código...</Text>
          </VStack>
        </Center>
      )}

      <Actionsheet isOpen={isOpen} onClose={() => {
        onClose();
        setScanned(false);
      }}>
        <Actionsheet.Content>
          <Box w="100%" p={6}>
            <VStack space={4}>
              <Heading size="md">Confirmar Dados do Pix</Heading>
              
              <VStack space={1}>
                <Text fontSize="xs" color="coolGray.500" fontWeight="bold">Recebedor</Text>
                <Text fontSize="lg" fontWeight="medium">{decodedData?.receiverName}</Text>
              </VStack>

              <VStack space={1}>
                <Text fontSize="xs" color="coolGray.500" fontWeight="bold">Chave Pix</Text>
                <Text fontSize="md">{decodedData?.pixKey}</Text>
              </VStack>

              <VStack space={1}>
                <Text fontSize="xs" color="coolGray.500" fontWeight="bold">Valor</Text>
                <Text fontSize="2xl" fontWeight="bold" color={themeColors.tint}>
                  R$ {decodedData?.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </VStack>

              <Button 
                onPress={handleConfirmPayment}
                bg={themeColors.tint}
                mt={4}
                rounded="xl"
                h={12}
              >
                Continuar para Pagamento
              </Button>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}

