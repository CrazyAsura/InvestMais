import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { FormControl, HStack, Icon, Text, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: string;
  mask?: (value: string) => string;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
}

export const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  mask,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  rightElement,
}: FormInputProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isFocused, setIsFocused] = React.useState(false);

  const handleChange = (text: string) => {
    if (mask) {
      onChangeText(mask(text));
    } else {
      onChangeText(text);
    }
  };

  const inputBg = colorScheme === 'dark' ? '#1f2937' : '#f3f4f6';
  const inputBgFocus = colorScheme === 'dark' ? '#374151' : '#e5e7eb';

  return (
    <FormControl isInvalid={!!error}>
      <VStack space={1}>
        <Text fontSize="sm" fontWeight="bold" color={themeColors.text}>
          {label}
        </Text>
        <HStack
          alignItems="center"
          bg={isFocused ? inputBgFocus : inputBg}
          borderWidth={1}
          borderColor={error ? 'red.500' : isFocused ? themeColors.tint : 'transparent'}
          borderRadius="md"
          px="2"
          height="12"
        >
          {icon && (
            // @ts-ignore
            <Icon as={<MaterialIcons name={icon} />} size={5} color={themeColors.icon} />
          )}
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder={placeholder}
            placeholderTextColor={themeColors.icon}
            value={value}
            onChangeText={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
          />
          {rightElement}
        </HStack>
        {error && (
          <FormControl.ErrorMessage>
            {error}
          </FormControl.ErrorMessage>
        )}
      </VStack>
    </FormControl>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 16,
  },
});
