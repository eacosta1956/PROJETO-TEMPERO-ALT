import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import { db } from '../database/AbreConexao';


// Função principal
// ----------------
export default function ExcluirProduto({ route, navigation }) {
  const [produto, setProduto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  // É um Hook. Acionado quando a tela ExcluirProduto é carregada
  // ------------------------------------------------------------
  useEffect(() => {
    // Obtém o produto passado pela navegação
    if (route.params && route.params.produto) {
      setProduto(route.params.produto);
      console.log("id do produto: ", route.params.produto.id_produto)
    }
  }, [route.params]);
    
  // Acionada quando o botão Excluir produto é pressionado. Carrega um modal.
  // -----------------------------------------------------------------------
  const confirmarExclusao = () => {
    setModalVisible(true);
  };

  // Acionada quando o usuário confirma, no modal, a exclusão do produto
  // -------------------------------------------------------------------
  const excluirProduto = () => {
    if (!produto) {
      Alert.alert('Erro', 'Produto não encontrado.');
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
                  Alert.alert('Sucesso', 'Produto excluído com sucesso!');
                  setModalVisible(false);
                  navigation.goBack(); // Volta para a tela anterior
                } else {
                  Alert.alert('Erro', 'Erro ao excluir produto do estoque.');
                }
              },
              (_, error) => {
                Alert.alert('Erro', 'Erro ao excluir produto do estoque atual: ' + error);
              }
            ); 
          } else {
            Alert.alert('Erro', 'Erro ao excluir produto.');
          }
        },
        (_, error) => {
          Alert.alert('Erro', 'Erro ao excluir produto: ' + error);
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

      <TouchableOpacity style={styles.button} onPress={confirmarExclusao}>
        <Text style={styles.buttonText}>Excluir Produto</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '80%',
    marginTop: 30,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  buttonModal: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    backgroundColor: '#3498db',
  },
  buttonModalCancel: {
    backgroundColor: '#aaa',
  },
});