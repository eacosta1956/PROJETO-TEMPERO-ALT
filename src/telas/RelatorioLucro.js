import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../database/AbreConexao'; // Importando o módulo do banco de dados
import styles from '../styles/relatorioLucroStyles'; // Importando os estilos

export default function RelatorioLucro({ route, navigation }) {
    const { dataInicial, dataFinal } = route.params; // Extração dos parâmetros de dataInicial e dataFinal
    const [relatorio, setRelatorio] = useState([]); // Estado para armazenar o relatório de lucro
    const [lucroTotal, setLucroTotal] = useState(0); // Estado para armazenar o lucro total
    const [modalVisible, setModalVisible] = useState(true); // Estado para controlar a visibilidade do modal principal
    const [modalErrorVisible, setModalErrorVisible] = useState(false); // Estado para controlar a visibilidade do modal de erro
    const [isSortedByProfit, setIsSortedByProfit] = useState(false); // Estado para controlar a ordenação do relatório
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento dos dados
    const flatListRef = useRef(null); // Ref para a FlatList

    // Efeito useEffect para buscar o relatório de lucro ao carregar o componente
    useEffect(() => {
        const fetchRelatorioLucro = () => {
            return new Promise((resolve, reject) => {
                db.transaction((transaction) => {
                    transaction.executeSql(
                        `SELECT 
                            p.nome_produto,
                            SUM(e.quantidade * (e.preco_venda - e.preco_compra)) AS lucro_total
                        FROM entrada_saida e
                        JOIN produtos p ON e.id_produto = p.id_produto
                        WHERE e.quantidade >= 0 
                        AND p.tipo_produto = 'Bebida'
                        AND e.data_atualizacao >= ? || ' 00:00:00'  
                        AND e.data_atualizacao <= ? || ' 23:59:59'
                        GROUP BY p.nome_produto
                        ORDER BY p.nome_produto ASC;`,
                        [dataInicial, dataFinal],
                        (_, { rows }) => {
                            const relatorio = rows._array;
                            resolve(relatorio);
                        },
                        (_, error) => {
                            console.log('Erro ao obter relatório de lucro:', error);
                            reject(error);
                        }
                    );
                });
            });
        };

        fetchRelatorioLucro().then(relatorio => {
            const totalLucro = relatorio.reduce((acc, item) => acc + (item.lucro_total || 0), 0);
            setRelatorio(relatorio);
            setLucroTotal(totalLucro);
            setIsLoading(false); // Marca o carregamento como completo
        }).catch(error => {
            console.log('Erro ao obter relatório de lucro:', error);
            setIsLoading(false); // Marca o carregamento como completo mesmo em caso de erro
        });
    }, [dataInicial, dataFinal]); // Dependências do efeito useEffect

    // Função para fechar o modal principal e navegar de volta para a tela inicial
    const fecharModal = () => {
        setModalVisible(false);
        navigation.navigate('Home');
    };

    // Função para fechar o modal de erro e voltar para a tela anterior
    const fecharModalErro = () => {
        setModalErrorVisible(false);
        navigation.goBack();
    };

    // Função para formatar um valor numérico como uma string de moeda
    const formatCurrency = (value) => {
        if (value === null || value === undefined) {
            return 'R$ 0,00';
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Função para ordenar os dados do relatório
    const sortData = () => {
        const sortedData = isSortedByProfit 
            ? [...relatorio].sort((a, b) => a.nome_produto.localeCompare(b.nome_produto)) 
            : [...relatorio].sort((a, b) => b.lucro_total - a.lucro_total); 
        setRelatorio(sortedData);
        setIsSortedByProfit(!isSortedByProfit);
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    };

    // Função para renderizar cada item da lista FlatList
    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                    Produto: <Text style={styles.productName}>{item.nome_produto}</Text>
                </Text>
                <Text>Lucro: {formatCurrency(item.lucro_total)}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            
            {/* Modal principal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Relatório de Lucro com Bebidas</Text>
                        <Text style={styles.dateText}>Período: {dataInicial} a {dataFinal}</Text>

                        {/* Verificação se o relatório está carregando */}
                        {isLoading ? (
                            <Text>Carregando...</Text>
                        ) : (
                            <>
                                {/* Verificação se há dados no relatório */}
                                {relatorio.length === 0 ? (
                                    <Text>Nenhum dado para exibir</Text>
                                ) : (
                                    <FlatList
                                        ref={flatListRef}
                                        data={relatorio}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderItem}
                                        contentContainerStyle={{ paddingBottom: 150 }}
                                    />
                                )}

                                {/* Exibição do total de lucro */}
                                <View style={styles.totalContainer}>
                                    <Text style={styles.totalHeader}>Lucro Total:</Text>
                                    <Text style={styles.totalAmount}>{formatCurrency(lucroTotal)}</Text>
                                </View>

                                {/* Botões para ordenação e fechamento do modal */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.sortButton} onPress={sortData}>
                                        <Text style={styles.buttonText}>
                                            {isSortedByProfit ? 'Ordenar por Nome' : 'Ordenar por Lucro'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
                                        <Text style={styles.buttonText}>Fechar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal de erro */}
            <Modal animationType="slide" transparent={true} visible={modalErrorVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Erro</Text>
                        <Text style={styles.errorMessage}>Ocorreu um erro ao gerar o relatório de lucro.</Text> 
                        <TouchableOpacity style={styles.closeButton} onPress={fecharModalErro}> 
                            <Text style={styles.buttonText}>Fechar</Text> 
                        </TouchableOpacity> 
                    </View> 
                </View> 
            </Modal> 
        </View> 
    ); 
}
