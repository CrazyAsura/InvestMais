import React from 'react';
import { Stack } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { Redirect } from 'expo-router';

export default function AdminLayout() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Validação de segurança: apenas administradores podem acessar esta rota
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Painel Administrativo'
        }} 
      />
      <Stack.Screen 
        name="users" 
        options={{ 
          title: 'Gerenciamento de Usuários'
        }} 
      />
      <Stack.Screen 
        name="user-details/[id]" 
        options={{ 
          title: 'Detalhes do Usuário'
        }} 
      />
      <Stack.Screen 
        name="activity-log" 
        options={{ 
          title: 'Histórico de Atividades'
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          title: 'Gerenciamento de Notificações'
        }} 
      />
    </Stack>
  );
}
