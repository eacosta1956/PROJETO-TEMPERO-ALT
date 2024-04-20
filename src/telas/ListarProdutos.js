import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../database/AbreConexao';


// Função principal
// ----------------
export default function ListarProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [itemSelecionado, setSelectedItem] = useState(null);
  const [filtroSelecionado, setFiltroSelecionado] = useState('Todos');
  const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState('Nome');
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalBebidas, setTotalBebidas] = useState(0);
  const [totalComidas, setTotalComidas] = useState(0);
  const [totalEstoqueSeguranca, setTotalEstoqueSeguranca] = useState(0);
  const [totalEstoqueMinimo, setTotalEstoqueMinimo] = useState(0);
  
  // Atualiza a tela quando esta for carregada ou um botão (ordenacao selecionada) 
  // ou um filtro (opção selecionada)
  // -----------------------------------------------------------------------------
  useEffect(() => {
    carregarProdutos(); // Carrega os produtos ao carregar a tela ListarProdutos e ao mudar a opção selecionada
  }, [filtroSelecionado, ordenacaoSelecionada]);

  // Recarrega os produtos sempre que a tela ListarProdutos for focada novamente
  // ---------------------------------------------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      carregarTotais();
      setFiltroSelecionado('Todos');
      setOrdenacaoSelecionada('Nome')
      carregarProdutos();
    }, [])
  );
  // Essa é uma função responsável por contar a qtde total de produtos cadastrados,
  // a qtde de produtos do tipo comida, a qtde de produtos do tipo bebida,
  // a qtde de produtos cujo estoque esteja <= estoque de segurança e
  // a qtde de produtos cujo estqoque esteja <= estoque mínimo.
  // -----------------------------------------------------------------------------
  const carregarTotais = () => {

    // Conta a quantidade de produtos cadastrados
    // ------------------------------------------
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
      
      // Conta a quantidade de bebidas cadastradas
      // -----------------------------------------
      transaction.executeSql(
        `SELECT COUNT(*) AS total FROM produtos WHERE tipo_produto = 'Bebida'`,
        [],
        (_, { rows }) => {
          const totalBebidas = rows._array[0].total;
          setTotalBebidas(totalBebidas);
        },
        (_, error) => {
          console.log('Erro ao carregar total de bebidas: ' + error);
        }
      );
  
      // Conta a quantidade de comidas cadastradas
      // -----------------------------------------
      transaction.executeSql(
        `SELECT COUNT(*) AS total FROM produtos WHERE tipo_produto = 'Comida'`,
        [],
        (_, { rows }) => {
          const totalComidas = rows._array[0].total;
          setTotalComidas(totalComidas);
        },
        (_, error) => {
          console.log('Erro ao carregar total de comidas: ' + error);
        }
      );
  
      // Conta a quantidade de produtos cujo estoque atingiu o nível de estoque de segurança
      // -----------------------------------------------------------------------------------
      transaction.executeSql(
        `SELECT COUNT(*) AS total FROM produtos 
        INNER JOIN estoque ON produtos.id_produto = estoque.id_produto 
        WHERE estoque.estoque_atual <= produtos.estoque_seguranca`,
        [],
        (_, { rows }) => {
          const totalEstoqueSeguranca = rows._array[0].total;
          setTotalEstoqueSeguranca(totalEstoqueSeguranca);
        },
        (_, error) => {
          console.log('Erro ao carregar total de produtos com estoque de segurança: ' + error);
        }
      );
  
      // Conta a quantidade de produtos cujo estoque atingiu o nível de estoque mínimo
      // ----------------------------------------------------------------------------- 
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

  // Carrega os produtos na tela conforme o filtro e o botão de ordenação
  // selecionado no alto da tela
  // --------------------------------------------------------------------
  const carregarProdutos = () => {
    db.transaction((transaction) => {
      let query = `SELECT p.id_produto, p.nome_produto, p.estoque_seguranca, p.estoque_minimo, e.estoque_atual 
      FROM produtos AS p 
      LEFT JOIN estoque AS e ON p.id_produto = e.id_produto`;
  
      // Aplica filtro conforme a opção selecionada
      // ------------------------------------------
      if (filtroSelecionado === 'Bebida') {
        query += ' WHERE p.tipo_produto = "Bebida"';
      } else if (filtroSelecionado === 'Comida') {
        query += ' WHERE p.tipo_produto = "Comida"';
      } else if (filtroSelecionado === 'EstoqueSeguranca') {
        query += ' WHERE e.estoque_atual <= p.estoque_seguranca';
      } else if (filtroSelecionado === 'EstoqueMinimo') {
        query += ' WHERE e.estoque_atual <= p.estoque_minimo';
      }

      // Aplica ordenação conforme a opção selecionada
      // ---------------------------------------------
      if (ordenacaoSelecionada === 'ID') {
        query += ' ORDER BY p.id_produto';
      } else if (ordenacaoSelecionada === 'Nome') {
        query += ' ORDER BY p.nome_produto';
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

    // Seleciona e retira a seleção de um produto ao tocá-lo na tela
  // ---------------------------------------------------------------
  const handleSelecionarProduto = (produto) => {
    if (produto.id_produto === itemSelecionado) {
      setSelectedItem(null); // Desselecionar o produto ao pressioná-lo novamente
      setProdutoSelecionado(null); // Limpar produto selecionado ao desmarcar
    } else {
      setSelectedItem(produto.id_produto); // Selecionar o produto ao pressioná-lo
      setProdutoSelecionado(produto); // Atualizar produto selecionado
    }
      
    // Reseta a seleção dos botões ao retirar a seleção do item
    // --------------------------------------------------------
    if (itemSelecionado === produto.id_produto) {
      setFiltroSelecionado('Todos');
    }
  };

  // Recarrega a lista de produtos após a atualização do estoque
  // ----------------------------------------------------------- 
  /* const atualizarProdutosLista = () => {
    carregarProdutos();
  }; */

  // Acionada quando o botão Atualizar Estoque é selecionado
  // Carrega a tela AtualizarEstoque se um produto estiver selecionado
  // -----------------------------------------------------------------
  const handleAtualizarEstoque = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('AtualizarEstoque', { produto: produtoSelecionado });
      setSelectedItem(null);
      // atualizarProdutosLista();
    }
  };

  // Acionada quando o botão Editar Registro é selecionado
  // Carrega a tela EditarProduto se um produto estiver selecionado
  // --------------------------------------------------------------
  const handleEditarProduto = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('EditarProduto', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };
  
  // Acionada quando o botão Excluir Registro é selecionado
  // Carrega a tela ExcluirrProduto se um produto estiver selecionado
  // ----------------------------------------------------------------
  const handleExcluirProduto = () => {
    if (produtoSelecionado && itemSelecionado) {
      navigation.navigate('ExcluirProduto', { produto: produtoSelecionado });
      setSelectedItem(null);
    }
  };

  // Acionada quando um dos filtros (Todos, Bebida ou Comida) é selecionado
  // ----------------------------------------------------------------------
  const handleOpcaoSelecionada = (opcao) => {
    setFiltroSelecionado(opcao);
    carregarProdutos();
  };

  // Acionada quando um dos botões (Ordenar por ID ou Ordenar por Nome) é selecionado
  // --------------------------------------------------------------------------------
  const handleOrdenarPor = (opcao) => {
    setOrdenacaoSelecionada(opcao);
    carregarProdutos();
  };

// Acionada quando o filtro Estoque Seguranca é selecionado
  // --------------------------------------------------------
  const handleEstoqueSeguranca = () => {
    setFiltroSelecionado('EstoqueSeguranca');
  };

  // Acionada quando o filtro Estoque Mínimo é selecionado
  // -----------------------------------------------------
  const handleEstoqueMinimo = () => {
    setFiltroSelecionado('EstoqueMinimo');
  };







  // Responsável pela renderização dos itens na tela
  // -----------------------------------------------
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => {
        handleSelecionarProduto(item);
      }}
      style={[styles.item, { backgroundColor: item.id_produto === itemSelecionado ? '#aaa' : '#f9c2ff' }]}
    >
      <View style={styles.item_Nome}>
          <Text style={styles.nomeProduto1}>Nome:</Text>
          <Text style={styles.nomeProduto2}>   {item.nome_produto}</Text>
      </View>
      <View style={styles.item_ID}>        
          <Text style={styles.ID1}>ID:</Text>
          <Text style={styles.ID2}>   {item.id_produto}</Text>
      </View>
      <View style={styles.item_estAtual}>
          <Text style={styles.estoqueText2}>Estoque Atual:</Text>
          <Text style={styles.estoqueText3}>   {item.estoque_atual}</Text>
        </View>
        <View style={styles.item_estSeguranca}>
          <Text style={styles.estoqueText2}>Estoque Segurança:</Text>
          <Text style={styles.estoqueText3}>   {item.estoque_seguranca}</Text>
        </View>
        <View style={styles.item_estMinimo}>
          <Text style={styles.estoqueText2}>Estoque Mínimo:</Text>
          <Text style={styles.estoqueText3}>   {item.estoque_minimo}</Text>
        </View>
      
    </TouchableOpacity>
  );

  // Retorno da função principal (ListarProdutosScreen)
  // --------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.opcoesContainer3}>
      <TouchableOpacity
        style={[
          styles.opcaoButton,
          ordenacaoSelecionada === 'ID' ? styles.filtroSelecionado : null
        ]}
        onPress={() => handleOrdenarPor('ID')}
      >
        <Text style={[styles.opcaoText, ordenacaoSelecionada === 'ID' ? styles.opcaoSelecionadaText : null]}>Ordenar por ID
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.opcaoButton,
          ordenacaoSelecionada === 'Nome' ? styles.filtroSelecionado : null
        ]}
        onPress={() => handleOrdenarPor('Nome')}
      >
        <Text style={[styles.opcaoText, ordenacaoSelecionada === 'Nome' ? styles.opcaoSelecionadaText : null]}>Ordenar por Nome
        </Text>
      </TouchableOpacity>
    </View>
      <View style={styles.opcoesContainer1}>
        <TouchableOpacity
          style={[styles.opcaoButton, filtroSelecionado === 'Todos' ? styles.filtroSelecionado : null]}
          onPress={() => handleOpcaoSelecionada('Todos')}
        >
          <Text style={[styles.opcaoText, filtroSelecionado === 'Todos' ? styles.opcaoSelecionadaText : null]}>Todos ({totalProdutos})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcaoButton, filtroSelecionado === 'Bebida' ? styles.filtroSelecionado : null]}
          onPress={() => handleOpcaoSelecionada('Bebida')}
        >
          <Text style={[styles.opcaoText, filtroSelecionado === 'Bebida' ? styles.opcaoSelecionadaText : null]}>Bebida ({totalBebidas})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.opcaoButton, filtroSelecionado === 'Comida' ? styles.filtroSelecionado : null]}
          onPress={() => handleOpcaoSelecionada('Comida')}
        >
          <Text style={[styles.opcaoText, filtroSelecionado === 'Comida' ? styles.opcaoSelecionadaText : null]}>Comida ({totalComidas})
          </Text>
        </TouchableOpacity>
        </View>

        <View style={styles.opcoesContainer2}>
        <TouchableOpacity
          style={[styles.opcaoButton, filtroSelecionado === 'EstoqueSeguranca' ? styles.filtroSelecionado : null]}
          onPress={handleEstoqueSeguranca}
        >
          <Text style={[styles.opcaoText, filtroSelecionado === 'EstoqueSeguranca' ? styles.opcaoSelecionadaText : null]}>Estoque Segurança ({totalEstoqueSeguranca})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.opcaoButton, filtroSelecionado === 'EstoqueMinimo' ? styles.filtroSelecionado : null]}
          onPress={handleEstoqueMinimo}
        >
          <Text style={[styles.opcaoText, filtroSelecionado === 'EstoqueMinimo' ? styles.opcaoSelecionadaText : null]}>Estoque Mínimo ({totalEstoqueMinimo})
          </Text>
        </TouchableOpacity>
      </View>

      


      {/* É utilizada uma FlatList para listar os produtos */}
      {/* ------------------------------------------------ */}
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={(item) => `produto_${item.id_produto.toString()}`}
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


// Estilização
// -----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 2,
  },
  filtroSelecionado: {
    backgroundColor: '#3498db',
  },
  opcaoSelecionadaText: {
    color: '#fff', // Altera a cor do texto para branco
  },
  opcaoText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  opcaoButton: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 1,
    marginVertical: 2,
    marginHorizontal: 2,
    borderRadius: 5,
  },
  opcoesContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  opcoesContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
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
  itemNome: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemID: {
    flexDirection: 'row',
  },
  infoContainer: {
    justifyContent: 'space-between',
  },
  nomeProduto1: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  nomeProduto2: {
    fontSize: 14,
    marginBottom: 1,
  },
  ID1: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ID2: {
    fontSize: 14,
  },
  estoqueText1: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  estoqueText2: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  estoqueText3: {
    fontSize: 14,
  },
  item_Nome: {
    flexDirection: 'row',
  },
  item_ID: {
    flexDirection: 'row',
  },

  item_estAtual: {
    flexDirection: 'row',
  },
  item_estSeguranca: {
    flexDirection: 'row',
  },
  item_estMinimo: {
    flexDirection: 'row',
  },
  opcoesContainer3: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
});