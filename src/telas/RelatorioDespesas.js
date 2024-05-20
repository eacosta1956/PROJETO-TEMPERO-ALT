import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/relatorioDespesasStyles';

export default function RelatorioDespesas({ route, navigation }) {
    const { startDate, endDate } = route.params;
    const [relatorio, setRelatorio] = useState([]);
    const [despesaTotalBebidas, setDespesaTotalBebidas] = useState(0);
    const [despesaTotalComidas, setDespesaTotalComidas] = useState(0);
    const [despesaTotalDescartaveis, setDespesaTotalDescartaveis] = useState(0);
    const [modalVisible, setModalVisible] = useState(true);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [totalGeral, setTotalGeral] = useState(0);

    useEffect(() => {
        const fetchRelatorio = (tipoProduto) => {
            return new Promise((resolve, reject) => {
                db.transaction((transaction) => {
                    transaction.executeSql(
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
                        [tipoProduto, startDate, endDate],
                        (_, { rows }) => {
                            const relatorio = rows._array.map(item => ({ ...item, tipo_produto: tipoProduto }));
                            resolve(relatorio);
                        },
                        (_, error) => {
                            console.log(`Erro ao obter relatório de ${tipoProduto.toLowerCase()}:`, error);
                            reject(error);
                        }
                    );
                });
            });
        };

        Promise.all([
            fetchRelatorio('Bebida'),
            fetchRelatorio('Comida'),
            fetchRelatorio('Descartavel')
        ]).then(results => {
            const bebidas = results[0];
            const comidas = results[1];
            const descartaveis = results[2];

            const totalBebidas = bebidas.reduce((acc, item) => acc + item.despesa_total, 0);
            const totalComidas = comidas.reduce((acc, item) => acc + item.despesa_total, 0);
            const totalDescartaveis = descartaveis.reduce((acc, item) => acc + item.despesa_total, 0);

            setDespesaTotalBebidas(totalBebidas);
            setDespesaTotalComidas(totalComidas);
            setDespesaTotalDescartaveis(totalDescartaveis);

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

            setRelatorio(combinedRelatorio);
            setTotalGeral(totalBebidas + totalComidas + totalDescartaveis); // Atualiza o estado do total geral das despesas
        }).catch(error => {
            console.log('Erro ao combinar relatórios:', error);
        });

    }, [startDate, endDate]);

    const fecharModal = () => {
        setModalVisible(false);
        navigation.navigate('Home');
    };

    const fecharModalErro = () => {
        setModalErrorVisible(false);
        navigation.goBack();
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

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
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Relatório de Despesas</Text>
                        <Text style={styles.dateText}>Período: {startDate} a {endDate}</Text>
                        {relatorio.length > 0 ? (
                        <FlatList
                            data={relatorio}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: 50 }} // Ajuste aqui
                        />) : (
                            <Text style={styles.errorMessage}>Não há dados para exibir.</Text>
                        )}

                        <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={modalErrorVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Erro</Text>
                        <Text style={styles.errorMessage}>Por favor, insira uma data válida no formato AAAA/MM/DD.</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={fecharModalErro}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


