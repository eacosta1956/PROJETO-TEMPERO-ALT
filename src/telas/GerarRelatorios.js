import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Modal, FlatList } from 'react-native';
import { db } from '../database/AbreConexao';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import { useNavigation, useRoute } from '@react-navigation/native';



export default function RelatorioConsumo() {
    const navigation = useNavigation();
    const route = useRoute(); // Use o hook useRoute para obter os parâmetros da rota
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [relatorio, setRelatorio] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalErrorVisible, setModalErrorVisible] = useState(false);

    //==================== handleInputChange ==================================
    const handleInputChange = (text, setDate) => {
        const cleanedText = text.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Limitar o input para apenas 8 caracteres
        const maxLength = 8;
        const formattedText = cleanedText.slice(0, maxLength);

        let formattedDate = '';

        // adiciona as duas barras da data
        for (let i = 0; i < formattedText.length; i++) {
            if (i === 4 || i === 6) {
                formattedDate += '/'; // Adiciona a barra após o segundo e quarto algarismos
            }
            formattedDate += formattedText[i];
        }

        setDate(formattedDate); // Define a data formatada

    };

    // ================= Alterações em validarDatas ======================
    const validarDatas = () => {
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/; // Expressão regular para validar formato AAAA/MM/DD
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            console.log('Datas inválidasAAA: ', startDate, endDate);
            setModalErrorVisible(true);
            return false;
        }
        console.log('Datas válidasBBB: ', startDate, endDate);
        return true;
    };
    // ============================ fecharModalErro ===========================
    // Função para fechar o modal de erro
    const fecharModalErro = () => {
        setModalErrorVisible(false);
    };
    //============================= fecharModal ===============================
    // Função para fechar o modal do relatório e retornar à tela Home
    const fecharModal = () => {
        setModalVisible(false); // Fecha o modal
        navigation.navigate('Home'); // Retorna à tela Home
    };
    //============================= gerarRelatorio ============================
    const gerarRelatorio = () => {
        console.log('startDateXXX:', startDate);
        console.log('endDateXXX:', endDate);

        if (startDate.length !== 10 || endDate.length !== 10) {
            console.log('startDateYYY:', startDate);
            setModalErrorVisible(true);
            return;
        }

        // Adicionar a chamada para validar as datas
        const datasValidas = validarDatas();
        if (!datasValidas) {
            // Se as datas não forem válidas, não continue
            return;
        }
        // Verifica se startDate e endDate são objetos Date válidos
/*         if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            setModalErrorVisible(true);
            return;
        } */

        console.log('startDateZZZ:', startDate);
        console.log('endDateZZZ:', endDate);

        console.log('Iniciando transação SQL...');
        db.transaction((transaction) => {
            transaction.executeSql(
                `SELECT 
                    e.id_produto, 
                    SUM(CASE WHEN e.quantidade >= 0 THEN e.quantidade ELSE 0 END) AS total_entradas,
                    SUM(CASE WHEN e.quantidade < 0 THEN ABS(e.quantidade) ELSE 0 END) AS total_saidas,
                    p.nome_produto
                 FROM entrada_saida e
                 JOIN produtos p ON e.id_produto = p.id_produto
                 WHERE e.data_atualizacao >= ? || ' 00:00:00'  AND e.data_atualizacao <= ? || ' 23:59:59'
                 GROUP BY e.id_produto;`,
                 [startDate, endDate],
                (_, { rows }) => {
                    const relatorioProdutos = rows._array;
                    console.log('Relatório gerado:', relatorioProdutos);
                    setRelatorio(relatorioProdutos);
                    setModalVisible(true);
                    //const periodoRelatorio = `Relatório de Consumo (${startDate} a ${endDate})`;
                    //navigation.setParams({ tituloRelatorio: periodoRelatorio });

                },
                (_, error) => {
                    console.log('Erro ao gerar relatório:', error);
                }
            );
        });
    };

    //============================= return ====================================
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.periodText}>Período de Avaliação</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data Inicial</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA/MM/DD"
                        onChangeText={(text) => handleInputChange(text, setStartDate)}
                        value={startDate}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data Final</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA/MM/DD"
                        onChangeText={(text) => handleInputChange(text, setEndDate)}
                        value={endDate}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={gerarRelatorio}>
                    <Text style={styles.buttonText}>Ver Detalhes</Text>
                </TouchableOpacity>
            </View>
            
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Relatório de Consumo</Text>
                        <Text style={styles.dateText}>
                            Período: {startDate} a {endDate}
                        </Text>
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
                        />
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
                        <Text style={styles.errorMessage}>Por favor, insira uma data válida.</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={fecharModalErro}>
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
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    // Estilos para o botão e o modal
    button: {
        width: 300,
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
      input: {
        width: 200,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlign: 'center', // Centraliza o texto horizontalmente
        textAlignVertical: 'center', // Centraliza o texto verticalmente
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '95%',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    itemContainer: {
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e74c3c',
        borderRadius: 5,
        alignItems: 'center',
    },
    periodSeparator: {
        marginBottom: 10,
    },
    productName: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    periodText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 35,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'normal', // Pode ajustar o peso da fonte conforme necessário
        marginBottom: 10,
        textAlign: 'center',
    },
});
