import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from 'react-native-animatable';

export default function Welcome() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      const response = await fetch('<localhost:8082>/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.access_token);
        router.push('/screens/dashboard');
      } else {
        Alert.alert('Erro', data.message || 'Login inválido');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/fundo.png')} 
      style={styles.container}
      resizeMode="cover"
    >      
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require('../assets/images/fundo2.png')}
          style={{ width: '100%' }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.containerLogin}>    
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Text style={styles.message}>Faça login</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.containerForm}>
          <Text style={styles.title}>E-mail</Text>
          <TextInput 
            placeholder="Digite um email..." 
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.title}>Senha</Text>
          <TextInput 
            placeholder="Digite sua senha" 
            style={styles.input} 
            secureTextEntry 
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Acessar</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerLogin: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  containerHeader: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  containerForm: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    marginTop: 28,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#C0C0C0',
    width: '100%',
    paddingVertical: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonCadastro: {
    marginTop: 14,
    alignSelf: 'center'
  },
  buttonCad: {
    color: '#a1a1a1',
  }
});
