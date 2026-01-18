import React from 'react';
import { 
  HStack, 
  IconButton, 
  Icon, 
  Heading, 
  useColorModeValue,
  Box,
  VStack,
  Text
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

interface AdminHeaderProps {
  title: string;
  onMenuPress?: () => void;
  showBackButton?: boolean;
}

export const AdminHeader = ({ title, onMenuPress, showBackButton }: AdminHeaderProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const bgColor = useColorModeValue('white', 'coolGray.900');

  return (
    <Box safeAreaTop bg={bgColor}>
      <HStack 
        px={4} 
        py={3} 
        alignItems="center" 
        justifyContent="space-between" 
        borderBottomWidth={1}
        borderBottomColor={useColorModeValue('coolGray.100', 'coolGray.800')}
        shadow={1}
      >
        <HStack alignItems="center" space={3}>
          {showBackButton ? (
            <IconButton 
              p={2}
              borderRadius="full"
              _pressed={{ bg: useColorModeValue('coolGray.100', 'coolGray.800') }}
              icon={
                <Icon 
                  as={<MaterialIcons name="arrow-back" />} 
                  size={7} 
                  color={themeColors.text}
                />
              }
              onPress={() => router.back()}
            />
          ) : (
            <IconButton 
              p={2}
              borderRadius="full"
              _pressed={{ bg: useColorModeValue('coolGray.100', 'coolGray.800') }}
              icon={
                <Icon 
                  as={<MaterialIcons name="menu" />} 
                  size={7} 
                  color={themeColors.tint}
                />
              }
              onPress={onMenuPress}
            />
          )}
          <Heading size="md" color={themeColors.text} fontWeight="bold">
            {title}
          </Heading>
        </HStack>
        
        <Box w={10} /> 
      </HStack>
    </Box>
  );
};
