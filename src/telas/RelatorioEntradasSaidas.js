import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../database/AbreConexao';
import styles from '../styles/relatorioEntradasSaidasStyles';

export default function RelatorioEntradasSaidas({ route, navigation }) {
    const { startDate, endDate } = route.params;
    const [relatorio, setRelatorio] = useState([]);
    const [modalVisible, setModalVisible] = useState(true);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);

    const validarDatas = () => {
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            setModalErrorVisible(true);
            return false;
        }
        return true;
    };

    const fecharModalErro = () => {
        setModalErrorVisible(false);
        navigation.goBack();
    };

    const fecharModal = () => {
        setModalVisible(false);
        navigation.navigate('Home');
    };

    const gerarRelatorio = () => {
        if (!validarDatas()) {
            return;
        }

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
                [startDate, endDate],
                (_, { rows }) => {
                    const relatorioProdutos = rows._array;
                    setRelatorio(relatorioProdutos);
                },
                (_, error) => {
                    console.log('Erro ao gerar relatório:', error);
                }
            );
        });
    };

    useEffect(() => {
        gerarRelatorio();
    }, []);

    return (
        <View style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Relatório de Entradas e Saídas</Text>
                        <Text style={styles.dateText}>Período: {startDate} a {endDate}</Text>
                        {relatorio.length > 0 ? (
                        <FlatList
                            data={relatorio}
                            keyExtractor={(item) => item.id_produto.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <Text style={styles.itemText}>
                                        Produto: <Text style={styles.productName}>{item.nome_produto}</Text>
                                    </Text>
                                    <Text>Entradas: {item.total_entradas}</Text>
                                    <Text>Saídas: {item.total_saidas}</Text>
                                    <Text>Diferença: {item.total_entradas - item.total_saidas}</Text>
                                </View>
                            )}
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
