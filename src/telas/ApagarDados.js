import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../database/AbreConexao'; // Importe o arquivo que abre a conexão com o banco de dados aqui
import styles from '../styles/apagarDadosStyles'; // Importe os estilos do arquivo correspondente

export default function ApagarDados({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [dataExclusao, setDataExclusao] = useState('');
    const [botaoAtivado, setBotaoAtivado] = useState(false);

    const handleExcluirRegistros = () => {
        // Função para excluir os registros da tabela entrada_saida até a data informada
        if (dataExclusao) {
            const sqlQuery = `DELETE FROM entrada_saida WHERE data_atualizacao <= ?`;
            db.transaction((transaction) => {
                transaction.executeSql(
                    sqlQuery,
                    [dataExclusao],
                    (_, result) => {
                        console.log('Registros excluídos com sucesso');
                        navigation.navigate('Home'); // Navegue de volta para a tela inicial após excluir os registros
                    },
                    (_, error) => {
                        console.log('Erro ao excluir registros:', error);
                    }
                );
            });
        }
    };

    const handleInputChange = (text) => {
        const cleanedText = text.replace(/\D/g, ''); // Remove non-numeric characters
        const maxLength = 8;
        const formattedText = cleanedText.slice(0, maxLength);

        let formattedDate = '';
        for (let i = 0; i < formattedText.length; i++) {
            if (i === 4 || i === 6) {
                formattedDate += '/';
            }
            formattedDate += formattedText[i];
        }

        setDataExclusao(formattedDate);

        // Verifica se a data está completamente preenchida no formato AAAA/MM/DD
        if (formattedDate.length === 10) {
            setBotaoAtivado(true);
        } else {
            setBotaoAtivado(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.periodText}>Apagar Dados do Banco de Dados</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data limite de exclusão</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA/MM/DD"
                        onChangeText={handleInputChange}
                        value={dataExclusao}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, botaoAtivado ? styles.buttonAtivado : null]}
                onPress={() => setModalVisible(true)}
                disabled={!botaoAtivado}
            >
                <Text style={styles.buttonText}>Apagar</Text>
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Tem certeza que deseja apagar os registros?</Text>
                        <Text style={styles.modalText}>Essa ação não pode ser desfeita.</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.yesButton} onPress={handleExcluirRegistros}>
                                <Text style={styles.buttonText}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
