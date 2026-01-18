import React, { useState } from 'react';
import { Modal, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { 
  Box, 
  Text, 
  HStack, 
  Icon, 
  VStack, 
  Pressable,
  Divider,
  Heading
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Option {
  label: string;
  value: string | number;
}

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value?: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
  loading?: boolean;
  error?: string;
}

export const SearchableSelect = ({ 
  label, 
  options, 
  value, 
  onSelect, 
  placeholder = 'Selecione...',
  loading = false,
  error
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <VStack space={1} w="100%">
      <Text fontSize="sm" fontWeight="bold" color={themeColors.text}>
        {label}
      </Text>
      
      <Pressable onPress={() => setIsOpen(true)}>
        <HStack 
          bg={colorScheme === 'dark' ? '#1f2937' : '#f3f4f6'} 
          p="3" 
          rounded="md" 
          alignItems="center" 
          justifyContent="space-between"
          borderWidth={1}
          borderColor={error ? 'red.500' : 'transparent'}
        >
          <Text color={selectedOption ? themeColors.text : themeColors.icon}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Icon as={<MaterialIcons name="arrow-drop-down" />} size={5} color={themeColors.icon} />
        </HStack>
      </Pressable>

      {error && (
        <Text color="red.500" fontSize="xs" mt="1">
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Box safeArea flex={1} bg={themeColors.background} p="4">
          <HStack alignItems="center" mb="4">
            <Pressable onPress={() => setIsOpen(false)} p="2">
              <Icon as={<MaterialIcons name="close" />} size={6} color={themeColors.text} />
            </Pressable>
            <Heading size="md" ml="2" color={themeColors.text}>{label}</Heading>
          </HStack>

          <HStack
            bg={colorScheme === 'dark' ? '#1f2937' : '#f3f4f6'}
            borderRadius="md"
            px="2"
            height="12"
            alignItems="center"
            mb="4"
          >
            <Icon as={<MaterialIcons name="search" />} size={5} color={themeColors.icon} />
            <TextInput
              placeholder="Pesquisar..."
              placeholderTextColor={themeColors.icon}
              value={search}
              onChangeText={setSearch}
              style={[styles.searchInput, { color: themeColors.text }]}
            />
          </HStack>

          {loading ? (
            <Text textAlign="center" mt="4" color={themeColors.text}>Carregando...</Text>
          ) : (
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => `${item.value}-${item.label}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => {
                    onSelect(item.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  <Box py="4">
                    <Text color={themeColors.text} fontSize="md">
                      {item.label}
                    </Text>
                  </Box>
                  <Divider />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text textAlign="center" mt="4" color={themeColors.icon}>Nenhum resultado encontrado</Text>
              }
            />
          )}
        </Box>
      </Modal>
    </VStack>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 16,
  },
});
