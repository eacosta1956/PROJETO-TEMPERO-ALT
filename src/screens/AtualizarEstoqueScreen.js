import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../database/SQLite'; // Importe o banco de dados SQLite
import { useFocusEffect } from '@react-navigation/native'; // Importe o hook useFocusEffect

export default function AtualizarEstoqueScreen({ route, navigation }) {
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    // Obter o produto passado pela navegação
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
      setQuantidade('');
    }
  }, [route.params]);

  // Recarregar a tela ListarProdutosScreen quando a tela AtualizarEstoqueScreen for focada novamente
  {/*useFocusEffect(
    React.useCallback(() => {
      setProduto(null); // Limpar o produto ao voltar para a tela
    }, [])
  );*/}

  const salvarMovimentacaoEstoque = (operacao) => {
    if (!produto || !quantidade) {
      Alert.alert('Atenção', 'Preencha o produto e a quantidade!');
      return;
    }

    // Obter a data e hora atual no formato desejado (Brasil/São Paulo)
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Converter a quantidade para número inteiro
    const qtdInt = parseInt(quantidade);

    // Verificar se a operação é de adição ou retirada
    const qtdMovimentada = operacao === 'adicionar' ? qtdInt : -qtdInt;

    // Atualizar o estoque_atual na tabela estoque_atual
    db.transaction((transaction) => {
      transaction.executeSql(
        `UPDATE estoque_atual SET estoque_atual = estoque_atual + ? WHERE id_produto = ?;`,
        [qtdMovimentada, produto.id_produto],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            // Inserir a movimentação na tabela entrada_saida
            transaction.executeSql(
              `INSERT INTO entrada_saida (id_produto, quantidade, data) VALUES (?, ?, ?);`,
              [produto.id_produto, qtdMovimentada, dataAtual],
              () => {
                Alert.alert('Sucesso', 'Movimentação de estoque realizada com sucesso!');
                setQuantidade('');
                navigation.navigate('ListarProdutos'); // Navegar de volta para a tela ListarProdutosScreen
              },
              (_, error) => {
                Alert.alert('Erro', 'Erro ao salvar movimentação de estoque: ' + error);
              }
            );
          } else {
            Alert.alert('Erro', 'Produto não encontrado ou erro ao atualizar estoque.');
          }
        },
        (_, error) => {
          Alert.alert('Erro', 'Erro ao atualizar estoque: ' + error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <View>
        {produto && (
          <>
            <Text>Nome do Produto: {produto.nome_produto}</Text>
            <Text>ID do Produto: {produto.id_produto}</Text>
            <Text>Estoque Atual: {produto.estoque_atual}</Text>
            <Text>Estoque Segurança: {produto.estoque_seguranca}</Text>
            <Text>Estoque Mínimo: {produto.estoque_minimo}</Text>
          </>
        )}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={(text) => setQuantidade(text)}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#27ae60' }]}
        onPress={() => salvarMovimentacaoEstoque('adicionar')}
      >
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e74c3c' }]}
        onPress={() => salvarMovimentacaoEstoque('retirar')}
      >
        <Text style={styles.buttonText}>Retirar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '80%',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
