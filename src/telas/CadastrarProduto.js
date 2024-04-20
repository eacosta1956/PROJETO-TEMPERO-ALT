import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { db } from '../database/AbreConexao'; // Importe o banco de dados SQLite


// Função principal - Cadastrar os produtos na tabela produtos do banco de dados
// -----------------------------------------------------------------------------
export default function CadastrarProduto({ navigation }) {
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [estoqueSeguranca, setEstoqueSeguranca] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [bebidaSelected, setBebidaSelected] = useState(false);
  const [comidaSelected, setComidaSelected] = useState(false);
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);


  // Mostra na tela os produtos que contêm as letras do nome do produto digitados pelo usuário.
  // ------------------------------------------------------------------------------------------
  const buscarProdutos = (texto) => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT * FROM produtos WHERE nome_produto LIKE ?`,
        [`%${texto}%`], // Use % para buscar produtos que contenham o texto em qualquer posição
        (_, { rows }) => {
          const produtos = rows._array;
          setProdutosEncontrados(produtos);
        },
        (_, error) => {
          console.log('Erro ao buscar produtos:', error);
        }
      );
    });
  };
  
  // Verifica se há um registro com o mesmo nome já cadastrado
  // ---------------------------------------------------------
  const verificarDuplicata = (nomeProduto) => {
    return new Promise((resolve, reject) => {
      db.transaction((transaction) => {
        transaction.executeSql(
          `SELECT COUNT(*) AS count FROM produtos WHERE nome_produto = ?`,
          [nomeProduto],
          (_, { rows }) => {
            const { count } = rows.item(0);
            if (count > 0) {
              // Produto duplicado encontrado
              resolve(true);
            } else {
              // Produto não duplicado
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
  
  // Acionada quando pressionado o botão Salvar Produto
  // --------------------------------------------------
  const salvarProduto = async () => {
    if (!descricaoProduto || !estoqueSeguranca || !estoqueMinimo || !tipoProduto) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
  
    // Converte a descrição do produto para letras maiúsculas
    // ------------------------------------------------------
    const descricaoUpperCase = descricaoProduto.toUpperCase();

    // Aborta a operação de cadastrar o produto, caso haja no cadastro produto com o mesmo nome
    // ----------------------------------------------------------------------------------------
    try {
      const produtoDuplicado = await verificarDuplicata(descricaoUpperCase);
      if (produtoDuplicado) {
        Alert.alert('Atenção', 'Este produto já está cadastrado!');
        return;
      }

      // Obtém a data e hora atual no formato desejado (Brasil/São Paulo)
      // ----------------------------------------------------------------
      const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

      // Insere os dados do produto na tabela produtos
      // ---------------------------------------------
      db.transaction((transaction) => {
        transaction.executeSql(
          `INSERT INTO produtos (nome_produto, estoque_seguranca, estoque_minimo, tipo_produto, data_cadastro) 
          VALUES (?, ?, ?, ?, ?);`,
          [descricaoUpperCase, parseInt(estoqueSeguranca), parseInt(estoqueMinimo), tipoProduto, dataAtual],
          (_, { insertId }) => {

            // Após cadastrar o produto na tabela produtos, insire o id, o estoque e a data
            // na tabela estoque_atual
            // ----------------------------------------------------------------------------
            transaction.executeSql(
              `INSERT INTO estoque (id_produto, estoque_atual, data_atualizacao_estoque) VALUES (?, ?, ?);`,
              [insertId, 0, dataAtual], // Estoque atual inicialmente 0
              () => {
                Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
                // Limpa os campos após o cadastro
                // -------------------------------
                setDescricaoProduto('');
                setEstoqueSeguranca('');
                setEstoqueMinimo('');
                setTipoProduto('');
                setBebidaSelected(false);
                setComidaSelected(false);
              },
              (_, error) => {
                console.log('Erro ao inserir produto:', error);
                Alert.alert('Erro', 'Erro ao cadastrar produto: ' + error);
              }
            );
          },
          (_, error) => {
            Alert.alert('Erro', 'Erro ao cadastrar produto: ' + error);
          }
        );
      });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao verificar duplicata: ' + error);
    }
  };

  // Retorno da função principal
  // ---------------------------
  return (
    <View style={styles.container}>

        <TextInput
          style={styles.input1}
          placeholder="Descrição do produto"
          value={descricaoProduto}
          onChangeText={(text) => {
            setDescricaoProduto(text);
            if (text.trim() === '') {
            // Se o texto estiver vazio, limpar a lista de produtos
              setProdutosEncontrados([]);
            } else {
              buscarProdutos(text); // Chama a função ao digitar
            }
          }}
        />


      <View style={styles.contentContainer}>  
        <ScrollView 
          style={styles.scrollView}>
          {produtosEncontrados.length > 0 && (
            produtosEncontrados.map((produto) => (
              <Text key={produto.id}>{produto.nome_produto}</Text>
            ))
          )}
        </ScrollView>
  
        <TextInput
          style={styles.input2}
          placeholder="Estoque de segurança"
          keyboardType="numeric"
          value={estoqueSeguranca}
          onChangeText={(text) => setEstoqueSeguranca(text)}
        />

        <TextInput
          style={styles.input2}
          placeholder="Estoque mínimo"
          keyboardType="numeric"
          value={estoqueMinimo}
          onChangeText={(text) => setEstoqueMinimo(text)}
        />

        {/* Botões de opção tipo rádio para selecionar o tipo de produto */}
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[styles.radioButton, bebidaSelected ? styles.radioButtonSelected : null]}
            onPress={() => {
              console.log('Botão Bebida pressionado');
              setTipoProduto('Bebida');
              setBebidaSelected(true);
              setComidaSelected(false);
            }}  
          >
            <Text style={[styles.radioText, bebidaSelected ? styles.selectedText : null]}>Bebida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioButton, comidaSelected ? styles.radioButtonSelected : null]}
            onPress={() => {
              console.log('Botão Comida pressionado');
              setTipoProduto('Comida')
              setComidaSelected(true);
              setBebidaSelected(false);
              }}
          >
            <Text style={[styles.radioText, comidaSelected ? styles.selectedText : null]}>Comida</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={salvarProduto}>
          <Text style={styles.buttonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilização
// -----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: '70%',
  },
  input1: {
    width: '70%',
    marginBottom: 10,
    marginTop: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input2: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  scrollView: {
    maxHeight: 150, // Altura máxima da ScrollView
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
  },
  radioButton: {
    width: '45%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  radioButtonSelected: {
    backgroundColor: '#3498db',
  },
  radioText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff', // Cor branca para texto selecionado
  },
  button: {
    width: '100%',
    marginTop: 20,
    marginBottom: 50,
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
});