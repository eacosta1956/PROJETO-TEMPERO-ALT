import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';


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

      {/* ====================================================== */}

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('CadastrarProdutosRelatorio')}>
        <Text style={styles.buttonText}>Cadastrar Produtos Retroativo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('AtualizarEstoqueRelatorio')}>
        <Text style={styles.buttonText}>Atualizar Estoque Retroativo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('ListarMovimentacoesModal')}>
        <Text style={styles.buttonText}>Ver Tabelas</Text>
      </TouchableOpacity>

    </View>
  );
}

// Estilização
// ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    width: 360,
  },
  buttonRelatorio: {
    marginBottom: 80,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    width: 360,
  },
  button2: {
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width: 360,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
