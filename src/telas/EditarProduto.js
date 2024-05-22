import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/editarProdutoStyles';

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
      carregaInformacoesProduto();
      carregaQuantidadeUltimaOperacao();
    }
  }, [route.params]);

  // ===== busca na tabela produtos, o nome do produto, o tipo do produto e o estoque mínimo =====
  const carregaInformacoesProduto = () => {
    db.transaction((transaction) => {
        transaction.executeSql(
            'SELECT nome_produto, tipo_produto, estoque_minimo FROM produtos WHERE id_produto = ?',
            [route.params.produto.id_produto],
            (_, { rows }) => {
                if (rows.length > 0) {
                    const produto = rows.item(0);
                    setNomeProduto(produto.nome_produto);
                    setTipoProduto(produto.tipo_produto);
                    setEstoqueMinimo(String(produto.estoque_minimo));
                    console.log('Informações do produto carregadas:', produto);
                } else {
                    console.log('Nenhum produto encontrado com o id especificado.');
                    setModalMessage('Nenhum produto encontrado com o id especificado.');
                    setModalVisible(true);
                }
            },
            (_, error) => {
                console.log('Erro ao carregar informações do produto:', error);
                setModalMessage('Erro ao carregar informações do produto:', error);
                setModalVisible(true);
            }
        );
    });
  };

  // Função para carregar quantidade da última operação
  const carregaQuantidadeUltimaOperacao = () => {
    console.log("Função carregaQuantidadeUltimaOperacao chamada");
    console.log("ID do produto:", route.params.produto.id_produto);

    db.transaction(transaction => {
        transaction.executeSql(
            'SELECT quantidade, data_atualizacao, estoque_atual FROM entrada_saida WHERE id_produto = ? ORDER BY data_atualizacao DESC LIMIT 1',
            [route.params.produto.id_produto],
            (_, { rows }) => {
                console.log("Consulta SQL executada");
                if (rows.length > 0) {
                    console.log('Rows found:', rows.length);
                    const operacao = rows.item(0);
                    console.log('Dados da última operação:', operacao);
                    setQuantidadeUltimaAtualizacao(String(operacao.quantidade));
                    setDataAtualizacaoEstoque(String(operacao.data_atualizacao));
                    setEstoqueProduto(String(operacao.estoque_atual));
                } else {
                    console.log('Nenhum resultado encontrado para este id_produto');
                    setModalMessage('Nenhum resultado encontrado para este id_produto');
                    setModalVisible(true);
                }
            },
            (_, error) => {
                console.log('Erro ao carregar quantidade da última operação:', error);
                setModalMessage('Erro ao carregar quantidade da última operação:', error);
                setModalVisible(true);
            }
        );
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  // ========== armazena no banco de dados as informações editadas pelo usuário ==========
  const salvarAlteracoes = () => {
    const nomeProdutoUpperCase = nomeProduto.toUpperCase();
    let tipoProdutoFormatado = capitalizeFirstLetter(tipoProduto);

    //const tipoProdutoUpperCase = tipoProduto.toUpperCase();
    console.log('Id do Produto:', route.params.produto.id_produto);
    console.log('Estoque Mínimo:', estoqueMinimo);
    console.log('Nome do Produto:', nomeProduto);
    console.log('Tipo do Produto:', tipoProduto);
    //console.log('Nova quantidade:', novaQuantidade);
    console.log('Estoque Atual:', estoqueProduto);

    db.transaction((transaction) => {
        transaction.executeSql(
            `UPDATE produtos 
            SET nome_produto = ?, 
                tipo_produto = ?, 
                estoque_minimo = ? 
            WHERE id_produto = ?;`,
            [nomeProdutoUpperCase, tipoProdutoFormatado, parseInt(estoqueMinimo), route.params.produto.id_produto],
            (_, result) => {
                let quantidade;
                let diferenca = 0;
                if (quantidadeNovaAtualizacao.trim() !== '') {
                    const quantidadeAntiga = parseFloat(quantidadeUltimaAtualizacao);
                    const novaQuantidade = parseInt(quantidadeNovaAtualizacao);
                    diferenca = novaQuantidade - quantidadeAntiga;
                    quantidade = novaQuantidade;
                } else {
                    quantidade = parseInt(quantidadeUltimaAtualizacao);
                }

                transaction.executeSql(
                    `UPDATE entrada_saida
                    SET quantidade = ?,
                        estoque_atual = estoque_atual + ?
                    WHERE id_produto = ? AND data_atualizacao = ?;`,
                    [quantidade, diferenca, route.params.produto.id_produto, dataAtualizacaoEstoque],
                    (_, result) => {
                        transaction.executeSql(
                            `UPDATE estoque
                            SET estoque_atual = estoque_atual + ?
                            WHERE id_produto = ?;`,
                            [diferenca, route.params.produto.id_produto],
                            (_, result) => {
                                console.log('Tabela estoque atualizada');
                                setModalMessage('Transação concluída com sucesso.');
                                setOperacaoSucesso(true);
                                setModalVisible(true);
                            },
                            (_, error) => {
                                console.log('Erro na atualização do estoque', error);
                            }
                        );
                    },
                    (_, error) => {
                        console.log('Erro na atualização da entrada_saida', error);
                    }
                );
            },
            (_, error) => {
                console.log('Erro na atualização de produtos', error);
            }
        );
    }, 
    (error) => {
        console.log('Erro na transação geral', error);
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
  