import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Importe o hook useFocusEffect
import { db } from '../database/SQLite';

export default function ListarProdutosScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('Todos');

  useEffect(() => {
    carregarProdutos();
  }, [opcaoSelecionada]);

  // Recarregar os produtos sempre que a tela for focada novamente
  useFocusEffect(
    React.useCallback(() => {
      carregarProdutos();
      setOpcaoSelecionada('Todos');
    }, [])
  );

    // Recarregar a tela ListarProdutosScreen quando a tela for focada novamente
  useFocusEffect(
    React.useCallback(() => {
      setProdutoSelecionado(null); // Limpar o produto ao voltar para a tela
    }, [])
  );

  const carregarProdutos = () => {
    db.transaction((transaction) => {
      let query = `SELECT p.id_produto, p.nome_produto, p.estoque_seguranca, p.estoque_minimo, e.estoque_atual 
      FROM produtos AS p 
      LEFT JOIN estoque_atual AS e ON p.id_produto = e.id_produto`;

    // Aplicar filtro conforme a opção selecionada
    if (opcaoSelecionada === 'Bebida') {
      query += ' WHERE p.tipo_produto = "Bebida"';
    } else if (opcaoSelecionada === 'Comida') {
      query += ' WHERE p.tipo_produto = "Comida"';
    }

      transaction.executeSql(
        query,
        [],
        (_, { rows }) => {
          const produtosList = rows._array;
          setProdutos(produtosList);
        },
        (_, error) => {
          console.log('Erro ao listar produtos: ' + error);
        }
      );
    });
  };

  const handleFiltrarProdutos = (tipo) => {
    setTipoFiltro(tipo);
  };

  const handleSelecionarProduto = (produto) => {
    if (produto.id_produto === selectedItem) {
      setSelectedItem(null); // Volta ao padrão
    } else {
      setSelectedItem(produto.id_produto);
    }
    setProdutoSelecionado(produto);
  };

  const handleAtualizarEstoque = () => {
    if (produtoSelecionado) {
      navigation.navigate('AtualizarEstoque', { produto: produtoSelecionado });
    }
  };

  const handleEditarProduto = () => {
    if (produtoSelecionado) {
      navigation.navigate('EditarProduto', { produto: produtoSelecionado });
    }
  };

  const handleExcluirProduto = () => {
    if (produtoSelecionado) {
      navigation.navigate('ExcluirProduto', { produto: produtoSelecionado });
    }
  };

  const handleOpcaoSelecionada = (opcao) => {
    setOpcaoSelecionada(opcao);
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => {
        handleSelecionarProduto(item);
      }}
      style={[styles.item, { backgroundColor: item.id_produto === selectedItem ? 'green' : '#f9c2ff' }]}
    >
      <View style={styles.item}>
        <Text>Nome: {item.nome_produto}</Text>
        <Text>Id do produto: {item.id_produto}</Text>
        <Text>Estoque Atual: {item.estoque_atual}</Text>
        <Text>Estoque Segurança: {item.estoque_seguranca}</Text>
        <Text>Estoque Mínimo: {item.estoque_minimo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.opcoesContainer}>
        <TouchableOpacity
          style={[styles.opcaoButton, opcaoSelecionada === 'Todos' ? styles.opcaoSelecionada : null]}
          onPress={() => handleOpcaoSelecionada('Todos')}
        >
          <Text style={[styles.opcaoText, opcaoSelecionada === 'Todos' ? styles.opcaoSelecionadaText : null]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcaoButton, opcaoSelecionada === 'Bebida' ? styles.opcaoSelecionada : null]}
          onPress={() => handleOpcaoSelecionada('Bebida')}
        >
          <Text style={[styles.opcaoText, opcaoSelecionada === 'Bebida' ? styles.opcaoSelecionadaText : null]}>Bebida</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcaoButton, opcaoSelecionada === 'Comida' ? styles.opcaoSelecionada : null]}
          onPress={() => handleOpcaoSelecionada('Comida')}
        >
          <Text style={[styles.opcaoText, opcaoSelecionada === 'Comida' ? styles.opcaoSelecionadaText : null]}>Comida</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_produto.toString()}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={handleAtualizarEstoque}>
          <Text style={styles.buttonText}>Atualizar Estoque</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={handleEditarProduto}>
          <Text style={styles.buttonText}>Editar Registro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={handleExcluirProduto}>
          <Text style={styles.buttonText}>Excluir Registro</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
  opcaoSelecionada: {
    backgroundColor: '#3498db',
  },
  opcaoSelecionadaText: {
    color: '#fff', // Altera a cor do texto para branco
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 1,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  opcaoText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  opcaoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  opcoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button1: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  button2: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  button3: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});