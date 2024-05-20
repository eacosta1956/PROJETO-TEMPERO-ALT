import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from '../styles/homeStyles';

// Função principal - responsável por exibir a tela de entrada do aplicativo
// -------------------------------------------------------------------------
export default function Home({ navigation }) {
  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListarProdutos')}>
        <Text style={styles.buttonText}>Listar Produtos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastrarProduto')}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonRelatorio} onPress={() => navigation.navigate('GerarRelatorios')}>
        <Text style={styles.buttonText}>Gerar Relatórios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ApagarDados')}>
        <Text style={styles.buttonText}>Apagar Dados</Text>
      </TouchableOpacity>

      {/* ====================================================== */}


    </View>
  );
}

