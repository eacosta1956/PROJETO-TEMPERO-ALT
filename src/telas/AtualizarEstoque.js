import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../database/AbreConexao';


// Função principal - Atualizar o estoque dos produtos
// ---------------------------------------------------
export default function AtualizarEstoque({ route, navigation }) {
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [estoqueAtual, setEstoqueAtual] = useState('');


  // É um Hook. Acionado quando a tela AtualizarEstoque é carregada
  // --------------------------------------------------------------
  useEffect(() => {
    // Obtém o produto passado pela navegação
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
      setQuantidade('');
    }
  }, [route.params]);

  // Acionada quando pressionados os botões Adicionar ou Retirar
  // -----------------------------------------------------------
  const salvarMovimentacaoEstoque = (operacao) => {

    // Obtém a data e hora atual no formato desejado (Brasil/São Paulo)
    // ----------------------------------------------------------------
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Converte a quantidade a ser adicionada ao estoque para número inteiro
    // ---------------------------------------------------------------------
    const qtdInt = parseInt(quantidade);

    // Verifica se a quantidade a ser retirada é maior que o estoque. Se for, aborta a operação
    // ----------------------------------------------------------------------------------------
    if (operacao === 'retirar' && qtdInt > produto.estoque_atual) {
      Alert.alert('Atenção', 'Quantidade a retirar maior que o estoque atual!');
      setQuantidade(null)
      return;
    }

    // Verifica se a operação é de adição ou de retirada
    // -------------------------------------------------
    const qtdMovimentada = operacao === 'adicionar' ? qtdInt : -qtdInt;
    
    // Atualiza o novo estoque na tabela estoque
    // -----------------------------------------
    db.transaction((transaction) => {
      transaction.executeSql(
        `UPDATE estoque
        SET estoque_atual = estoque_atual + ?, data_atualizacao_estoque = ? 
        WHERE id_produto = ?;`,
        [qtdMovimentada, dataAtual, produto.id_produto],
        
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {

              // Chama a função para atualizar o estado do produto selecionado
              // -------------------------------------------------------------
              atualizarProdutoSelecionado(produto.id_produto);

            // Insere a movimentação na tabela entrada_saida
            // ---------------------------------------------
            transaction.executeSql(
              `INSERT INTO entrada_saida (id_produto, quantidade, data_atualizacao, estoque_atual) VALUES (?, ?, ?, ?);`,
              [produto.id_produto, qtdMovimentada, dataAtual,qtdMovimentada + produto.estoque_atual],
              () => {
                //console.log(qtdMovimentada + produto.estoque_atual);
                Alert.alert('Sucesso', 'Movimentação de estoque realizada com sucesso!');
                setQuantidade('');
                navigation.navigate('ListarProdutos');
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
  // Fim da função responsável pela atualização do estoque


  // Atualiza o estado do produto selecionado. É chamada de dentro da função anterior.
  // ---------------------------------------------------------------------------------
  const atualizarProdutoSelecionado = (id_produto) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT * FROM produtos WHERE id_produto = ?`,
        [id_produto],
        (_, { rows }) => {
          const produtoAtualizado = rows._array[0];
          setProduto(produtoAtualizado); // Atualiza o estado do produto
        },
        (_, error) => {
          Alert.alert('Erro', 'Erro ao buscar produto atualizado: ' + error);
        }
      );
    });
  };


  // Retorno da função principal
  // ---------------------------
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

// Estilização
// -----------
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
