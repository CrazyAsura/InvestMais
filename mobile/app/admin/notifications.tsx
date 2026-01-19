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
  IconButton,
  Heading,
  Pressable
} from 'native-base';
import { FlatList, StyleSheet } from 'react-native';
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

const NotificationItem = React.memo(({ 
  item, 
  onEdit, 
  onDelete 
}: { 
  item: Notification, 
  onEdit: (notif: Notification) => void,
  onDelete: (id: string) => void 
}) => {
  const cardBg = useColorModeValue('white', '#1f2937');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const borderColor = useColorModeValue('coolGray.50', 'coolGray.700');
  const actionBg = useColorModeValue('coolGray.50', 'coolGray.800');

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return { color: 'success.500', icon: 'check-circle', bg: 'success.100' };
      case 'warning': return { color: 'warning.500', icon: 'warning', bg: 'warning.100' };
      case 'error': return { color: 'error.500', icon: 'error', bg: 'error.100' };
      default: return { color: 'blue.500', icon: 'info', bg: 'blue.100' };
    }
  };

  const styles = getTypeStyles(item.type);
  
  return (
    <Box 
      bg={cardBg} 
      p={5} 
      mb={4} 
      borderRadius="3xl" 
      shadow={1}
      borderWidth={1}
      borderColor={borderColor}
    >
      <HStack space={4} alignItems="flex-start">
        <Box p={3} borderRadius="2xl" bg={styles.bg} _dark={{ bg: `${styles.color}:alpha.10` }}>
          <Icon as={<MaterialIcons name={styles.icon as any} />} size={6} color={styles.color} />
        </Box>
        <VStack flex={1} space={1}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="xs" color={textColor} fontWeight="800" numberOfLines={1}>{item.title}</Heading>
            <Text fontSize={10} color={secondaryTextColor} fontWeight="700">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </HStack>
          <Text color={secondaryTextColor} fontSize="sm" lineHeight="sm">{item.message}</Text>
          
          <HStack space={3} mt={3} justifyContent="flex-end">
            <Pressable 
              onPress={() => onEdit(item)}
              p={2}
              borderRadius="xl"
              bg={actionBg}
            >
              <Icon as={<MaterialIcons name="edit" />} size={4} color={secondaryTextColor} />
            </Pressable>
            <Pressable 
              onPress={() => onDelete(item._id)}
              p={2}
              borderRadius="xl"
              bg="error.50"
              _dark={{ bg: 'error.900:alpha.20' }}
            >
              <Icon as={<MaterialIcons name="delete" />} size={4} color="error.500" />
            </Pressable>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
});

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

  const secondaryTextColor = useColorModeValue('coolGray.500', 'coolGray.400');
  const inputBg = useColorModeValue('coolGray.50', '#374151');
  const textColor = useColorModeValue('coolGray.800', 'white');
  const cardBg = useColorModeValue('white', '#1f2937');

  const handleDelete = React.useCallback(async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      toast.show({ description: "Notificação removida", bg: "success.500", placement: "top" });
      fetchNotifications();
    } catch (error) {
      toast.show({ description: "Erro ao remover", bg: "error.500", placement: "top" });
    }
  }, []);

  const openEdit = React.useCallback((notif: Notification) => {
    setEditingNotif(notif);
    setFormData({
      title: notif.title,
      message: notif.message,
      type: notif.type
    });
    setShowModal(true);
  }, []);

  const renderItem = React.useCallback(({ item }: { item: Notification }) => (
    <NotificationItem 
      item={item} 
      onEdit={openEdit} 
      onDelete={handleDelete} 
    />
  ), [openEdit, handleDelete]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar notificações",
        bg: "error.500",
        placement: "top"
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
      toast.show({ description: "Preencha todos os campos", bg: "warning.500", placement: "top" });
      return;
    }

    try {
      if (editingNotif) {
        await api.patch(`/notifications/${editingNotif._id}`, formData);
        toast.show({ description: "Notificação atualizada", bg: "success.500", placement: "top" });
      } else {
        await api.post('/notifications', formData);
        toast.show({ description: "Notificação enviada", bg: "success.500", placement: "top" });
      }
      setShowModal(false);
      setEditingNotif(null);
      setFormData({ title: '', message: '', type: 'info' });
      fetchNotifications();
    } catch (error) {
      toast.show({ description: "Erro ao salvar", bg: "error.500", placement: "top" });
    }
  };

  return (
    <Box flex={1} bg={themeColors.background}>
      <AdminHeader title="Notificações" onMenuPress={() => setIsSidebarOpen(true)} />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <VStack p={4} space={6} flex={1}>
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Heading size="md" color={textColor} fontWeight="800">Alertas</Heading>
            <Text color={secondaryTextColor} fontSize="xs">Gerencie avisos do sistema</Text>
          </VStack>
          <Button 
            leftIcon={<Icon as={<MaterialIcons name="add" />} size="sm" />}
            onPress={() => {
              setEditingNotif(null);
              setFormData({ title: '', message: '', type: 'info' });
              setShowModal(true);
            }}
            bg={themeColors.tint}
            borderRadius="2xl"
            px={5}
            _text={{ fontWeight: '800' }}
            shadow={2}
          >
            Novo
          </Button>
        </HStack>

        {loading ? (
          <Center flex={1}>
            <Spinner size="lg" color={themeColors.tint} />
            <Text mt={4} color={secondaryTextColor} fontWeight="600">Carregando...</Text>
          </Center>
        ) : (
          <FlatList 
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Center mt={20}>
                <Box p={6} borderRadius="full" bg={inputBg} mb={4}>
                  <Icon as={<MaterialIcons name="notifications-none" />} size={10} color={secondaryTextColor} />
                </Box>
                <Text color={secondaryTextColor} fontWeight="700">Nenhuma notificação</Text>
                <Text color={secondaryTextColor} fontSize="xs">Envie um novo aviso para os usuários</Text>
              </Center>
            }
          />
        )}
      </VStack>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content bg={cardBg} borderRadius="3xl" p={2}>
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0} _text={{ color: textColor, fontWeight: '800', fontSize: 'lg' }}>
            {editingNotif ? 'Editar Notificação' : 'Criar Notificação'}
          </Modal.Header>
          <Modal.Body>
            <VStack space={5}>
              <FormInput
                label="Título"
                value={formData.title} 
                onChangeText={v => setFormData({...formData, title: v})}
                placeholder="Ex: Manutenção programada"
                icon="title"
              />
              <FormInput
                label="Mensagem"
                multiline
                numberOfLines={4}
                height={100}
                value={formData.message} 
                onChangeText={v => setFormData({...formData, message: v})}
                placeholder="Descreva a notificação..."
                icon="message"
              />
              <FormControl>
                <FormControl.Label _text={{ fontWeight: '700', fontSize: 'sm', color: textColor }}>Tipo</FormControl.Label>
                <Select 
                  selectedValue={formData.type} 
                  onValueChange={v => setFormData({...formData, type: v})}
                  borderRadius="xl"
                  h={12}
                  bg={inputBg}
                  borderColor="transparent"
                  color={textColor}
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <Icon as={<MaterialIcons name="check" />} size="5" />
                  }}
                >
                  <Select.Item label="Informação" value="info" />
                  <Select.Item label="Sucesso" value="success" />
                  <Select.Item label="Aviso" value="warning" />
                  <Select.Item label="Erro" value="error" />
                </Select>
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} bg={cardBg} justifyContent="flex-end" pb={6}>
            <Button.Group space={3}>
              <Button variant="ghost" colorScheme="coolGray" onPress={() => setShowModal(false)} _text={{ fontWeight: '700' }}>
                Cancelar
              </Button>
              <Button 
                bg={themeColors.tint} 
                onPress={handleSave} 
                borderRadius="xl" 
                px={8}
                _text={{ fontWeight: '800' }}
              >
                {editingNotif ? 'Atualizar' : 'Enviar'}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
