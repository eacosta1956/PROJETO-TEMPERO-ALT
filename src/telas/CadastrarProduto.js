import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Button } from 'react-native';
import { db } from '../database/AbreConexao'; // Importe o banco de dados SQLite
import styles from '../styles/cadastrarProdutoStyles';

export default function CadastrarProduto({ navigation }) {
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [bebidaSelected, setBebidaSelected] = useState(false);
  const [comidaSelected, setComidaSelected] = useState(false);
  const [descartavelSelected, setDescartavelSelected] = useState(false);
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // lista os produtos que contêm as letras digitadas na TextInput
  // --------------------------------------------------------------
  const buscarProdutos = (texto) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT * FROM produtos WHERE nome_produto LIKE ?`,
        [`%${texto}%`],
        (_, { rows }) => {
          const produtos = rows._array;
          setProdutosEncontrados(produtos);
        },
        (_, error) => {
          setModalMessage('Erro ao buscar produtos:', error);
          setModalVisible(true);
        }
      );
    });
  };
  
  // não permite o cadastro de produtos duplicados
  // ---------------------------------------------
  const verificarDuplicata = (nomeProduto) => {
    return new Promise((resolve, reject) => {
      db.transaction((transaction) => {
        transaction.executeSql(
          `SELECT COUNT(*) AS count FROM produtos WHERE nome_produto = ?`,
          [nomeProduto],
          (_, { rows }) => {
            const { count } = rows.item(0);
            if (count > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (_, error) => {
            console.log('Erro ao verificar duplicata:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  // armazena o produto no banco de dados
  // ------------------------------------
  const salvarProduto = async () => {
    if (!descricaoProduto || !estoqueMinimo || !tipoProduto) {
      setModalMessage('Preencha todos os campos!');
      setModalVisible(true);
      return;
    }

    const descricaoUpperCase = descricaoProduto.toUpperCase();

    try {
      const produtoDuplicado = await verificarDuplicata(descricaoUpperCase);
      if (produtoDuplicado) {
        setModalMessage('Este produto já está cadastrado!');
        setModalVisible(true);
        setDescricaoProduto('');
        setEstoqueMinimo('');
        setTipoProduto('');
        setBebidaSelected(false);
        setComidaSelected(false);
        setDescartavelSelected(false);
        setProdutosEncontrados([]);
        return;
      }

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

      db.transaction((transaction) => {
        transaction.executeSql(
          `INSERT INTO produtos (nome_produto, estoque_minimo, tipo_produto, data_cadastro) 
          VALUES (?, ?, ?, ?);`,
          [descricaoUpperCase, parseInt(estoqueMinimo), tipoProduto, formattedDateTime],
          (_, { insertId }) => {
            transaction.executeSql(
              `INSERT INTO estoque (id_produto, estoque_atual, data_atualizacao_estoque, ultimo_preco_compra, ultimo_preco_venda) VALUES (?, ?, ?, ?, ?);`,
              [insertId, 0, formattedDateTime, 0, 0],
              () => {
                setModalMessage('Produto cadastrado com sucesso!');
                setModalVisible(true);
                setDescricaoProduto('');
                setEstoqueMinimo('');
                setTipoProduto('');
                setBebidaSelected(false);
                setComidaSelected(false);
                setDescartavelSelected(false);
              },
              (_, error) => {
                setModalMessage('Erro ao inserir produto:', error);
                setModalVisible(true);
              }
            );
          },
          (_, error) => {
            setModalMessage('Erro ao cadastrar produto: ' + error);
            setModalVisible(true);
          }
        );
      });
    } catch (error) {
      setModalMessage('Erro ao verificar duplicata: ' + error);
      setModalVisible(true);
    }
  };

  //========== modal para mensagens ==========
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
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  //========== retorno da função ==========
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input1}
        placeholder="Descrição do produto"
        value={descricaoProduto}
        onChangeText={(text) => {
          setDescricaoProduto(text);
          if (text.trim() === '') {
            setProdutosEncontrados([]);
          } else {
            buscarProdutos(text);
          }
        }}
      />

      <View style={styles.contentContainer}>  
        <ScrollView style={styles.scrollView}>
          {produtosEncontrados.length > 0 && (
            produtosEncontrados.map((produto) => (
              <Text key={produto.id_produto}>{produto.nome_produto}</Text>
            ))
          )}
        </ScrollView>
  
        <TextInput
          style={styles.input2}
          placeholder="Estoque mínimo"
          keyboardType="numeric"
          value={estoqueMinimo}
          onChangeText={(text) => setEstoqueMinimo(text)}
        />

        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[styles.radioButton1, bebidaSelected ? styles.radioButtonSelected : null]}
            onPress={() => {
              setTipoProduto('Bebida');
              setBebidaSelected(true);
              setComidaSelected(false);
              setDescartavelSelected(false)
            }}  
          >
            <Text style={[styles.radioText, bebidaSelected ? styles.selectedText : null]}>Bebida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioButton1, comidaSelected ? styles.radioButtonSelected : null]}
            onPress={() => {
              setTipoProduto('Comida')
              setComidaSelected(true);
              setBebidaSelected(false);
              setDescartavelSelected(false)
              }}
          >
            <Text style={[styles.radioText, comidaSelected ? styles.selectedText : null]}>Comida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioButton2, descartavelSelected ? styles.radioButtonSelected : null]}
            onPress={() => {
              setTipoProduto('Descartavel')
              setDescartavelSelected(true)
              setComidaSelected(false);
              setBebidaSelected(false);
              }}
          >
            <Text style={[styles.radioText, descartavelSelected ? styles.selectedText : null]}>Descartável</Text>
          </TouchableOpacity>    
        </View>

        <TouchableOpacity style={styles.button} onPress={salvarProduto}>
          <Text style={styles.buttonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </View>

      <CustomModal />
      
    </View>
  );
}

