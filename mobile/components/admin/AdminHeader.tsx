import React from 'react';
import { 
  HStack, 
  IconButton, 
  Icon, 
  Heading, 
  useColorModeValue,
  Box,
  Text,
  Pressable
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

interface AdminHeaderProps {
  title: string;
  onMenuPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const AdminHeader = ({ title, onMenuPress, showBackButton, onBackPress }: AdminHeaderProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const bgColor = useColorModeValue('white', '#111827'); // Darker background for dark mode
  const borderColor = useColorModeValue('coolGray.100', 'coolGray.800');
  const pressedBg = useColorModeValue('coolGray.100', 'coolGray.800');

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <Box safeAreaTop bg={bgColor}>
      <HStack 
        px={4} 
        py={4} 
        alignItems="center" 
        justifyContent="space-between" 
        borderBottomWidth={1}
        borderBottomColor={borderColor}
      >
        <HStack alignItems="center" space={4}>
          {(showBackButton || onBackPress) ? (
            <Pressable 
              onPress={handleBack}
              hitSlop={10}
              p={1}
            >
              <Icon 
                as={<MaterialIcons name="arrow-back-ios" />} 
                size={5} 
                color={themeColors.text}
              />
            </Pressable>
          ) : (
            <Pressable 
              onPress={onMenuPress}
              hitSlop={10}
              p={1}
            >
              <Icon 
                as={<MaterialIcons name="sort" />} 
                size={7} 
                color={themeColors.tint}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </Pressable>
          )}
          <Heading 
            size="md" 
            color={themeColors.text} 
            fontWeight="800"
          >
            {title}
          </Heading>
        </HStack>
        
        <HStack space={2}>
          <Pressable 
            p={2}
            borderRadius="full"
            _pressed={{ bg: pressedBg }}
          >
            <Icon 
              as={<MaterialIcons name="notifications-none" />} 
              size={6} 
              color={themeColors.text}
            />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );
};
