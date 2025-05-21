import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Header from '../../components/Header';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CadastroHome() {
  const navigation = useNavigation();
  const router = useRouter();

  const [cadastros, setCadastros] = useState([
    { id: '1', foto: null, nome: 'Maria Silva', username: 'maria123', email: 'maria@email.com' },
    { id: '2', foto: null, nome: 'João Souza', username: 'joaosz', email: 'joao@email.com' },
  ]);

  const irParaCadastro = () => {
    router.replace('/cadastro');
  };

  const editarCadastro = (id: string) => {
    router.push(`/cadastro`);
  };

  const excluirCadastro = (id: string) => {
    setCadastros(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.dataRow}>
      <View style={[styles.dataCell, styles.fotoCell]}>
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={40} color="#888" />
        )}
      </View>

      <View style={[styles.dataCell, styles.idCell]}>
        <Text style={styles.dataText}>{item.id}</Text>
      </View>

      <View style={[styles.dataCell, styles.nomeCell]}>
        <Text style={styles.dataText}>{item.nome}</Text>
      </View>

      <View style={[styles.dataCell, styles.usernameCell]}>
        <Text style={styles.dataText}>{item.username}</Text>
      </View>

      <View style={[styles.dataCell, styles.emailCell]}>
        <Text style={styles.dataText}>{item.email}</Text>
      </View>

      <View style={[styles.dataCell, styles.acoesCell]}>
        <TouchableOpacity onPress={() => editarCadastro(item.id)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirCadastro(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Header title="Usuários" />

      <View style={styles.content}>
        <ScrollView horizontal style={{ flex: 1 }}>
          <View style={styles.tableWrapper}>
            
            <View style={styles.headerRow}>
              <View style={[styles.headerCell, styles.fotoCell]}>
                <Text style={styles.headerText}>Foto</Text>
              </View>
              <View style={[styles.headerCell, styles.idCell]}>
                <Text style={styles.headerText}>ID</Text>
              </View>
              <View style={[styles.headerCell, styles.nomeCell]}>
                <Text style={styles.headerText}>Nome</Text>
              </View>
              <View style={[styles.headerCell, styles.usernameCell]}>
                <Text style={styles.headerText}>Username</Text>
              </View>
              <View style={[styles.headerCell, styles.emailCell]}>
                <Text style={styles.headerText}>Email</Text>
              </View>
              <View style={[styles.headerCell, styles.acoesCell]}>
                <Text style={styles.headerText}>Ações</Text>
              </View>
            </View>

            <FlatList
              data={cadastros}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.flatList}
              contentContainerStyle={{ paddingBottom: 60 }}
            />
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={irParaCadastro}>
        <Ionicons name="add-circle" size={60} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
tableWrapper: {
  minWidth: width,
  flexGrow: 1,
  justifyContent: 'flex-start',
},
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  dataCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  actionButton: {
    paddingHorizontal: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  flatList: {
    //flex: 1,
  },

// Colunas responsivas
  fotoCell: { flex: 1 },
  idCell: { flex: 1 },
  nomeCell: { flex: 2 },
  usernameCell: { flex: 2 },
  emailCell: { flex: 1 },
  acoesCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
