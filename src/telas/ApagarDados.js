import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../database/AbreConexao'; // Importa o arquivo que abre a conexão com o banco de dados aqui
import styles from '../styles/apagarDadosStyles'; // Importa os estilos do arquivo correspondente

export default function ApagarDados({ navigation }) {
    // Estado para controlar a visibilidade do modal de confirmação
    const [modalVisible, setModalVisible] = useState(false);
    // Estado para armazenar a data de exclusão
    const [dataExclusao, setDataExclusao] = useState('');
    // Estado para controlar se o botão de apagar está ativado ou não
    const [botaoAtivado, setBotaoAtivado] = useState(false);

    // Função para converter a data de DD/MM/AAAA para AAAA/MM/DD.
    const convertToYYYYMMDD = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}/${month}/${day}}`;
    };

    // Função para excluir registros da tabela entrada_saida até a data informada
    // --------------------------------------------------------------------------
    const handleExcluirRegistros = () => {
        const dataExclusaoFormatada = convertToYYYYMMDD(dataExclusao);

        if (dataExclusao) {
            const sqlQuery = `DELETE FROM entrada_saida WHERE data_atualizacao <= ?`;
            db.transaction((transaction) => {
                transaction.executeSql(
                    sqlQuery,
                    [dataExclusaoFormatada],
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

    // Função para lidar com as mudanças no campo de entrada de data
    // -------------------------------------------------------------
    const handleInputChange = (text) => {
        const cleanedText = text.replace(/\D/g, ''); // Remove caracteres não numéricos
        const maxLength = 8; // Define o comprimento máximo da entrada
        const formattedText = cleanedText.slice(0, maxLength);

        let formattedDate = '';
        for (let i = 0; i < formattedText.length; i++) {
            if (i === 4 || i === 6) {
                formattedDate += '/';
            }
            formattedDate += formattedText[i];
        }

        setDataExclusao(formattedDate);

        // Verifica se a data está completamente preenchida no formato DD/MM/AAAA
        // ----------------------------------------------------------------------
        if (formattedDate.length === 10) {
            setBotaoAtivado(true); // Ativa o botão se a data estiver completa
        } else {
            setBotaoAtivado(false); // Desativa o botão se a data não estiver completa
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
                        placeholder="DD/MM/AAAA"
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
                disabled={!botaoAtivado} // Botão desativado se botaoAtivado for false
            >
                <Text style={styles.buttonText}>Apagar</Text>
            </TouchableOpacity>

            {/* Modal para confirmação de exclusão */}
            {/* Define a animação do modal como um deslizamento. */}
            {/* Faz o fundo do modal ser transparente. */}
            {/* Controla a visibilidade do modal com base no estado modalVisible. */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                {/* Container principal do modal. */}
                <View style={styles.modalContainer}>
                    {/* Contém o conteúdo interno do modal. */}
                    <View style={styles.modalContent}>
                        {/* Exibe a mensagem de confirmação para o usuário. */}
                        <Text style={styles.modalText}>Tem certeza que deseja apagar os registros?</Text>
                        <Text style={styles.modalText}>Essa ação não pode ser desfeita.</Text>
                        {/* Container para organizar os botões "Sim" e "Cancelar". */}
                        <View style={styles.buttonContainer}>
                            {/*Confirma a exclusão dos registros e chama a função handleExcluirRegistros.*/}
                            <TouchableOpacity style={styles.yesButton} onPress={handleExcluirRegistros}>
                                <Text style={styles.buttonText}>Sim</Text>
                            </TouchableOpacity>
                            {/*Fecha o modal sem realizar a exclusão, apenas alterando o estado modalVisible para false.*/}
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
