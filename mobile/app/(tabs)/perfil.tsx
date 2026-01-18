import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';

export default function PerfilScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(
      setCredentials({
        user: { name: 'Usuário Teste', email: 'teste@investmais.com' },
        token: 'token-fake-123',
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Perfil</ThemedText>
      
      {isAuthenticated ? (
        <ThemedView style={styles.infoContainer}>
          <ThemedText>Bem-vindo, {user?.name}!</ThemedText>
          <ThemedText>{user?.email}</ThemedText>
          <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
            <ThemedText style={styles.buttonText}>Sair</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Simular Login (Redux)</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonLogin: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonLogout: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
