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


  // Função para inserir automaticamente a vírgula e o ponto de milhar
  // -----------------------------------------------------------------
  const formatCurrency = (value) => {
    if (!value) return '';
    value = value.replace(/\D/g, ''); // Remove tudo que não for dígito
    const length = value.length;

    if (length === 0) {
      return '';
    } else if (length === 1) {
      return '0,0' + value;
    } else if (length === 2) {
      return '0,' + value;
    } else {
      const intPart = value.slice(0, length - 2).replace(/^0+/, ''); // Remove zeros à esquerda
      const decimalPart = value.slice(length - 2);
      const intPartWithThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separadores de milhares
      return (intPartWithThousands === '' ? '0' : intPartWithThousands) + ',' + decimalPart;
    }
  };

  // Função para converter valor do formato brasileiro para o formato padrão
  // -----------------------------------------------------------------------
  const toStandardFormat = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  // Função para converter valor do formato padrão para o formato brasileiro
  // -----------------------------------------------------------------------
  const toBrazilianFormat = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0,00';
    }
    return parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };



  // Função para salvar a movimentação de estoque no banco de dados
  // --------------------------------------------------------------
  const salvarMovimentacaoEstoque = (preco) => {
    // comandos para transformar a data do sistema, que está no padrão dia/mês/ano, para 
    // o padrão ano/mês/dia, de modo a possibilitar operações com data no SQLite
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
    const qtdInt = parseInt(quantidade);
    const qtdMovimentada = operacao === 'adicionar' ? qtdInt : -qtdInt;
  
    const precoConvertido = toStandardFormat(preco);
  
    // em uma operação de adição ao estoque, o usuário preencherá somente o preço de compra
    // o preço de venda será preenchido somente quando se tratar de retirada de bebidas
    db.transaction((transaction) => {
      // Primeiro passo: buscar o estoque atual do produto na tabela estoque
      transaction.executeSql(
        'SELECT estoque_atual, ultimo_preco_compra, ultimo_preco_venda FROM estoque WHERE id_produto = ?',
        [produto.id_produto],
        (_, { rows }) => {
          if (rows.length > 0) {
            const { estoque_atual, ultimo_preco_compra, ultimo_preco_venda } = rows._array[0];
            const novoEstoqueAtual = estoque_atual + qtdMovimentada;
  
            let precoCompra = 0;
            let precoVenda = 0;
            let ultPrecoCompra = ultimo_preco_compra;
            let ultPrecoVenda = ultimo_preco_venda;
  
            if (operacao === 'adicionar') {
              precoCompra = precoConvertido; // a ser armazenado em entrada_saida
              precoVenda = 0; // a ser armazenado em entrada_saida
              ultPrecoCompra = precoConvertido; // a ser armazenado em estoque
            } else {
              precoCompra = 0; // a ser armazenado em entrada_saida
              precoVenda = precoConvertido; // a ser armazenado em entrada_saida
              ultPrecoVenda = precoConvertido; // a ser armazenado em estoque
            }
  
            // Atualiza o estoque com a nova quantidade, data de atualização e preço unitário da operação
            transaction.executeSql(
              `UPDATE estoque 
               SET estoque_atual = ?, 
                   data_atualizacao_estoque = ?, 
                   ultimo_preco_compra = ?, 
                   ultimo_preco_venda = ? 
               WHERE id_produto = ?`,
              [novoEstoqueAtual, formattedDateTime, ultPrecoCompra, ultPrecoVenda, produto.id_produto],
              (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                  atualizarProdutoSelecionado(produto.id_produto);
  
                  // Insere a movimentação na tabela entrada_saida
                  transaction.executeSql(
                    `INSERT INTO entrada_saida (id_produto, quantidade, data_atualizacao, estoque_atual, preco_compra, preco_venda) 
                     VALUES (?, ?, ?, ?, ?, ?);`,
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
          } else {
            setModalMessage('Produto não encontrado.');
            setModalVisible(true);
          }
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
    if (!isNaN(toStandardFormat(modalInputValue))) {
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
            <Text>Último Preço de Compra: {toBrazilianFormat(produto.ultimo_preco_compra)}</Text>
            {produto.tipo_produto === 'Bebida' && (<Text style={styles.label}>Último Preço de Venda: {toBrazilianFormat(produto.ultimo_preco_venda)}</Text> )}
          </>
        )}
      </View>

      <TextInput
        style={styles.input_qtde}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={(text) => setQuantidade(text)}
      />

      {/* Botão para adicionar produto ao estoque */}
      {/* --------------------------------------- */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4e6f35' }]}
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
        <Text style={styles.buttonText}>Adicionar ao Estoque</Text>
      </TouchableOpacity>

      {/* Botão para retirar produto do estoque */}
      {/* ------------------------------------- */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#8B0000' }]}
        onPress={retirarProduto}
      >
        <Text style={styles.buttonText}>Retirar do Estoque</Text>
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

    {operacao && (
      <>
        {/* Adicionar o último preço de compra quando a operação for 'adicionar' */}
        {operacao === 'adicionar' && (
          <Text style={styles.label}>Último Preço de Compra: {toBrazilianFormat(produto.ultimo_preco_compra)}</Text>
        )}

        {/* Adicionar o preço de venda quando a operação for 'retirar' e o tipo de produto for 'Bebida' */}
        {operacao === 'retirar' && produto.tipo_produto === 'Bebida' && (
          <Text style={styles.label}>Último Preço de Venda: {toBrazilianFormat(produto.ultimo_preco_venda)}</Text>
        )}

        {/* TextInput para preço de compra ou venda */}
        <Text style={styles.label1}>{operacao === 'adicionar' ? "Preencher Preço de Compra" : "Preencher Preço de Venda"}</Text>
        <TextInput style={styles.input_modal}
          //placeholder={operacao === 'adicionar' ? "Preço de Compra" : "Preço de Venda"}
          keyboardType="numeric"
          value={modalInputValue}
          onChangeText={(text) => setModalInputValue(formatCurrency(text))}
        />
      </>
    )}

<View style={styles.modalButtons}>
  <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#27ae60' }]} onPress={confirmarModal}>
    <Text style={styles.modalButtonText}>OK</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#e74c3c' }]} onPress={cancelarModal}>
    <Text style={styles.modalButtonText}>Cancelar</Text>
  </TouchableOpacity>
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

            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#27ae60' }]} onPress={fecharModal}>
            <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}