import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Button } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/excluirProdutoStyles';

export default function ExcluirProduto({ route, navigation }) {
  const [produto, setProduto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);  
  const [modalMessage, setModalMessage] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [tipoModal, setTipoModal] = useState(null);
  const [operacaoSucesso, setOperacaoSucesso] = useState(false);

  /* Hook useEffect: Executa quando o componente é montado ou quando os parâmetros
     da rota mudam, carregando os detalhes do produto passado pela navegação.
     ----------------------------------------------------------------------------- */
  useEffect(() => {
    // Obtém o produto passado pela navegação
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
    }
  }, [route.params]);
    
  /* Função: Define o tipo de modal como 'confirm', o que aciona a exibição do modal de confirmação.
     ----------------------------------------------------------------------------------------------- */
  const confirmarExclusao = () => {
    setTipoModal('confirm');
  };

  /* Função: Executa a exclusão do produto do banco de dados em duas etapas:
     - exclui o produto da tabela produtos.
     - exclui o produto da tabela estoque, se a primeira exclusão for bem-sucedida.
     Atualiza os estados modalMessage, tipoModal e operacaoSucesso, com base no
     resultado da operação.
     ----------------------------------------------------------------------------- */
  const excluirProduto = () => {
    if (!produto) {
      setModalMessage('Produto não encontrado.');
      setTipoModal(null);
      return;
    }

    db.transaction((transaction) => {
      transaction.executeSql(
        `DELETE FROM produtos WHERE id_produto = ?;`,
        [produto.id_produto],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {

            transaction.executeSql(
              `DELETE FROM estoque WHERE id_produto = ?;`,
              [produto.id_produto],
              (_, { rowsAffected: rowsAffectedEstoque }) => {
                if (rowsAffectedEstoque > 0) {
                  setModalMessage('Produto excluído com sucesso!');
                  setTipoModal('message');
                  setOperacaoSucesso(true);
                } else {
                  setModalMessage('Erro ao excluir produto do estoque.');
                  setTipoModal('message');
                }
              },
              (_, error) => {
                setModalMessage('Erro ao excluir produto do estoque atual: ' + error);
                setTipoModal('message');
              }
            ); 
          } else {
            setModalMessage('Erro ao excluir produto.');
            setTipoModal('message');
          }
        },
        (_, error) => {
          setModalMessage('Erro ao excluir produto: ' + error);
          setTipoModal('message');
        }
      );
    });
  };

  /* Modal: Exibe um modal de mensagem com base no tipoModal definido. 
     Navega de volta para a lista de produtos se a operação foi bem-sucedida.
     ------------------------------------------------------------------------ */
  const ModalPersonalizado = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={tipoModal === 'message'}
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

  /* Renderização:
     Exibe informações do produto.
     Botão "Excluir Produto" aciona o modal de confirmação.
     Modal de Confirmação: Exibe um modal perguntando ao usuário se deseja excluir 
     o produto, com botões para confirmar ou cancelar a exclusão.
     ModalPersonalizado: Exibe mensagens de sucesso ou erro após a tentativa de exclusão. 
    ------------------------------------------------------------------------------------- */
  return (
    <View style={styles.container}>
      <View>
        {produto && (
          <>
            <Text>Nome do Produto: {produto.nome_produto}</Text>
            <Text>ID do Produto: {produto.id_produto}</Text>
            <Text>Estoque Atual: {produto.estoque_atual}</Text>
            <Text>Estoque Mínimo: {produto.estoque_minimo}</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={confirmarExclusao}>
        <Text style={styles.buttonText}>Excluir Produto</Text>
      </TouchableOpacity>

      {/* modal de confirmação de exclusão do produto 
          ------------------------------------------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={tipoModal === 'confirm'}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Tem certeza de que deseja excluir o produto do banco de dados?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonModal} onPress={excluirProduto}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonModal, styles.buttonModalCancel]}
                onPress={() => {
                  setTipoModal(null);
                  navigation.navigate('ListarProdutos');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalPersonalizado />

    </View>
  );
}

