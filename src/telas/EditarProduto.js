import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/editarProdutoStyles';

export default function EditarProduto({ route, navigation }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [estoqueProduto, setEstoqueProduto] = useState('0'); // Default 0
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [quantidadeNovaAtualizacao, setQuantidadeNovaAtualizacao] = useState('');
  const [quantidadeUltimaAtualizacao, setQuantidadeUltimaAtualizacao] = useState('Não houve'); // Default "Não houve"
  const [dataAtualizacaoEstoque, setDataAtualizacaoEstoque] = useState('');
  const [dataAtualizacaoEstoqueExibida, setDataAtualizacaoEstoqueExibida] = useState('Não houve'); // Default "Não houve"
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [operacaoSucesso, setOperacaoSucesso] = useState(false);

  useEffect(() => {
    if (route.params && route.params.produto) {
      carregaInformacoesProduto();
      carregaQuantidadeUltimaOperacao();
    }
  }, [route.params]);

  const carregaInformacoesProduto = () => {
    db.transaction((transaction) => {
      transaction.executeSql(
        'SELECT nome_produto, tipo_produto, estoque_minimo FROM produtos WHERE id_produto = ?',
        [route.params.produto.id_produto],
        (_, { rows }) => {
          if (rows.length > 0) {
            const produto = rows.item(0);
            setNomeProduto(produto.nome_produto);
            setTipoProduto(produto.tipo_produto);
            setEstoqueMinimo(String(produto.estoque_minimo));
          } else {
            setModalMessage('Nenhum produto encontrado com o id especificado.');
            setModalVisible(true);
          }
        },
        (_, error) => {
          setModalMessage('Erro ao carregar informações do produto:', error);
          setModalVisible(true);
        }
      );
    });
  };

  const carregaQuantidadeUltimaOperacao = () => {
    db.transaction(transaction => {
      transaction.executeSql(
        'SELECT quantidade, data_atualizacao, estoque_atual FROM entrada_saida WHERE id_produto = ? ORDER BY data_atualizacao DESC LIMIT 1',
        [route.params.produto.id_produto],
        (_, { rows }) => {
          if (rows.length > 0) {
            const operacao = rows.item(0);
            setQuantidadeUltimaAtualizacao(String(operacao.quantidade));
            setEstoqueProduto(String(operacao.estoque_atual));
            
            const dataAtualizacao = operacao.data_atualizacao;
            const dataFormatada = formataDataParaDDMMYYYYHHMMSS(dataAtualizacao);
            setDataAtualizacaoEstoque(dataAtualizacao);
            setDataAtualizacaoEstoqueExibida(dataFormatada);
          } else {
            // Definindo valores padrão quando não há resultados
            setQuantidadeUltimaAtualizacao('Não houve');
            setEstoqueProduto('0');
            setDataAtualizacaoEstoqueExibida('Não houve');
          }
        },
        (_, error) => {
          setModalMessage('Erro ao carregar quantidade da última operação:', error);
          setModalVisible(true);
        }
      );
    });
  };

  const formataDataParaDDMMYYYYHHMMSS = (dataString) => {
    if (!dataString) return "Não houve";

    const [datePart, timePart] = dataString.split(' ');
    
    if (!datePart || !timePart) {
        console.log(`Invalid date: ${dataString}`);
        return dataString;
    }

    const [year, month, day] = datePart.split('/').map(part => parseInt(part));
    const [hours, minutes, seconds] = timePart.split(':').map(part => parseInt(part));

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        console.log(`Invalid date: ${dataString}`);
        return dataString;
    }

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
    const formattedYear = year;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    console.log(`day: ${formattedDay}, month: ${formattedMonth}, year: ${formattedYear}, hours: ${formattedHours}, minutes: ${formattedMinutes}, seconds: ${formattedSeconds}`);
    
    return `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const salvarAlteracoes = () => {
    const nomeProdutoUpperCase = nomeProduto.toUpperCase();
    let tipoProdutoFormatado = capitalizeFirstLetter(tipoProduto);

    db.transaction((transaction) => {
      transaction.executeSql(
        `UPDATE produtos 
        SET nome_produto = ?, 
            tipo_produto = ?, 
            estoque_minimo = ? 
        WHERE id_produto = ?;`,
        [nomeProdutoUpperCase, tipoProdutoFormatado, parseInt(estoqueMinimo), route.params.produto.id_produto],
        (_, result) => {
          let quantidade;
          let diferenca = 0;
          if (quantidadeNovaAtualizacao.trim() !== '') {
            const quantidadeAntiga = parseFloat(quantidadeUltimaAtualizacao);
            const novaQuantidade = parseInt(quantidadeNovaAtualizacao);
            diferenca = novaQuantidade - quantidadeAntiga;
            quantidade = novaQuantidade;
          } else {
            quantidade = parseInt(quantidadeUltimaAtualizacao);
          }

          transaction.executeSql(
            `UPDATE entrada_saida
            SET quantidade = ?,
                estoque_atual = estoque_atual + ?
            WHERE id_produto = ? AND data_atualizacao = ?;`,
            [quantidade, diferenca, route.params.produto.id_produto, dataAtualizacaoEstoque],
            (_, result) => {
              transaction.executeSql(
                `UPDATE estoque
                SET estoque_atual = estoque_atual + ?
                WHERE id_produto = ?;`,
                [diferenca, route.params.produto.id_produto],
                (_, result) => {
                  setModalMessage('Transação concluída com sucesso.');
                  setOperacaoSucesso(true);
                  setModalVisible(true);
                },
                (_, error) => {
                  setModalMessage('Erro na atualização do estoque', error);
                  setModalVisible(true);
                }
              );
            },
            (_, error) => {
              setModalMessage('Erro na atualização da entrada_saida', error);
              setModalVisible(true);
            }
          );
        },
        (_, error) => {
          setModalMessage('Erro na atualização de produtos', error);
          setModalVisible(true);
        }
      );
    }, 
    (error) => {
      setModalMessage('Erro na transação geral', error);
      setModalVisible(true);
    });
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID do Produto:</Text>
          <Text style={styles.text}>{route.params.produto.id_produto}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Estoque Atual:</Text>
          <Text style={styles.text}>{estoqueProduto}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Quantidade da Última Atualização:</Text>
          <Text style={styles.text}>{quantidadeUltimaAtualizacao}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Última Atualização:</Text>
          <Text style={styles.text}>{dataAtualizacaoEstoqueExibida}</Text>
        </View>
      </View>

      <Text style={styles.label}>Nome do Produto:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setNomeProduto}
        value={nomeProduto}
      />

      <Text style={styles.label}>Tipo do Produto:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTipoProduto}
        value={tipoProduto}
      />

      <Text style={styles.label}>Estoque Mínimo:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEstoqueMinimo}
        value={estoqueMinimo}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantidade da Nova Atualização:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setQuantidadeNovaAtualizacao}
        value={quantidadeNovaAtualizacao}
        keyboardType="numeric"
        editable={quantidadeUltimaAtualizacao !== 'Não houve'} // Disable if there's no previous update
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <CustomModal />
    </View>
  );
}
