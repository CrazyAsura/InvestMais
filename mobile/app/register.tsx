import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, Center, Box, VStack, Heading, Text, Button, HStack, Link, Icon } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FormSection } from '@/components/ui/form-section';
import { FormInput } from '@/components/ui/form-input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { registerSchema, RegisterFormData } from '@/lib/zod/register';
import { maskCPF, maskCNPJ, maskCEP, maskDate, maskCurrency, maskPhone } from '@/services/masks';
import { getAddressByCEP } from '@/services/viacep';
import { getStates, getCitiesByState } from '@/services/ibge';
import { getCountries } from '@/services/country';
import { getDDDsByCountry } from '@/services/ddd';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      documentType: 'CPF',
    },
  });

  const documentType = watch('documentType');
  const cep = watch('cep');
  const selectedState = watch('state');
  const selectedCountry = watch('country');
  const selectedDDI = watch('ddi');

  // Queries
  const { data: states = [], isLoading: isLoadingStates } = useQuery({
    queryKey: ['states'],
    queryFn: getStates,
  });

  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities', selectedState],
    queryFn: () => getCitiesByState(selectedState),
    enabled: !!selectedState,
  });

  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });

  const dddOptions = React.useMemo(() => 
    getDDDsByCountry(selectedCountry, selectedDDI),
    [selectedCountry, selectedDDI]
  );

  // ViaCEP integration
  useEffect(() => {
    const fetchAddress = async () => {
      if (cep?.length === 9) {
        const address = await getAddressByCEP(cep);
        if (address) {
          setValue('state', address.uf);
          setValue('city', address.localidade);
          setValue('country', 'Brazil'); // Default to Brazil when using ViaCEP
        }
      }
    };
    fetchAddress();
  }, [cep, setValue]);

  // Update DDI automatically when country changes (only when country changes, not from DDI sync)
  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const countryData = countries.find(c => c.name === selectedCountry);
      if (countryData) {
        const ddi = `${countryData.idd.root}${countryData.idd.suffixes?.[0] || ''}`;
        
        // We only want to update the DDI if it's not already set to a valid DDI for this country
        const isCompatible = countryData.idd.suffixes?.some(s => `${countryData.idd.root}${s}` === selectedDDI);
        
        if (!isCompatible) {
          setValue('ddi', ddi, { shouldValidate: true });
        }
      }
    }
  }, [selectedCountry, countries.length]); // Only trigger when country changes or list loads

  // Update Country automatically when DDI changes
  useEffect(() => {
    if (selectedDDI && countries.length > 0) {
      // Find country that has this specific DDI
      const countryData = countries.find(c => {
        return c.idd.suffixes?.some(s => `${c.idd.root}${s}` === selectedDDI);
      });
      
      // If we found a country for this DDI, and it's different from current, update it
      // But we avoid updating if the current country ALREADY supports this DDI
      if (countryData) {
        const currentCountryData = countries.find(c => c.name === selectedCountry);
        const currentSupportsDDI = currentCountryData?.idd.suffixes?.some(s => `${currentCountryData.idd.root}${s}` === selectedDDI);
        
        if (!currentSupportsDDI && selectedCountry !== countryData.name) {
          setValue('country', countryData.name, { shouldValidate: true });
        }
      }
    }
  }, [selectedDDI, countries.length]); // Only trigger when DDI changes or list loads

  const onSubmit = (data: RegisterFormData) => {
    console.log('Dados do Registro:', data);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} bg={themeColors.background}>
      <Center w="100%" flex={1} px="6" py="10">
        <Box w="100%" maxW="400">
          <VStack space={2} alignItems="center" mb="8">
            <Heading size="xl" fontWeight="900" color={themeColors.tint}>
              Criar Conta
            </Heading>
            <Text fontSize="md" color={themeColors.icon} fontWeight="medium" textAlign="center">
              Complete seus dados para começar
            </Text>
          </VStack>

          <VStack space={6}>
            <FormSection title="Dados Pessoais">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Nome Completo"
                    placeholder="Seu nome"
                    value={value}
                    onChangeText={onChange}
                    icon="person"
                    error={errors.name?.message}
                  />
                )}
              />

              <HStack space={2} alignItems="flex-end">
                <Box flex={1}>
                  <Controller
                    control={control}
                    name="documentType"
                    render={({ field: { onChange, value } }) => (
                      <SearchableSelect
                        label="Tipo"
                        value={value}
                        onSelect={onChange}
                        options={[
                          { label: 'CPF', value: 'CPF' },
                          { label: 'CNPJ', value: 'CNPJ' },
                        ]}
                      />
                    )}
                  />
                </Box>
                <Box flex={2}>
                  <Controller
                    control={control}
                    name="document"
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label={documentType === 'CPF' ? 'CPF' : 'CNPJ'}
                        placeholder="000.000.000-00"
                        value={value}
                        onChangeText={onChange}
                        mask={documentType === 'CPF' ? maskCPF : maskCNPJ}
                        keyboardType="numeric"
                        error={errors.document?.message}
                      />
                    )}
                  />
                </Box>
              </HStack>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={value}
                    onChangeText={onChange}
                    icon="email"
                    keyboardType="email-address"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Data de Nascimento"
                    placeholder="DD/MM/AAAA"
                    value={value}
                    onChangeText={onChange}
                    icon="event"
                    mask={maskDate}
                    keyboardType="numeric"
                    error={errors.birthDate?.message}
                  />
                )}
              />

              <HStack space={2}>
                <Box flex={1}>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                      <SearchableSelect
                        label="Gênero"
                        value={value}
                        onSelect={onChange}
                        options={[
                          { label: 'Masculino', value: 'Masculino' },
                          { label: 'Feminino', value: 'Feminino' },
                          { label: 'Outro', value: 'Outro' },
                          { label: 'Prefiro não dizer', value: 'N/A' },
                        ]}
                      />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Controller
                    control={control}
                    name="sex"
                    render={({ field: { onChange, value } }) => (
                      <SearchableSelect
                        label="Sexo"
                        value={value}
                        onSelect={onChange}
                        options={[
                          { label: 'Masculino', value: 'M' },
                          { label: 'Feminino', value: 'F' },
                        ]}
                      />
                    )}
                  />
                </Box>
              </HStack>

              <Controller
                control={control}
                name="salary"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Salário Mensal"
                    placeholder="R$ 0,00"
                    value={value}
                    onChangeText={onChange}
                    icon="attach-money"
                    mask={maskCurrency}
                    keyboardType="numeric"
                    error={errors.salary?.message}
                  />
                )}
              />
            </FormSection>

            <FormSection title="Endereço">
              <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="CEP"
                    placeholder="00000-000"
                    value={value}
                    onChangeText={onChange}
                    mask={maskCEP}
                    keyboardType="numeric"
                    error={errors.cep?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="number"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Número"
                    placeholder="123"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    error={errors.number?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                  <SearchableSelect
                    label="Estado"
                    value={value}
                    onSelect={onChange}
                    loading={isLoadingStates}
                    options={states.map(s => ({ label: s.nome, value: s.sigla }))}
                  />
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, value } }) => (
                  <SearchableSelect
                    label="Cidade"
                    value={value}
                    onSelect={onChange}
                    loading={isLoadingCities}
                    options={cities.map(c => ({ label: c.nome, value: c.nome }))}
                  />
                )}
              />

              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, value } }) => (
                  <SearchableSelect
                    label="País"
                    value={value}
                    onSelect={onChange}
                    loading={isLoadingCountries}
                    options={countries.map(c => ({ label: c.name, value: c.name }))}
                  />
                )}
              />
            </FormSection>

            <FormSection title="Contato">
              <HStack space={2}>
                <Box flex={1}>
                  <Controller
                    control={control}
                    name="ddi"
                    render={({ field: { onChange, value } }) => (
                      <SearchableSelect
                        label="DDI"
                        value={value}
                        onSelect={onChange}
                        loading={isLoadingCountries}
                        options={countries.map(c => ({ 
                          label: `${c.name} (${c.idd.root}${c.idd.suffixes?.[0] || ''})`, 
                          value: `${c.idd.root}${c.idd.suffixes?.[0] || ''}` 
                        }))}
                      />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Controller
                    control={control}
                    name="ddd"
                    render={({ field: { onChange, value } }) => (
                      <SearchableSelect
                        label="DDD"
                        value={value}
                        onSelect={onChange}
                        options={dddOptions}
                        placeholder="11"
                        error={errors.ddd?.message}
                      />
                    )}
                  />
                </Box>
              </HStack>

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Número de Telefone"
                    placeholder="99999-9999"
                    value={value}
                    onChangeText={(text) => onChange(maskPhone(text))}
                    icon="phone"
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                  />
                )}
              />
            </FormSection>

            <Button
              mt="6"
              size="lg"
              bg={themeColors.tint}
              _pressed={{ bg: 'amber.600' }}
              onPress={handleSubmit(onSubmit)}
              borderRadius="xl"
              _text={{ fontWeight: 'bold', fontSize: 'md' }}
            >
              Finalizar Cadastro
            </Button>

            <HStack mt="6" justifyContent="center" mb="10">
              <Text fontSize="sm" color={themeColors.text}>
                Já possui uma conta?{' '}
              </Text>
              <Link
                _text={{
                  color: themeColors.tint,
                  fontWeight: 'bold',
                  fontSize: 'sm',
                }}
                onPress={() => router.push('/login')}
              >
                Faça Login
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
