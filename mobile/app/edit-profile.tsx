import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, Center, Box, VStack, Heading, Text, Button, HStack, Icon, useToast, Pressable } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FormSection } from '@/components/ui/form-section';
import { FormInput } from '@/components/ui/form-input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { registerBaseSchema, RegisterFormData } from '@/lib/zod/register';
import { maskCPF, maskCNPJ, maskCEP, maskDate, maskCurrency, maskPhone } from '@/services/masks';
import { getAddressByCEP } from '@/services/viacep';
import { getStates, getCitiesByState } from '@/services/ibge';
import { getCountries } from '@/services/country';
import { getDDDsByCountry } from '@/services/ddd';
import api from '@/services/api';
import { updateUser } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { z } from 'zod';

// Schema simplificado para edição (sem documentType e document que não são editáveis)
const editProfileSchema = registerBaseSchema.omit({ 
  documentType: true, 
  document: true,
  password: true,
  confirmPassword: true
}).extend({
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres').optional().or(z.literal('')),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      birthDate: user?.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : '',
      gender: user?.gender || '',
      sexuality: user?.sexuality || '',
      salary: user?.salary || '',
      cep: user?.address?.zipCode || '',
      street: user?.address?.street || '',
      neighborhood: user?.address?.neighborhood || '',
      number: user?.address?.number || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      country: user?.address?.country || 'Brazil',
      ddi: user?.phone?.ddi || '+55',
      ddd: user?.phone?.ddd || '',
      phone: user?.phone?.number || '',
    },
  });

  const cep = watch('cep');
  const selectedState = watch('state');
  const selectedCountry = watch('country');
  const selectedDDI = watch('ddi');

  // Queries
  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: getStates,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', selectedState],
    queryFn: () => getCitiesByState(selectedState),
    enabled: !!selectedState,
  });

  const { data: countries = [] } = useQuery({
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
          setValue('street', address.logradouro);
          setValue('neighborhood', address.bairro);
        }
      }
    };
    fetchAddress();
  }, [cep, setValue]);

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      setIsSubmitting(true);
      
      // Converter data de nascimento DD/MM/AAAA para YYYY-MM-DD
      let isoBirthDate = data.birthDate;
      if (data.birthDate.includes('/')) {
        const [day, month, year] = data.birthDate.split('/');
        isoBirthDate = `${year}-${month}-${day}`;
      }

      const payload: any = {
        name: data.name,
        email: data.email,
        birthDate: isoBirthDate,
        gender: data.gender,
        sexuality: data.sexuality,
        salary: data.salary ? parseFloat(data.salary.replace(/[^\d,]/g, '').replace(',', '.')) : undefined,
        address: {
          zipCode: data.cep,
          street: data.street,
          neighborhood: data.neighborhood,
          number: data.number,
          city: data.city,
          state: data.state,
          country: data.country,
        },
        phone: {
          ddi: data.ddi.replace('+', ''),
          ddd: data.ddd,
          number: data.phone.replace(/\D/g, ''),
        }
      };

      if (data.password) {
        payload.password = data.password;
      }

      const response = await api.patch('/auth/profile', payload);
      
      dispatch(updateUser(response.data.user));
      
      toast.show({
        description: "Perfil atualizado com sucesso!",
        placement: "top",
        bg: "success.500"
      });
      
      router.back();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar perfil';
      toast.show({
        description: Array.isArray(message) ? message[0] : message,
        placement: "top",
        bg: "error.500"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} bg={themeColors.background}>
      <Center w="100%" flex={1} px="6" py="10">
        <Box w="100%" maxW="400">
          <VStack space={2} alignItems="center" mb="8">
            <HStack w="100%" alignItems="center">
              <Pressable onPress={() => router.back()} p="2">
                <Icon as={<MaterialIcons name="arrow-back" />} size={6} color={themeColors.text} />
              </Pressable>
              <Heading size="xl" fontWeight="900" color={themeColors.tint} flex={1} textAlign="center" mr="10">
                Editar Perfil
              </Heading>
            </HStack>
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

              <FormInput
                label="CPF/CNPJ (Não editável)"
                value={user?.document || ''}
                icon="badge"
                editable={false}
                bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}
                onChangeText={() => {}}
              />

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
                    name="sexuality"
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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Nova Senha (opcional)"
                    placeholder="Deixe em branco para manter"
                    value={value || ''}
                    onChangeText={onChange}
                    icon="lock"
                    secureTextEntry
                    error={errors.password?.message}
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
                name="street"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Logradouro"
                    placeholder="Rua, Avenida, etc."
                    value={value}
                    onChangeText={onChange}
                    icon="location-on"
                    error={errors.street?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="neighborhood"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Bairro"
                    placeholder="Seu bairro"
                    value={value}
                    onChangeText={onChange}
                    icon="layers"
                    error={errors.neighborhood?.message}
                  />
                )}
              />

              <HStack space={2}>
                <Box flex={2}>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label="Cidade"
                        value={value}
                        onChangeText={onChange}
                        icon="location-city"
                        error={errors.city?.message}
                      />
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Controller
                    control={control}
                    name="state"
                    render={({ field: { onChange, value } }) => (
                      <SearchableSelect
                        label="UF"
                        value={value}
                        onSelect={onChange}
                        options={states.map(s => ({ label: s.sigla, value: s.sigla }))}
                        error={errors.state?.message}
                      />
                    )}
                  />
                </Box>
              </HStack>

              <Controller
                control={control}
                name="number"
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Número"
                    placeholder="123"
                    value={value}
                    onChangeText={onChange}
                    icon="home"
                    keyboardType="numeric"
                    error={errors.number?.message}
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
                        options={countries.map(c => ({ 
                          label: `${c.flag} ${c.idd.root}${c.idd.suffixes?.[0] || ''}`, 
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
              isLoading={isSubmitting}
              borderRadius="xl"
              _text={{ fontWeight: 'bold', fontSize: 'md' }}
            >
              Salvar Alterações
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
