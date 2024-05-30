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
  const [filtroTipoProduto, setFiltroTipoProduto] = useState('');
  const [filtroEstoqueMinimo, setFiltroEstoqueMinimo] = useState(false);

  // Carrega produtos ao iniciar o componente ou quando os filtros são alterados
  // ---------------------------------------------------------------------------
  useEffect(() => {
    carregarProdutos();
  }, [filtroEstoqueMinimo, filtroNomeProduto, filtroTipoProduto] );

  // Carregar totais ao focar na tela
  // --------------------------------
  useFocusEffect(
    React.useCallback(() => {
      carregarTotais();
      setFiltroEstoqueMinimo(false);
      setFiltroNomeProduto('');
      setFiltroTipoProduto('');
      carregarProdutos();
    }, [])
  );

  // Função para carregar o total de produtos e o total de produtos com estoque mínimo
  // ---------------------------------------------------------------------------------
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

  // Função para carregar a lista de produtos na tela com base nos filtros
  // ---------------------------------------------------------------------
  const carregarProdutos = () => {
    db.transaction((transaction) => {
      let query = `SELECT p.id_produto, p.nome_produto, p.estoque_minimo, e.estoque_atual, p.tipo_produto 
        FROM produtos AS p 
        LEFT JOIN estoque AS e ON p.id_produto = e.id_produto`;
  
      if (filtroEstoqueMinimo) {
        query += ' WHERE e.estoque_atual <= p.estoque_minimo';
      }
  
      if (filtroNomeProduto.trim() !== '') {
        const searchTerm = filtroNomeProduto.trim().toLowerCase();
        query += ` WHERE LOWER(p.nome_produto) LIKE '%${searchTerm}%'`;
      } else if (filtroTipoProduto.trim() !== '') {
        const searchTerm = filtroTipoProduto.trim().toLowerCase();
        query += ` WHERE LOWER(p.tipo_produto) LIKE '%${searchTerm}%'`;
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
  
  // Função para selecionar um produto listado na tela
  // -------------------------------------------------
  const selecionarProduto = (produto) => {
    if (produto.id_produto === itemSelecionado) {
      setSelectedItem(null);
      setProdutoSelecionado(null);
    } else {
      setSelectedItem(produto.id_produto);
      setProdutoSelecionado(produto);
    }
  };

  // Função para navegar para a tela de atualizar estoque
  // ----------------------------------------------------
  const atualizarEstoque = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('AtualizarEstoque', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };

  // Função para navegar para a tela de editar produto
  // -------------------------------------------------
  const editarProduto = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('EditarProduto', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };

  // Função para navegar para a tela de excluir produto
  // --------------------------------------------------
  const excluirProduto = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('ExcluirProduto', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };

  // Função para alternar o filtro de estoque mínimo
  // -----------------------------------------------
  const estoqueMinimo = () => {
    setFiltroEstoqueMinimo(!filtroEstoqueMinimo);
  };

  // Função para limpar o filtro de nome do produto
  // ----------------------------------------------
  const limparFiltroNomeProduto = () => {
    setFiltroNomeProduto('');
    setFiltroEstoqueMinimo(false);
  };

  // Função para limpar o filtro de tipo do produto
  // ----------------------------------------------
  const limparFiltroTipoProduto = () => {
    setFiltroTipoProduto('');
    setFiltroEstoqueMinimo(false);
  };

  // Renderiza cada item da lista de produtos
  // ----------------------------------------
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => selecionarProduto(item)}
      style={[styles.item, item.id_produto === itemSelecionado ? styles.itemSelecionado : null]}
    >
         
      <Text style={styles.nomeProduto}>Nome: {item.nome_produto}</Text>
      <Text>Tipo: {item.tipo_produto}</Text>
      <Text>Estoque Atual: {item.estoque_atual}</Text>
      <Text>Estoque Mínimo: {item.estoque_minimo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Botão para filtrar por estoque mínimo */}
      <TouchableOpacity
        style={[styles.opcaoButtonEstMin, filtroEstoqueMinimo ? styles.filtroSelecionado : null]}
        onPress={estoqueMinimo}
      >
        <Text style={[styles.opcaoTextEstMin, filtroEstoqueMinimo ? styles.opcaoSelecionadaText : null]}>
          Estoque Mínimo ({totalEstoqueMinimo})
        </Text>
      </TouchableOpacity>

      {/* Filtro por nome do produto */}
      <View style={styles.opcoesContainerNomeProduto}>
        <TextInput
          style={styles.inputText}
          placeholder="Filtre pelo nome do produto"
          value={filtroNomeProduto}
          onChangeText={(text) => setFiltroNomeProduto(text)}
        />

        {/* Botão para limpar o filtro */}
        <TouchableOpacity
          style={styles.limparButton}
          onPress={limparFiltroNomeProduto}
        >
          <Text style={styles.limparButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro por tipo do produto */}
      <View style={styles.opcoesContainerTipoProduto}>
        <TextInput
          style={styles.inputText}
          placeholder="Filtre pelo tipo do produto"
          value={filtroTipoProduto}
          onChangeText={(text) => setFiltroTipoProduto(text)}
        />

        {/* Botão para limpar o filtro */}
        <TouchableOpacity
          style={styles.limparButton}
          onPress={limparFiltroTipoProduto}
        >
          <Text style={styles.limparButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_produto.toString()}
      />

      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        
        {/* Botão para atualizar estoque */}
        <TouchableOpacity style={styles.buttonAtualizar} onPress={atualizarEstoque}>
          <Text style={styles.buttonText}>Atualizar Estoque</Text>
        </TouchableOpacity>

        {/* Botão para editar produto */}
        <TouchableOpacity style={styles.buttonEditar} onPress={editarProduto}>
          <Text style={styles.buttonText}>  Editar Registro</Text>
        </TouchableOpacity>

        {/* Botão para excluir produto */}
        <TouchableOpacity style={styles.buttonExcluir} onPress={excluirProduto}>
          <Text style={styles.buttonText}> Excluir Registro</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

