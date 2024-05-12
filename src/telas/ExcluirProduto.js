import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Button } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/excluirProdutoStyles';


export default function ExcluirProduto({ route, navigation }) {
  const [produto, setProduto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);  
  const [modalMessage, setModalMessage] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [operacaoSucesso, setOperacaoSucesso] = useState(false);


  // Hook acionado quando a tela ExcluirProduto é carregada
  // ------------------------------------------------------
  useEffect(() => {
    // Obtém o produto passado pela navegação
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
    }
  }, [route.params]);
    
  // Acionada quando o botão 'Excluir Produto' é pressionado. Carrega um modal
  // -------------------------------------------------------------------------
  const confirmarExclusao = () => {
    setModalType('confirm');
  };

  // Acionada quando o usuário confirma, no modal, a exclusão do produto
  // -------------------------------------------------------------------
  const excluirProduto = () => {
    if (!produto) {
      setModalMessage('Produto não encontrado.');
      setModalType(null);
      return;
    }

    // Exclui o produto da tabela produtos
    // -----------------------------------
    db.transaction((transaction) => {
      transaction.executeSql(
        `DELETE FROM produtos WHERE id_produto = ?;`,
        [produto.id_produto],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {

            // Exclui o produto da tabela estoque
            // ----------------------------------
            transaction.executeSql(
              `DELETE FROM estoque WHERE id_produto = ?;`,
              [produto.id_produto],
              (_, { rowsAffected: rowsAffectedEstoque }) => {
                if (rowsAffectedEstoque > 0) {
                  setModalMessage('Produto excluído com sucesso!');
                  setModalType('message');
                  setOperacaoSucesso(true);
                } else {
                  setModalMessage('Erro ao excluir produto do estoque.');
                  setModalType('message');
                }
              },
              (_, error) => {
                setModalMessage('Erro ao excluir produto do estoque atual: ' + error);
                setModalType('message');
              }
            ); 
          } else {
            setModalMessage('Erro ao excluir produto.');
            setModalType('message');
          }
        },
        (_, error) => {
          setModalMessage('Erro ao excluir produto: ' + error);
          setModalType('message');
        }
      );
    });
  };

  // modal de mensagem da consulta ao banco de dados
  // -----------------------------------------------
  const CustomModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalType === 'message'}
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
        visible={modalType === 'confirm'}
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
                onPress={() => setModalType(null)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomModal />

    </View>
  );
}

