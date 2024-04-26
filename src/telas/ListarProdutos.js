import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../database/AbreConexao';

export default function ListarProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [itemSelecionado, setSelectedItem] = useState(null);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalEstoqueMinimo, setTotalEstoqueMinimo] = useState(0);
  const [filtroNomeProduto, setFiltroNomeProduto] = useState('');
  const [filtroEstoqueMinimo, setFiltroEstoqueMinimo] = useState(false);
  //const [filtroAtivo, setFiltroAtivo] = useState(false); // Novo state para controle do filtro

  useEffect(() => {
    carregarProdutos();
  }, [filtroEstoqueMinimo, filtroNomeProduto]);

  useFocusEffect(
    React.useCallback(() => {
      carregarTotais();
      setFiltroEstoqueMinimo(false);
      setFiltroNomeProduto('');
      carregarProdutos();
    }, [])
  );

  const carregarTotais = () => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT COUNT(*) AS total FROM produtos`,
        [],
        (_, { rows }) => {
          const totalProdutos = rows._array[0].total;
          setTotalProdutos(totalProdutos);
        },
        (_, error) => {
          console.log('Erro ao carregar total de produtos: ' + error);
        }
      );

      transaction.executeSql(
        `SELECT COUNT(*) AS total FROM produtos 
        INNER JOIN estoque ON produtos.id_produto = estoque.id_produto 
        WHERE estoque.estoque_atual <= produtos.estoque_minimo`,
        [],
        (_, { rows }) => {
          const totalEstoqueMinimo = rows._array[0].total;
          setTotalEstoqueMinimo(totalEstoqueMinimo);
        },
        (_, error) => {
          console.log('Erro ao carregar total de produtos com estoque mínimo: ' + error);
        }
      );
    });
  };

  const carregarProdutos = () => {
    db.transaction((transaction) => {
      let query = `SELECT p.id_produto, p.nome_produto, p.estoque_minimo, e.estoque_atual 
        FROM produtos AS p 
        LEFT JOIN estoque AS e ON p.id_produto = e.id_produto`;
  
      if (filtroEstoqueMinimo) {
        query += ' WHERE e.estoque_atual <= p.estoque_minimo';
      }
  
      if (filtroNomeProduto.trim() !== '') {
        const searchTerm = filtroNomeProduto.trim().toLowerCase(); // Remover espaços em branco e tornar minúsculas
        query += ` WHERE LOWER(p.nome_produto) LIKE '%${searchTerm}%'`;
      }
  
      query += ' ORDER BY p.nome_produto';
  
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
  
  const handleSelecionarProduto = (produto) => {
    if (produto.id_produto === itemSelecionado) {
      setSelectedItem(null);
      setProdutoSelecionado(null);
    } else {
      setSelectedItem(produto.id_produto);
      setProdutoSelecionado(produto);
    }
  };

  const handleAtualizarEstoque = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('AtualizarEstoque', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };

  const handleEditarProduto = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('EditarProduto', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };

  const handleExcluirProduto = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('ExcluirProduto', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };

  const handleEstoqueMinimo = () => {
    setFiltroEstoqueMinimo(!filtroEstoqueMinimo);
  };

  const handleLimparFiltro = () => {
    setFiltroNomeProduto('');
    setFiltroEstoqueMinimo(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleSelecionarProduto(item)}
      style={[styles.item, { backgroundColor: item.id_produto === itemSelecionado ? '#aaa' : '#f9c2ff' }]}
    >
      <Text style={styles.nomeProduto}>Nome: {item.nome_produto}</Text>
      <Text>ID: {item.id_produto}</Text>
      <Text>Estoque Atual: {item.estoque_atual}</Text>
      <Text>Estoque Mínimo: {item.estoque_minimo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.opcaoButton, filtroEstoqueMinimo ? styles.filtroSelecionado : null]}
        onPress={handleEstoqueMinimo}
      >
        <Text style={[styles.opcaoText, filtroEstoqueMinimo ? styles.opcaoSelecionadaText : null]}>
          Estoque Mínimo ({totalEstoqueMinimo})
        </Text>
      </TouchableOpacity>
      <View style={styles.opcoesContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Digite o nome do produto"
          value={filtroNomeProduto}
          onChangeText={(text) => setFiltroNomeProduto(text)}
        />
        <TouchableOpacity
          style={styles.limparButton}
          onPress={handleLimparFiltro}
        >
          <Text style={styles.limparButtonText}>Limpar</Text>
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  opcoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  opcaoButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    height: 40,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  opcaoText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 18,
  },
  opcaoSelecionadaText: {
    color: '#fff',
  },
  inputText: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  filtrarButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filtrarButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  filtroSelecionado: {
    backgroundColor: '#3498db',
  },
  filtroSelecionadoText: {
    color: '#fff',
  },
  limparButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    borderWidth: 1,
  },
  limparButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  nomeProduto: {
    fontWeight: 'bold',
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
    fontSize: 14,
  },

});
