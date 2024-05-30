import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../database/SQLite'; // Importe o banco de dados SQLite

export default function CadastrarProdutoScreen({ navigation }) {
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [estoqueSeguranca, setEstoqueSeguranca] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [bebidaSelected, setBebidaSelected] = useState(false);
  const [comidaSelected, setComidaSelected] = useState(false);


  const salvarProduto = () => {

    console.log('Dados a serem inseridos:');
    console.log('Nome do Produto:', descricaoProduto);
    console.log('Estoque de Segurança:', estoqueSeguranca);
    console.log('Estoque Mínimo:', estoqueMinimo);
    console.log('Tipo de Produto:', tipoProduto);
    console.log('Data Atual:', dataAtual);


    if (!descricaoProduto || !estoqueSeguranca || !estoqueMinimo || !tipoProduto) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    // Obter a data e hora atual no formato desejado (Brasil/São Paulo)
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });



    console.log('Dados a serem inseridos:');
    console.log('Nome do Produto:', descricaoProduto);
    console.log('Estoque de Segurança:', estoqueSeguranca);
    console.log('Estoque Mínimo:', estoqueMinimo);
    console.log('Tipo de Produto:', tipoProduto);
    console.log('Data Atual:', dataAtual);


    // Inserir os dados na tabela produtos
    db.transaction((transaction) => {
      transaction.executeSql(
        `INSERT INTO produtos (nome_produto, estoque_seguranca, estoque_minimo, tipo_produto, data_cadastro) 
        VALUES (?, ?, ?, ?, ?);`,
        [descricaoProduto, parseInt(estoqueSeguranca), parseInt(estoqueMinimo), tipoProduto, dataAtual],
        (_, { insertId }) => {


          console.log('Produto inserido com sucesso! ID:', insertId);


          // Após inserir o produto, insira também na tabela estoque_atual
          transaction.executeSql(
            `INSERT INTO estoque_atual (id_produto, estoque_atual, data) VALUES (?, ?, ?);`,
            [insertId, 0, dataAtual], // Estoque atual inicialmente 0
            () => {
              Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');


              console.log('Estoque atualizado com sucesso!');


              // Limpar os campos após o cadastro
              setDescricaoProduto('');
              setEstoqueSeguranca('');
              setEstoqueMinimo('');
              setTipoProduto('');
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
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descrição do produto"
        value={descricaoProduto}
        onChangeText={(text) => setDescricaoProduto(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Estoque de segurança"
        keyboardType="numeric"
        value={estoqueSeguranca}
        onChangeText={(text) => setEstoqueSeguranca(text)}
      />
      <TextInput
        style={styles.input}
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
          style={[styles.radioButton, tipoProduto === 'Comida' ? styles.radioButtonSelected : null]}
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
  );
}

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
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  radioButton: {
    width: '40%',
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
    width: '80%',
    marginTop: 20,
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