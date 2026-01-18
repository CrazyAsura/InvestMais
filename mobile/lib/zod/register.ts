import { z } from 'zod';

export const registerBaseSchema = z.object({
  // Dados Pessoais
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  documentType: z.enum(['CPF', 'CNPJ']),
  document: z.string().min(11, 'Documento inválido'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().min(10, 'Data inválida'),
  gender: z.string().min(1, 'Gênero é obrigatório'),
  sexuality: z.string().min(1, 'Sexualidade é obrigatória'),
  salary: z.string().optional(),

  // Endereço
  cep: z.string().length(9, 'CEP inválido'),
  street: z.string().min(1, 'Logradouro é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado inválido'),
  country: z.string().min(1, 'País é obrigatório'),

  // Contato
  ddi: z.string().min(1, 'DDI é obrigatório'),
  ddd: z.string().min(2, 'DDD é obrigatório'),
  phone: z.string().min(8, 'Telefone inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'A confirmação de senha deve ter pelo menos 8 caracteres'),
});

export const registerSchema = registerBaseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
