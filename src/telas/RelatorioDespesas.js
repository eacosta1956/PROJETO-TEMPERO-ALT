import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../database/AbreConexao'; // Importação do módulo de banco de dados
import styles from '../styles/relatorioDespesasStyles'; // Importação do arquivo de estilos

export default function RelatorioDespesas({ route, navigation }) {
    const { dataInicial, dataFinal } = route.params; // Extração dos parâmetros dataInicial e dataFinal do objeto de navegação
    const [relatorio, setRelatorio] = useState([]); // Estado para armazenar o relatório de despesas
    const [despesaTotalBebidas, setDespesaTotalBebidas] = useState(0); // Estado para armazenar o total de despesas com bebidas
    const [despesaTotalComidas, setDespesaTotalComidas] = useState(0); // Estado para armazenar o total de despesas com comidas
    const [despesaTotalDescartaveis, setDespesaTotalDescartaveis] = useState(0); // Estado para armazenar o total de despesas com descartáveis
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal principal
    const [modalErrorVisible, setModalErrorVisible] = useState(false); // Estado para controlar a visibilidade do modal de erro
    const [totalGeral, setTotalGeral] = useState(0); // Estado para armazenar o total geral das despesas
    const [isLoading, setIsLoading] = useState(true); // Estado para rastrear se os dados estão sendo carregados

    // Efeito para carregar o relatório de despesas com base nas datas de início e término
    useEffect(() => {
        // Função para buscar o relatório de despesas de um determinado tipo de produto
        const fetchRelatorio = (tipoProduto) => {
            return new Promise((resolve, reject) => {
                db.transaction((transaction) => {
                    transaction.executeSql(
                        // Consulta SQL para obter o relatório de despesas de um tipo de produto específico dentro do período especificado
                        `SELECT 
                            p.nome_produto,
                            SUM(e.quantidade * e.preco_compra) AS despesa_total
                        FROM entrada_saida e
                        JOIN produtos p ON e.id_produto = p.id_produto
                        WHERE e.quantidade >= 0 
                        AND p.tipo_produto = ?
                        AND e.data_atualizacao >= ? || ' 00:00:00'  
                        AND e.data_atualizacao <= ? || ' 23:59:59'
                        GROUP BY p.nome_produto
                        ORDER BY p.nome_produto ASC;`,
                        [tipoProduto, dataInicial, dataFinal], // Parâmetros da consulta SQL
                        (_, { rows }) => {
                            const relatorio = rows._array.map(item => ({ ...item, tipo_produto: tipoProduto })); // Mapeamento dos resultados da consulta para o formato desejado
                            resolve(relatorio); // Resolução da promessa com o relatório obtido
                        },
                        (_, error) => {
                            console.log(`Erro ao obter relatório de ${tipoProduto.toLowerCase()}:`, error); // Registro de erros ocorridos durante a consulta
                            reject(error); // Rejeição da promessa com o erro ocorrido
                        }
                    );
                });
            });
        };

        // Promise.all é usado para buscar relatórios de despesas de diferentes tipos de produtos em paralelo
        Promise.all([
            fetchRelatorio('Bebida'), // Relatório de despesas com bebidas
            fetchRelatorio('Comida'), // Relatório de despesas com comidas
            fetchRelatorio('Descartavel') // Relatório de despesas com descartáveis
        ]).then(results => {
            const bebidas = results[0]; // Extrai os resultados de bebidas
            const comidas = results[1]; // Extrai os resultados de comidas
            const descartaveis = results[2]; // Extrai os resultados de descartáveis

            const totalBebidas = bebidas.reduce((acc, item) => acc + (item.despesa_total || 0), 0); // Calcula o total de despesas com bebidas
            const totalComidas = comidas.reduce((acc, item) => acc + (item.despesa_total || 0), 0); // Calcula o total de despesas com comidas
            const totalDescartaveis = descartaveis.reduce((acc, item) => acc + (item.despesa_total || 0), 0); // Calcula o total de despesas com descartáveis

            setDespesaTotalBebidas(totalBebidas); // Atualiza o estado do total de despesas com bebidas
            setDespesaTotalComidas(totalComidas); // Atualiza o estado do total de despesas com comidas
            setDespesaTotalDescartaveis(totalDescartaveis); // Atualiza o estado do total de despesas com descartáveis

            const combinedRelatorio = [
                { header: 'Bebidas' },
                ...bebidas,
                { totalHeader: 'Despesa Total com Bebidas', total: totalBebidas },
                { spacer: true },
                { header: 'Comidas' },
                ...comidas,
                { totalHeader: 'Despesa Total com Comidas', total: totalComidas },
                { spacer: true },
                { header: 'Descartáveis' },
                ...descartaveis,
                { totalHeader: 'Despesa Total com Descartáveis', total: totalDescartaveis },
                { spacer: true },
                { totalHeader: 'TOTAL GERAL DAS DESPESAS', total: totalBebidas + totalComidas + totalDescartaveis } // Total geral das despesas
            ];

            setRelatorio(combinedRelatorio); // Atualiza o estado do relatório combinado
            setTotalGeral(totalBebidas + totalComidas + totalDescartaveis); // Atualiza o estado do total geral das despesas
            setIsLoading(false); // Define o estado de carregamento como falso após obter os dados
            setModalVisible(true); // Mostra o modal principal
        }).catch(error => {
            console.log('Erro ao combinar relatórios:', error); // Registro de erros ocorridos ao combinar os relatórios
            setIsLoading(false); // Define o estado de carregamento como falso mesmo em caso de erro
            setModalErrorVisible(true); // Mostra o modal de erro
        });

    }, [dataInicial, dataFinal]); // Dependências do efeito useEffect

    // Função para fechar o modal principal e navegar de volta para a tela inicial
    const fecharModal = () => {
        setModalVisible(false); // Oculta o modal principal
        navigation.navigate('Home'); // Navega para a tela inicial
    };

    // Função para fechar o modal de erro e voltar para a tela anterior
    const fecharModalErro = () => {
        setModalErrorVisible(false); // Oculta o modal de erro
        navigation.goBack(); // Navega de volta para a tela anterior
    };

    // Função para formatar um valor numérico como uma string de moeda
    const formatCurrency = (value) => {
        if (value === null || value === undefined) {
            return 'R$ 0,00'; // Valor padrão para valores nulos ou indefinidos
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // Formatação de moeda para BRL
    };

    // Função para renderizar cada item da lista FlatList
    const renderItem = ({ item }) => {
        if (item.header) {
            return (
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>{item.header}</Text>
                </View>
            );
        }
        if (item.totalHeader) {
            return (
                <View>
                    <View style={styles.line} />
                    {item.total !== undefined && ( // Verificando se 'total' está definido
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalHeader}>{item.totalHeader}:</Text>
                            <Text style={styles.totalAmount}>{formatCurrency(item.total)}</Text>
                        </View>
                    )}
                    <View style={styles.line} />
                </View>
            );
        }
        if (item.spacer) {
            return <View style={styles.spacer} />;
        }
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                    Produto: <Text style={styles.productName}>{item.nome_produto}</Text>
                </Text>
                {item.despesa_total !== undefined && ( // Verificando se 'despesa_total' está definido
                    <Text>Despesas: {formatCurrency(item.despesa_total)}</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Modal principal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Relatório de Despesas</Text>
                        <Text style={styles.dateText}>Período: {dataInicial} a {dataFinal}</Text>

                        {/* Verifica se está carregando os dados */}
                        {isLoading ? (
                            <Text>Carregando...</Text> // Indicador de carregamento
                        ) : (
                            relatorio.length > 0 ? (
                                <FlatList
                                    data={relatorio}
                                    keyExtractor={(item, index) => index.toString()} // Função para extrair chaves únicas dos itens da lista
                                    renderItem={renderItem} // Função para renderizar cada item da lista
                                    contentContainerStyle={{ paddingBottom: 50 }} // Estilo do conteúdo da lista
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
                        <Text style={styles.errorMessage}>Por favor, insira uma data válida no formato AAAA/MM/DD.</Text>

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
