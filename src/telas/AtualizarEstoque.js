import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/atualizarEstoqueStyles';

export default function AtualizarEstoque({ route, navigation }) {
  // Estados para armazenar informações sobre o produto, quantidade, visibilidade do modal e mensagens
  // -------------------------------------------------------------------------------------------------
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalInputValue, setModalInputValue] = useState('');
  const [operacao, setOperacao] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Efeito para definir o produto quando os parâmetros da rota mudam
  // ----------------------------------------------------------------
  useEffect(() => {
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
      setQuantidade('');
    }
  }, [route.params]);

  // Função para salvar a movimentação de estoque no banco de dados
  // --------------------------------------------------------------
  const salvarMovimentacaoEstoque = (preco) => {

    // comandos para transformar a data do sistema, que está no padrão dia/mês/ano, para 
    // o padrão ano/mês/dia, de modo a possibilitar operações com data no SQLite
    // ---------------------------------------------------------------------------------
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

    // se o usuário pressionar o botão Adicionar, a quantidade a ser armazenada será positiva
    // caso contrário, negativa
    // --------------------------------------------------------------------------------------
    const qtdInt = parseInt(quantidade);
    const qtdMovimentada = operacao === 'adicionar' ? qtdInt : -qtdInt;

    // em uma operação de adição ao estoque, o usuário preencherá somente o preço de compra
    // o preço de venda será preenchido somente quando se tratar de retirada de bebidas
    // ------------------------------------------------------------------------------------
    db.transaction((transaction) => {
      let precoCompra = 0;
      let precoVenda = 0;

      if (operacao === 'adicionar') {
        precoCompra = parseFloat(preco);
        precoVenda = 0;
      } else {
        precoVenda = parseFloat(preco);
        precoCompra = 0;
      }

      // Primeiro passo: buscar o estoque atual do produto na tabela estoque
      // -------------------------------------------------------------------
      transaction.executeSql(
        'SELECT estoque_atual FROM estoque WHERE id_produto = ?',
        [produto.id_produto],
        (_, { rows }) => {
          const estoqueAtual = rows._array[0].estoque_atual;
          const novoEstoqueAtual = estoqueAtual + qtdMovimentada;

          // Atualiza o estoque com a nova quantidade, data de atualização e preço unitário da operação
          // ------------------------------------------------------------------------------------------
          transaction.executeSql(
            `UPDATE estoque 
            SET estoque_atual = ?, 
            data_atualizacao_estoque = ?, 
            ultimo_preco_compra = ?, 
            ultimo_preco_venda = ? 
            WHERE id_produto = ?`,
            [novoEstoqueAtual, formattedDateTime, precoCompra, precoVenda, produto.id_produto],
            (_, { rowsAffected }) => {
              if (rowsAffected > 0) {
                atualizarProdutoSelecionado(produto.id_produto);

                // Insere a movimentação na tabela entrada_saida
                // ---------------------------------------------
                transaction.executeSql(
                  `INSERT INTO entrada_saida (id_produto, quantidade, data_atualizacao, estoque_atual, preco_compra, preco_venda) VALUES (?, ?, ?, ?, ?, ?);`,
                  [produto.id_produto, qtdMovimentada, formattedDateTime, novoEstoqueAtual, precoCompra, precoVenda],
                  () => {
                    setQuantidade('');
                    setModalInputValue('');
                    setModalTitle('');
                    setOperacao('');
                    setModalMessage('Movimentação de estoque realizada com sucesso!');
                    setModalVisible(true);
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
        },
        (_, error) => {
          setModalMessage('Erro ao buscar estoque atual: ' + error);
          setModalVisible(true);
        }
      );
    });
  };

  // Função para atualizar o produto selecionado no estado após UPDATE na tabela estoque
  // -----------------------------------------------------------------------------------
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
          console.error('Erro ao atualizar produto selecionado:', error);
        }
      );
    });
  };

  // Função para confirmar a entrada do valor no modal
  // -------------------------------------------------
  const confirmarModal = () => {
    if (!isNaN(parseFloat(modalInputValue))) {
      salvarMovimentacaoEstoque(modalInputValue);
    } else {
      setModalMessage('Por favor, insira um valor válido.');
      setModalVisible(true);
    }
  };

  // Função para cancelar a operação no modal
  // ----------------------------------------
  const cancelarModal= () => {
    setModalVisible(false);
    setModalMessage('');
    setQuantidade(''); // Limpar a quantidade
    setModalInputValue(''); // Limpar o valor da TextInput de preço
    navigation.navigate('ListarProdutos'); // Navegar de volta para a tela de listagem de produtos
  };

  // Função para lidar com a retirada de produto do estoque
  // ------------------------------------------------------
  const retirarProduto= () => {
    const qtdInt = parseInt(quantidade);
    if (qtdInt > 0) {
      if (qtdInt <= produto.estoque_atual) {
        if (produto.tipo_produto === 'Bebida') {
          setModalTitle('Retirar produto do estoque');
          setOperacao('retirar');
          setModalVisible(true);
        } else {
          salvarMovimentacaoEstoque(0);
        }
      } else {
        setModalMessage('Quantidade maior do que o estoque atual.');
        setModalVisible(true);
      }
    } else {
      setModalMessage('Por favor, insira um valor maior que zero.');
      setModalVisible(true);
    }
  };

  // Função para fechar o modal
  // --------------------------
  const fecharModal= () => {
    setModalVisible(false);
    setModalMessage('');

    if (modalMessage === 'Movimentação de estoque realizada com sucesso!') {
      navigation.navigate('ListarProdutos');
    } else {
      setQuantidade(''); // Limpar a TextInput em caso de mensagem de erro
    }
  };

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

      {/* Botão para adicionar produto ao estoque */}
      {/* --------------------------------------- */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#27ae60' }]}
        onPress={() => {
          const qtdInt = parseInt(quantidade);
          if (qtdInt > 0) {
            setModalTitle('Adicionar produto ao estoque');
            setOperacao('adicionar');
            setModalVisible(true);
          } else {
            setModalMessage('Por favor, insira um valor maior que zero.');
            setModalVisible(true);
          }
        }}
      >
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      {/* Botão para retirar produto do estoque */}
      {/* ------------------------------------- */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e74c3c' }]}
        onPress={retirarProduto}
      >
        <Text style={styles.buttonText}>Retirar</Text>
      </TouchableOpacity>

      {/* Modal para confirmar a operação de adicionar ou retirar */}
      {/* ------------------------------------------------------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && modalTitle !== ''}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text>Produto: <Text style={styles.modalText}>{produto && produto.nome_produto}</Text></Text>
            <Text>Quantidade: <Text style={styles.modalText}>{quantidade}</Text></Text>
            {operacao && (operacao === 'adicionar' || (operacao === 'retirar' && produto.tipo_produto === 'Bebida')) && (
              <>
                <Text style={styles.label}>{operacao === 'adicionar' ? "Preço de Compra" : "Preço de Venda"}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={operacao === 'adicionar' ? "Preço de Compra" : "Preço de Venda"}
                  keyboardType="numeric"
                  value={modalInputValue}
                  onChangeText={(text) => setModalInputValue(text)}
                />
              </>
            )}
            <View style={styles.modalButtons}>
              <Button title="OK" onPress={confirmarModal} color="#27ae60" />
              <Button title="Cancelar" onPress={cancelarModal} color="#e74c3c" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para mensagens de erro ou de sucesso */}
      {/* ------------------------------------------ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalMessage !== ''}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Button title="OK" onPress={fecharModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
