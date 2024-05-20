import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button  } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/atualizarEstoqueStyles';


export default function AtualizarEstoque({ route, navigation }) {
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [precoCompra, setPrecoCompra] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  //const [tipoProduto, setTipoProduto] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [operacaoSucesso, setOperacaoSucesso] = useState(false);

  // mostra na tela os dados do produto selecionado na tela 'listar produtos'
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
      setQuantidade('');
      setPrecoCompra('');
      setPrecoVenda('');
    }
  }, [route.params]);

  // registra a entrada ou saída de um produto na tabela entrada-saída
  // registra o novo valor de estoque e a data da movimentação na tabela estoque 
  // ---------------------------------------------------------------------------
  const salvarMovimentacaoEstoque = (operacao) => {

    // data no formato 'AAAA/MM/DD hh:mm:ss'
    // -------------------------------------
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    // -------------------------------------

    // Impede a retirada de uma quantidade maior do que o estoque
    // ----------------------------------------------------------
    const qtdInt = parseInt(quantidade);
    if (operacao === 'retirar' && qtdInt > produto.estoque_atual) {
      setModalMessage('Quantidade a retirar maior que o estoque atual!');
      setModalVisible(true);
      setQuantidade(null);
      return;
    }

    const qtdMovimentada = operacao === 'adicionar' ? qtdInt : -qtdInt;
    
    db.transaction((transaction) => {
      transaction.executeSql(
        `UPDATE estoque
        SET estoque_atual = estoque_atual + ?, data_atualizacao_estoque = ? 
        ultimo_preco_compra = ?
        ultimo_preco_venda = ?
        WHERE id_produto = ?;`,
        [qtdMovimentada, formattedDateTime, produto.id_produto, precoCompra, precoVenda],
        
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            atualizarProdutoSelecionado(produto.id_produto);

            transaction.executeSql(
              `INSERT INTO entrada_saida (id_produto, quantidade, data_atualizacao, estoque_atual, preco_compra, preco_venda) VALUES (?, ?, ?, ?, ?, ?);`,
              [produto.id_produto, qtdMovimentada, formattedDateTime, qtdMovimentada + produto.estoque_atual, precoCompra, precoVenda],
              () => {
                setModalMessage('Movimentação de estoque realizada com sucesso!');
                setOperacaoSucesso(true);
                setModalVisible(true);
                setQuantidade('');
              },
              (_, error) => {
                setModalMessage('Erro ao salvar movimentação de estoque: ' + error);
                setModalVisible(true);
              }
            );
          } else {
            setModalMessage('Produto não encontrado ou erro ao atualizar estoque.');
            setModalVisible(true);
          }
        },
        (_, error) => {
          setModalMessage('Erro ao atualizar estoque: ' + error);
          setModalVisible(true);
        }
      );
    });
  };

  // atualiza o estado 'produto'
  // --------------------------
  const atualizarProdutoSelecionado = (id_produto) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT * FROM produtos WHERE id_produto = ?`,
        [id_produto],
        (_, { rows }) => {
          const produtoAtualizado = rows._array[0];
          setProduto(produtoAtualizado);
        },
        (_, error) => {
          // Tratamento de erro
        }
      );
    });
  };

  // modal responsável pelas mensagens da consulta ao banco de dados
  // ---------------------------------------------------------------
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

  function exibir() {
    if (produto && produto.tipo_produto.toLowerCase() === 'bebida') {
        return(
          <TextInput
          style={styles.input}
          placeholder="Preço de Venda"
          keyboardType="numeric"
          value={precoVenda}
          onChangeText={(text) => setPrecoVenda(text)}
        />
        )
      }
  }

  // retorno da função
  // -----------------
  return (
    <View style={styles.container}>
      <View>
        {produto && (
          <>
            <Text>Nome do Produto: {produto.nome_produto}</Text>
            <Text>Tipo do Produto: {produto.tipo_produto}</Text>
            <Text>Estoque Atual: {produto.estoque_atual}</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Preço de Compra"
        keyboardType="numeric"
        value={precoCompra}
        onChangeText={(text) => setPrecoCompra(text)}
      />

      {exibir()}
      
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

      <CustomModal />

    </View>
  );
}

