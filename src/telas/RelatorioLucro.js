import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/relatorioLucroStyles';


export default function RelatorioLucro({ route, navigation }) {
    const { startDate, endDate } = route.params;
    const [relatorio, setRelatorio] = useState([]);
    const [lucroTotal, setLucroTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(true);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [isSortedByProfit, setIsSortedByProfit] = useState(false);
    const flatListRef = useRef(null);

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
                        [startDate, endDate],
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
            const totalLucro = relatorio.reduce((acc, item) => acc + item.lucro_total, 0);
            setRelatorio(relatorio);
            setLucroTotal(totalLucro);
        }).catch(error => {
            console.log('Erro ao obter relatório de lucro:', error);
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

    const sortData = () => {
        const sortedData = isSortedByProfit 
            ? [...relatorio].sort((a, b) => a.nome_produto.localeCompare(b.nome_produto))
            : [...relatorio].sort((a, b) => b.lucro_total - a.lucro_total);
        setRelatorio(sortedData);
        setIsSortedByProfit(!isSortedByProfit);

        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    };

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
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Relatório de Lucro com Bebidas</Text>
                        <Text style={styles.dateText}>Período: {startDate} a {endDate}</Text>

                        <FlatList
                            ref={flatListRef}
                            data={relatorio}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: 150 }} // Ajustar padding para não cobrir o último item
                        />
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalHeader}>Lucro Total:</Text>
                            <Text style={styles.totalAmount}>{formatCurrency(lucroTotal)}</Text>
                        </View>
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
                    </View>
                </View>
            </Modal>

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
