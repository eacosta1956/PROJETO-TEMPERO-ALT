import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { db } from '../database/AbreConexao';

export default function EditarProduto({ route, navigation }) {
  const [produto, setProduto] = useState(null);
  const [nomeProduto, setNomeProduto] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [estoqueProduto, setEstoqueProduto] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [quantidadeNovaAtualizacao, setQuantidadeNovaAtualizacao] = useState('');
  const [quantidadeUltimaAtualizacao, setQuantidadeUltimaAtualizacao] = useState('');
  const [dataAtualizacaoEstoque, setDataAtualizacaoEstoque] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [operacaoSucesso, setOperacaoSucesso] = useState(false);

  // ========== mostra na tela os dados do produto selecionado na tela 'listar produtos' ==========
  // ========== mostra na tela a quantidade da última atualização ==========
  useEffect(() => {
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
    }
    carregaInformacoesProduto();
    carregaQuantidadeUltimaOperacao();
  }, [route.params]);

  // ===== busca na tabela produtos, o nome do produto, o tipo do produto e o estoque mínimo =====
  const carregaInformacoesProduto = () => {
    db.transaction((transaction) => {
      transaction.executeSql(
        'SELECT nome_produto, tipo_produto, estoque_minimo FROM produtos WHERE id_produto = ?',
        [route.params.produto.id_produto],
        (_, { rows }) => {
          const produto = rows.item(0);
          setNomeProduto(produto.nome_produto);
          setTipoProduto(produto.tipo_produto);
          setEstoqueMinimo(String(produto.estoque_minimo));
        },
        (_, error) => {
          setModalMessage('Erro ao carregar informações do produto:', error);
          setModalVisible(true);
        }
      );
    });
  };

  // ===== busca na tabela entrada_saida, o estoque atual,  =====
  // ===== a qtde e a data da última atualização no estoque =====
  const carregaQuantidadeUltimaOperacao = () => {
    db.transaction(transaction => {
        transaction.executeSql(
            'SELECT quantidade, data_atualizacao, estoque_atual FROM entrada_saida WHERE id_produto = ? ORDER BY data_atualizacao DESC LIMIT 1',
            [route.params.produto.id_produto],
            (_, { rows }) => {
                if (rows.length > 0) {
                    const operacao = rows.item(0);
                    setQuantidadeUltimaAtualizacao(String(operacao.quantidade));
                    setDataAtualizacaoEstoque(String(operacao.data_atualizacao));
                    setEstoqueProduto(String(operacao.estoque_atual));
                }
            },
            (_, error) => {
              setModalMessage('Erro ao carregar quantidade da última operação:', error);
              setModalVisible(true);
            }
        );
    });
  };
  
  // ========== armazena no banco de dados as informações editadas pelo usuário ==========
  const salvarAlteracoes = () => {
    const nomeProdutoUpperCase = nomeProduto.toUpperCase();
    const tipoProdutoUpperCase = tipoProduto.toUpperCase();

    db.transaction((transaction) => {
      transaction.executeSql(
        `UPDATE produtos 
          SET nome_produto = ?, 
          tipo_produto = ?, 
          estoque_minimo = ? 
        WHERE id_produto = ?;`,
        [nomeProdutoUpperCase, tipoProdutoUpperCase, parseInt(estoqueMinimo), route.params.produto.id_produto],
        (_, result) => {
          if (quantidadeNovaAtualizacao.trim() !== '') {
            const quantidadeAntiga = parseFloat(quantidadeUltimaAtualizacao);
            const novaQuantidade = parseFloat(quantidadeNovaAtualizacao);
            const diferenca = novaQuantidade - quantidadeAntiga;
  
            transaction.executeSql(
              `UPDATE entrada_saida
              SET quantidade = ?,
              estoque_atual = estoque_atual + ?
              WHERE id_produto = ? AND data_atualizacao = ?;`,
              [quantidadeNovaAtualizacao, diferenca, route.params.produto.id_produto, dataAtualizacaoEstoque],
              (_, result) => {
                transaction.executeSql(
                  `UPDATE estoque
                  SET estoque_atual = estoque_atual + ?
                  WHERE id_produto = ?;`,
                  [diferenca, route.params.produto.id_produto],
                  (_, result) => {
                    // Atualizações concluídas
                  },
                  (_, error) => {
                    // Erro na atualização do estoque
                  }
                );
              },
              (_, error) => {
                // Erro na atualização da entrada_saida
              }
            );
          } else {
            // A quantidade da nova atualização está vazia
          }
        },
        (_, error) => {
          // Erro na atualização de produtos
        }
      );
    }, (error) => {
      // Erro na transação
    }, () => {
      setModalMessage('Transação concluída com sucesso.');
      setOperacaoSucesso(true);
      setModalVisible(true);
    });
  };
  
  //========== modal responsável pelas mensagens da consulta ao banco de dados ==========
  const CustomModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Button
              title="OK"
              onPress={() => {
                setModalVisible(false);
                if (operacaoSucesso) {
                  navigation.navigate('ListarProdutos');
                }
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  // ========== retorno da função ==========
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID do Produto:</Text>
          <Text style={styles.text}>{route.params.produto.id_produto}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estoque Atual:</Text>
          <Text style={styles.text}>{estoqueProduto}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Quantidade da Última Atualização:</Text>
          <Text style={styles.text}>{quantidadeUltimaAtualizacao}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Última Atualização:</Text>
          <Text style={styles.text}>{dataAtualizacaoEstoque}</Text>
        </View>
      </View>
      
      <Text style={styles.label}>Nome do Produto:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setNomeProduto}
        value={nomeProduto}
      />
      
      <Text style={styles.label}>Tipo do Produto:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTipoProduto}
        value={tipoProduto}
      />
      
      <Text style={styles.label}>Estoque Mínimo:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEstoqueMinimo}
        value={estoqueMinimo}
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Quantidade da Nova Atualização:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setQuantidadeNovaAtualizacao}
        value={quantidadeNovaAtualizacao}
        keyboardType="numeric"
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <CustomModal />
    </View>
  );
}

// ========== estilização ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  }
});
