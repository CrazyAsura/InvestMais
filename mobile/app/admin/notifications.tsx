import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Button, 
  Modal, 
  FormControl, 
  Select, 
  useToast,
  Spinner,
  useColorModeValue,
  Center,
  IconButton
} from 'native-base';
import { FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '@/services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FormInput } from '@/components/ui/form-input';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
}

export default function NotificationsManagement() {
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotif, setEditingNotif] = useState<Notification | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const cardBg = useColorModeValue('white', 'coolGray.800');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar notificações",
        bg: "error.500"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.message) {
      toast.show({ description: "Preencha todos os campos", bg: "warning.500" });
      return;
    }

    try {
      if (editingNotif) {
        await api.patch(`/notifications/${editingNotif._id}`, formData);
        toast.show({ description: "Notificação atualizada", bg: "success.500" });
      } else {
        await api.post('/notifications', formData);
        toast.show({ description: "Notificação enviada", bg: "success.500" });
      }
      setShowModal(false);
      setEditingNotif(null);
      setFormData({ title: '', message: '', type: 'info' });
      fetchNotifications();
    } catch (error) {
      toast.show({ description: "Erro ao salvar", bg: "error.500" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      toast.show({ description: "Notificação removida", bg: "success.500" });
      fetchNotifications();
    } catch (error) {
      toast.show({ description: "Erro ao remover", bg: "error.500" });
    }
  };

  const openEdit = (notif: Notification) => {
    setEditingNotif(notif);
    setFormData({
      title: notif.title,
      message: notif.message,
      type: notif.type
    });
    setShowModal(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'success.500';
      case 'warning': return 'warning.500';
      case 'error': return 'error.500';
      default: return 'info.500';
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Box bg={cardBg} p={4} mb={3} borderRadius="xl" shadow={1}>
      <HStack justifyContent="space-between" alignItems="flex-start">
        <VStack space={1} flex={1}>
          <HStack space={2} alignItems="center">
            <Box w={2} h={2} borderRadius="full" bg={getTypeColor(item.type)} />
            <Text fontWeight="bold" fontSize="md" color={themeColors.text}>{item.title}</Text>
          </HStack>
          <Text color="coolGray.500" fontSize="sm">{item.message}</Text>
          <Text fontSize="xs" color="coolGray.400" mt={2}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </VStack>
        <HStack space={2}>
          <IconButton 
            icon={<Icon as={<MaterialIcons name="edit" />} size={4} color="coolGray.400" />} 
            onPress={() => openEdit(item)}
          />
          <IconButton 
            icon={<Icon as={<MaterialIcons name="delete" />} size={4} color="error.500" />} 
            onPress={() => handleDelete(item._id)}
          />
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Notificações" onMenuPress={() => setIsSidebarOpen(true)} />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <VStack p={4} space={4} flex={1}>
        <Button 
          leftIcon={<Icon as={<MaterialIcons name="add" />} size="sm" />}
          onPress={() => {
            setEditingNotif(null);
            setFormData({ title: '', message: '', type: 'info' });
            setShowModal(true);
          }}
          bg={themeColors.tint}
          borderRadius="xl"
        >
          Nova Notificação
        </Button>

        {loading ? (
          <Center flex={1}>
            <Spinner size="lg" color={themeColors.tint} />
          </Center>
        ) : (
          <FlatList 
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Center mt={10}>
                <Text color="coolGray.500">Nenhuma notificação encontrada</Text>
              </Center>
            }
          />
        )}
      </VStack>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content bg={cardBg}>
          <Modal.CloseButton />
          <Modal.Header _text={{ color: themeColors.text }}>
            {editingNotif ? 'Editar Notificação' : 'Criar Notificação'}
          </Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <FormInput
                label="Título"
                value={formData.title} 
                onChangeText={v => setFormData({...formData, title: v})}
                placeholder="Ex: Manutenção programada"
              />
              <FormInput
                label="Mensagem"
                multiline
                numberOfLines={4}
                height={120}
                value={formData.message} 
                onChangeText={v => setFormData({...formData, message: v})}
                placeholder="Descreva a notificação..."
              />
              <FormControl>
                <FormControl.Label _text={{ color: themeColors.text }}>Tipo</FormControl.Label>
                <Select 
                  selectedValue={formData.type} 
                  onValueChange={v => setFormData({...formData, type: v})}
                  color={themeColors.text}
                >
                  <Select.Item label="Informação" value="info" />
                  <Select.Item label="Sucesso" value="success" />
                  <Select.Item label="Aviso" value="warning" />
                  <Select.Item label="Erro" value="error" />
                </Select>
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer bg={cardBg}>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="coolGray" onPress={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button bg={themeColors.tint} onPress={handleSave}>
                Salvar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
