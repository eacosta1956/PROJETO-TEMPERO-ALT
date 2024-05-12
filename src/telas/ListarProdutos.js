import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../database/AbreConexao';
import styles from '../styles/listarProdutosStyles';


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
        <TouchableOpacity style={styles.buttonAtualizar} onPress={handleAtualizarEstoque}>
          <Text style={styles.buttonText}>Atualizar Estoque</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonEditar} onPress={handleEditarProduto}>
          <Text style={styles.buttonText}>Editar Registro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonExcluir} onPress={handleExcluirProduto}>
          <Text style={styles.buttonText}>Excluir Registro</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

