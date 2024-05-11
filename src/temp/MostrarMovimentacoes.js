import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { db } from '../database/AbreConexao'; // Importe o acesso ao seu banco de dados
import { formatDateTime, reverseFormatDateTime } from '../utils/DateTimeUtils';

export default function Home() {
    const [modalVisible, setModalVisible] = useState(false);
    const [movimentacoes, setMovimentacoes] = useState([]);

    // ========= mostrarMovimentacoes ===============

    const mostrarMovimentacoes = () => {
        setModalVisible(true);
        // Consulta ao banco de dados para obter as movimentações
        db.transaction((transaction) => {
            transaction.executeSql(
                `SELECT id_produto, quantidade, data_atualizacao, estoque_atual FROM entrada_saida;`,
                [],
                (_, { rows }) => {
                    const movimentacoesArray = processarMovimentacoes(rows);
                    setMovimentacoes(movimentacoesArray);
                },
                (_, error) => {
                    console.log('Erro ao consultar movimentações:', error);
                }
            );
        });
    };

    // ========= processarMovimentacoes ===============

    const processarMovimentacoes = (rows) => {
        const movimentacoesArray = [];
        const movimentacoesPorProduto = {};

        for (let i = 0; i < rows.length; i++) {
            const { id_produto, quantidade, data_atualizacao, estoque_atual } = rows.item(i);

            if (!movimentacoesPorProduto[id_produto]) {
                movimentacoesPorProduto[id_produto] = [];
            }

            movimentacoesPorProduto[id_produto].push({ quantidade, data_atualizacao, estoque_atual });
        }

        // Transforma o objeto em um array de objetos para a FlatList
        for (const id_produto in movimentacoesPorProduto) {
            const movimentacoesProduto = movimentacoesPorProduto[id_produto];
            movimentacoesArray.push({ id_produto, movimentacoes: movimentacoesProduto });
        }

        return movimentacoesArray;
    };

    // ========= renderItem ===============

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text>ID Produto: {item.id_produto}</Text>
            {item.movimentacoes && item.movimentacoes.map((mov, index) => (
                <View key={index}>
                    <Text>Quantidade: {mov.quantidade}</Text>
                    <Text>Data Atualização: {mov.data_atualizacao}</Text>
                    <Text>Estoque: {mov.estoque_atual}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={mostrarMovimentacoes}>
                <Text style={styles.buttonText}>Mostrar Movimentações</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <FlatList
                            data={movimentacoes}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />

                        <TouchableOpacity
                            style={[styles.button, styles.modalCloseButton]}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    button: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    item: {
        marginBottom: 10,
    },
    modalCloseButton: {
        marginTop: 10,
        backgroundColor: '#e74c3c',
    },
});
