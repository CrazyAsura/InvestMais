import React from 'react';
import { Box, Heading, VStack, Divider } from 'native-base';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection = ({ title, children }: FormSectionProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <Box w="100%" mb="6">
      <Heading size="md" color={themeColors.tint} mb="4">
        {title}
      </Heading>
      <VStack space={4}>
        {children}
      </VStack>
      <Divider mt="6" bg={colorScheme === 'dark' ? 'coolGray.700' : 'coolGray.200'} />
    </Box>
  );
};
