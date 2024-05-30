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
        <Text style={styles.buttonText}>Cadastrar Produtos - Data Retroativa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('AtualizarEstoqueRelatorio')}>
        <Text style={styles.buttonText}>Atualizar Estoque - Data Retroativa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('ListarMovimentacoesModal')}>
        <Text style={styles.buttonText}>Ver Registros das Tabelas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('ConsultarEstruturaTabelas')}>
        <Text style={styles.buttonText}>Ver Estrutura das Tabelas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('ApagarDados')}>
        <Text style={styles.buttonText}>Apagar Dados</Text>
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
    marginBottom: 1,
    marginTop: 1,
    padding: 1,
    backgroundColor: 'green',
    borderRadius: 5,
    width: 360,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
