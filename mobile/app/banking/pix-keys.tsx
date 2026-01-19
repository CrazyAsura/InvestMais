import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  HStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  Pressable, 
  Button, 
  useToast,
  ScrollView,
  Spinner,
  Actionsheet,
  useDisclose,
  Select,
  CheckIcon,
  Menu
} from 'native-base';
import { FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, PixKey } from '@/services/bankingService';
import { FormInput } from '@/components/ui/form-input';

export default function PixKeysScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [keys, setKeys] = useState<PixKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyType, setNewKeyType] = useState('CPF');
  const [newKeyValue, setNewKeyValue] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setIsLoading(true);
      const data = await bankingService.getPixKeys();
      setKeys(data);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar chaves Pix",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyValue) {
      toast.show({
        description: "Informe o valor da chave",
        bg: "warning.500"
      });
      return;
    }

    setIsCreating(true);
    try {
      await bankingService.createPixKey(newKeyType, newKeyValue);
      toast.show({
        description: "Chave Pix criada com sucesso!",
        bg: "success.500"
      });
      setNewKeyValue('');
      onClose();
      loadKeys();
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || "Erro ao criar chave Pix",
        bg: "error.500"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await bankingService.deletePixKey(id);
      toast.show({
        description: "Chave Pix excluída com sucesso",
        bg: "success.500"
      });
      loadKeys();
    } catch (error) {
      toast.show({
        description: "Erro ao excluir chave Pix",
        bg: "error.500"
      });
    }
  };

  const handleToggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      await bankingService.updatePixKey(id, !currentStatus);
      toast.show({
        description: `Chave Pix ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`,
        bg: "success.500"
      });
      loadKeys();
    } catch (error) {
      toast.show({
        description: "Erro ao atualizar chave Pix",
        bg: "error.500"
      });
    }
  };

  const renderKeyItem = ({ item }: { item: PixKey }) => (
    <Box 
      bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} 
      p={4} 
      rounded="xl" 
      shadow={1} 
      mb={3}
      opacity={item.active ? 1 : 0.6}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <VStack>
          <HStack space={2} alignItems="center">
            <Text fontSize="xs" color="coolGray.500" fontWeight="bold">{item.type}</Text>
            {!item.active && (
              <Box bg="coolGray.200" px={2} py={0.5} rounded="sm">
                <Text fontSize="10px" color="coolGray.600">INATIVA</Text>
              </Box>
            )}
          </HStack>
          <Text fontSize="md" color={themeColors.text}>{item.value}</Text>
        </VStack>
        
        <Menu 
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps}>
                <Icon as={<MaterialIcons name="more-vert" />} size={6} color="coolGray.400" />
              </Pressable>
            );
          }}
        >
          <Menu.Item onPress={() => handleToggleKeyStatus(item._id, item.active)}>
            <HStack space={2} alignItems="center">
              <Icon as={<MaterialIcons name={item.active ? "block" : "check-circle"} />} size={4} />
              <Text>{item.active ? "Desativar" : "Ativar"}</Text>
            </HStack>
          </Menu.Item>
          <Menu.Item onPress={() => handleDeleteKey(item._id)}>
            <HStack space={2} alignItems="center">
              <Icon as={<MaterialIcons name="delete-outline" />} size={4} color="error.500" />
              <Text color="error.500">Excluir</Text>
            </HStack>
          </Menu.Item>
        </Menu>
      </HStack>
    </Box>
  );

  return (
    <VStack flex={1} bg={themeColors.background} p={6}>
      <HStack justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color={themeColors.text}>Minhas Chaves</Heading>
        <Button 
          size="sm" 
          variant="ghost" 
          onPress={onOpen}
          leftIcon={<Icon as={<MaterialIcons name="add" />} size={4} />}
        >
          Nova Chave
        </Button>
      </HStack>

      {isLoading ? (
        <Spinner color={themeColors.tint} />
      ) : (
        <FlatList 
          data={keys}
          renderItem={renderKeyItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={
            <VStack space={4} alignItems="center" mt={10}>
              <Icon as={<MaterialIcons name="vpn-key" />} size={12} color="coolGray.400" />
              <Text color="coolGray.500">Você ainda não tem chaves Pix cadastradas.</Text>
            </VStack>
          }
        />
      )}

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" p={4}>
            <Heading size="md" mb={4}>Cadastrar Nova Chave</Heading>
            
            <VStack space={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Tipo de Chave</Text>
                <Select 
                  selectedValue={newKeyType} 
                  minWidth="200" 
                  accessibilityLabel="Escolha o tipo" 
                  placeholder="Escolha o tipo" 
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }} 
                  mt={1} 
                  onValueChange={itemValue => setNewKeyType(itemValue)}
                >
                  <Select.Item label="CPF" value="CPF" />
                  <Select.Item label="E-mail" value="EMAIL" />
                  <Select.Item label="Telefone" value="PHONE" />
                  <Select.Item label="Chave Aleatória" value="RANDOM" />
                </Select>
              </Box>

              <FormInput 
                label="Valor da Chave"
                placeholder={newKeyType === 'RANDOM' ? 'Gerar automaticamente' : 'Digite o valor'}
                value={newKeyValue}
                onChangeText={setNewKeyValue}
              />

              <Button 
                onPress={handleCreateKey} 
                isLoading={isCreating}
                bg={themeColors.tint}
                mt={4}
                rounded="xl"
              >
                Cadastrar Chave
              </Button>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
