import { z } from 'zod';

export const registerSchema = z.object({
  // Dados Pessoais
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  documentType: z.enum(['CPF', 'CNPJ']),
  document: z.string().min(11, 'Documento inválido'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().min(10, 'Data inválida'),
  gender: z.string().min(1, 'Gênero é obrigatório'),
  sex: z.string().min(1, 'Sexo é obrigatório'),
  salary: z.string().min(1, 'Salário é obrigatório'),

  // Endereço
  cep: z.string().length(9, 'CEP inválido'),
  number: z.string().min(1, 'Número é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado inválido'),
  country: z.string().min(1, 'País é obrigatório'),

  // Contato
  ddi: z.string().min(1, 'DDI é obrigatório'),
  ddd: z.string().min(2, 'DDD é obrigatório'),
  phone: z.string().min(8, 'Telefone inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
