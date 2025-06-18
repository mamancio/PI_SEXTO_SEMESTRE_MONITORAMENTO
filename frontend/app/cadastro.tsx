import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView
} from "react-native";
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/axios';
import { Ionicons } from '@expo/vector-icons';

export default function Cadastro() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    // Só atualiza os campos se o id do usuário mudar
    const pessoa = params && params.pessoa ? JSON.parse(params.pessoa as string) : null;
    if (pessoa && pessoa.id !== id) {
      setNome(pessoa.nome || pessoa.name || '');
      setCpf(pessoa.cpf || '');
      setEmail(pessoa.email || '');
      setSenha(pessoa.password || '');
      setConfirmarSenha(pessoa.password || '');
      setDataNascimento(pessoa.dataNascimento || pessoa.birthDate || '');
      setImagem(pessoa.foto || pessoa.photoUrl || null);
      setId(pessoa.id || null);
      setModoEdicao(true);
    } else if (!pessoa && id !== null) {
      // Se não há pessoa, limpa o formulário
      setNome('');
      setCpf('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setDataNascimento('');
      setImagem(null);
      setId(null);
      setModoEdicao(false);
    }
  }, [params?.pessoa]);

  const aplicarMascaraCPF = (cpf: string): string => {
    cpf = cpf.replace(/\D/g, '').slice(0, 11);
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };
  const aplicarMascaraData = (data: string): string => {
  data = data.replace(/\D/g, '').slice(0, 8); // Só números, até 8 dígitos
  if (data.length >= 5) {
    return data.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
  } else if (data.length >= 3) {
    return data.replace(/(\d{2})(\d{1,2})/, '$1/$2');
  } else {
    return data;
  }
};
const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
const validarCPF = (cpf: string): boolean => {
    return cpf.replace(/\D/g, '').length === 11;
};
const validarData = (data: string): boolean => {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(data);
};

  const handleRegister = async () => {
    setError("");
    if (!nome || !cpf || !email || !senha || !confirmarSenha || !dataNascimento) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!validarEmail(email)) {
      setError("E-mail inválido.");
      return;
    }
    if (!validarCPF(cpf)) {
      setError("CPF inválido.");
      return;
    }
    if (!validarData(dataNascimento)) {
      setError("Data de nascimento inválida.");
      return;
    }
    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      // Usa o axios para garantir BASE_URL correta
      await api.post('/users/register', {
        name: nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        password: senha,
        birthDate: dataNascimento.split('/').reverse().join('-'),
        role: 'CLIENT',
        photoUrl: imagem,
      });
      Alert.alert('Sucesso', 'Cadastro realizado!');
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const escolherImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const handleSalvar = () => {
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const novoCadastro = {
      id: id || Date.now().toString(),
      nome,
      cpf,
      email,
      password: senha,
      dataNascimento,
      foto: imagem,
      perfil: 'CLIENT',
    };

    if (params.salvarCadastro) {
      const callback = eval(params.salvarCadastro as string);
      callback(novoCadastro);
    }
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>
      <Header title="Cadastro" />
      <View style={styles.textInput}>
        <TextInput placeholder="Nome completo" style={styles.input} value={nome} onChangeText={setNome} />
        <TextInput
          placeholder="CPF"
          style={styles.input}
          value={cpf}
          onChangeText={(text) => setCpf(aplicarMascaraCPF(text))}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Data de nascimento (dd/mm/aaaa)"
          style={styles.input}
          value={dataNascimento}
          onChangeText={(text) => setDataNascimento(aplicarMascaraData(text))}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput placeholder="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
        <TextInput placeholder="Confirmar senha" style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

        <TouchableOpacity style={styles.uploadBtn} onPress={escolherImagem}>
          <Text style={styles.uploadText}>Selecionar imagem</Text>
        </TouchableOpacity>
        {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCadastro} onPress={() => router.push('/login')}>
          <Text style={styles.buttonCad}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  uploadBtn: {
    backgroundColor: '#ddd',
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 12
  },
  uploadText: { color: '#333' },
  imagem: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 12 },
  button: {
    backgroundColor: '#38a69d',
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
    width: '100%'
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonCadastro: { marginTop: 20, alignItems: 'center' },
  buttonCad: { color: '#38a69d', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 8, textAlign: 'center' },
});
