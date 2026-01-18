import React from 'react';
import { TextInput, StyleSheet, DimensionValue } from 'react-native';
import { FormControl, HStack, Icon, Text, VStack, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FormInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  icon?: string;
  mask?: (value: string) => string;
  error?: string | null;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
  editable?: boolean;
  bg?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  height?: number | string;
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
  editable = true,
  bg,
  autoCapitalize,
  autoCorrect,
  multiline = false,
  numberOfLines,
  height,
}: FormInputProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

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
          alignItems={multiline ? "flex-start" : "center"}
          bg={bg || (isFocused ? inputBgFocus : inputBg)}
          borderWidth={1}
          borderColor={error ? 'red.500' : isFocused ? themeColors.tint : 'transparent'}
          borderRadius="md"
          px="2"
          height={(height as any) || (multiline ? "auto" : "12")}
          opacity={editable ? 1 : 0.7}
          pt={multiline ? 2 : 0}
        >
          {icon && (
            // @ts-ignore
            <Icon as={<MaterialIcons name={icon} />} size={5} color={themeColors.icon} mt={multiline ? 1 : 0} />
          )}
          <TextInput
            style={[
              styles.input, 
              { 
                color: themeColors.text,
                height: (multiline ? (height ?? 100) : '100%') as DimensionValue,
                textAlignVertical: (multiline ? 'top' : 'center') as 'top' | 'center' | 'bottom' | 'auto' | undefined
              }
            ]}
            placeholder={placeholder}
            placeholderTextColor={themeColors.icon}
            value={value || ''}
            onChangeText={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry && !showPassword}
            editable={editable}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
          {secureTextEntry && (
            <Pressable onPress={() => setShowPassword(!showPassword)} p="2">
              <Icon 
                as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} 
                size={5} 
                color={themeColors.icon} 
              />
            </Pressable>
          )}
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
