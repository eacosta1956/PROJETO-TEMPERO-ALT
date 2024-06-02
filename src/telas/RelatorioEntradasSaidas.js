import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../database/AbreConexao'; // Importação do módulo de banco de dados
import styles from '../styles/relatorioEntradasSaidasStyles'; // Importação do arquivo de estilos

export default function RelatorioEntradasSaidas({ route, navigation }) {
    const { dataInicial, dataFinal } = route.params; // Extração dos parâmetros dataInicial e dataFinal do objeto de navegação
    const [relatorio, setRelatorio] = useState([]); // Estado para armazenar o relatório de entradas e saídas
    const [isLoading, setIsLoading] = useState(true); // Estado para rastrear se os dados estão sendo carregados
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal principal
    const [modalErrorVisible, setModalErrorVisible] = useState(false); // Estado para controlar a visibilidade do modal de erro

    // Função para fechar o modal de erro e voltar para a tela anterior
    const fecharModalErro = () => {
        setModalErrorVisible(false); // Oculta o modal de erro
        navigation.goBack(); // Navega de volta para a tela anterior
    };

    // Função para fechar o modal principal e navegar de volta para a tela inicial
    const fecharModal = () => {
        setModalVisible(false); // Oculta o modal principal
        navigation.navigate('Home'); // Navega para a tela inicial
    };

    // Função para gerar o relatório de entradas e saídas
    const gerarRelatorio = () => {
        // Consulta SQL para obter o relatório de entradas e saídas dentro do período especificado
        db.transaction((transaction) => {
            transaction.executeSql(
                `SELECT 
                    e.id_produto, 
                    SUM(CASE WHEN e.quantidade >= 0 THEN e.quantidade ELSE 0 END) AS total_entradas,
                    SUM(CASE WHEN e.quantidade < 0 THEN ABS(e.quantidade) ELSE 0 END) AS total_saidas,
                    p.nome_produto
                 FROM entrada_saida e
                 JOIN produtos p ON e.id_produto = p.id_produto
                 WHERE e.data_atualizacao >= ? || ' 00:00:00' AND e.data_atualizacao <= ? || ' 23:59:59'
                 GROUP BY e.id_produto
                 ORDER BY p.nome_produto ASC;`,
                [dataInicial, dataFinal], // Parâmetros da consulta SQL
                (_, { rows }) => {
                    const relatorioProdutos = rows._array; // Armazena o relatório obtido em um array
                    setRelatorio(relatorioProdutos); // Atualiza o estado do relatório com os dados obtidos
                    setIsLoading(false); // Define o estado de carregamento como falso após obter os dados
                    setModalVisible(true); // Mostra o modal principal
                },
                (_, error) => {
                    console.log('Erro ao gerar relatório:', error); // Registra erros ocorridos durante a geração do relatório
                    setIsLoading(false); // Define o estado de carregamento como falso mesmo em caso de erro
                    setModalErrorVisible(true); // Mostra o modal de erro
                }
            );
        });
    };

    // Efeito useEffect para gerar o relatório ao carregar o componente
    useEffect(() => {
        gerarRelatorio(); // Chama a função para gerar o relatório
    }, []); // Array vazio de dependências indica que o efeito é executado apenas uma vez, após a montagem do componente

    // Função para converter a data de AAAA/MM/DD para DD/MM/AAAA.
    const convertToDDMMYYYY = (dateString) => {
        const [year, month, day] = dateString.split('/');
        return `${day}/${month}/${year}`;
    };

    const dataInicialFormatada = convertToDDMMYYYY(dataInicial);
    const dataFinalFormatada = convertToDDMMYYYY(dataFinal);

    return (
        <View style={styles.container}>
            {/* Modal principal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Relatório de Entradas e Saídas</Text>
                        <Text style={styles.dateText}>Período: {dataInicialFormatada} a {dataFinalFormatada}</Text>
                        
                        {/* Verifica se os dados estão sendo carregados */}
                        {isLoading ? (
                            <Text>Carregando...</Text> // Indicador de carregamento
                        ) : (
                            relatorio.length > 0 ? (
                                <FlatList
                                    data={relatorio} // Dados a serem exibidos na lista
                                    keyExtractor={(item) => item.id_produto.toString()} // Função para extrair chaves únicas dos itens da lista
                                    renderItem={({ item }) => ( // Função para renderizar cada item da lista
                                        <View style={styles.itemContainer}>
                                            <Text style={styles.itemText}>
                                                Produto: <Text style={styles.productName}>{item.nome_produto}</Text>
                                            </Text>
                                            <Text>Entradas: {item.total_entradas}</Text>
                                            <Text>Saídas: {item.total_saidas}</Text>
                                            <Text>Diferença: {item.total_entradas - item.total_saidas}</Text>
                                        </View>
                                    )}
                                />
                            ) : (
                                <Text style={styles.errorMessage}>Não há dados para exibir.</Text> // Mensagem de erro caso não haja dados no relatório
                            )
                        )}
                        
                        {/* Botão para fechar o modal */}
                        <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de erro */}
            <Modal animationType="slide" transparent={true} visible={modalErrorVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Erro</Text>
                        <Text style={styles.errorMessage}>Por favor, insira uma data válida no formato DD/MM/AAAA</Text>
                        
                        {/* Botão para fechar o modal de erro */}
                        <TouchableOpacity style={styles.closeButton} onPress={fecharModalErro}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
