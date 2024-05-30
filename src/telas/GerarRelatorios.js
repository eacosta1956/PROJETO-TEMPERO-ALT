import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/gerarRelatoriosStyles';

export default function GerarRelatorios() {
    const navigation = useNavigation();
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');

    //Função para lidar com a entrada de texto e formatar as datas inseridas.
    // ---------------------------------------------------------------------
    const lidarEntradaDeTexto = (text, setDate) => {
        const cleanedText = text.replace(/\D/g, ''); // Remove caracteres não numéricos
        const maxLength = 8;
        const formattedText = cleanedText.slice(0, maxLength);

        let formattedDate = '';
        for (let i = 0; i < formattedText.length; i++) {
            if (i === 4 || i === 6) {
                formattedDate += '/';
            }
            formattedDate += formattedText[i];
        }

        setDate(formattedDate);
    };

    // Função para navegar para diferentes tipos de relatórios com as datas fornecidas.
    // --------------------------------------------------------------------------------
    const navigateToRelatorio = (tipo) => {
        navigation.navigate(tipo, { dataInicial, dataFinal });
    };

    /* Renderiza a interface do usuário, incluindo os campos de entrada de texto para as datas 
       inicial e final, e os botões para emitir diferentes tipos de relatórios.
       --------------------------------------------------------------------------------------- */
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.periodText}>Período de Avaliação</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data Inicial</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA/MM/DD"
                        onChangeText={(text) => lidarEntradaDeTexto(text, setDataInicial)}
                        value={dataInicial}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data Final</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA/MM/DD"
                        onChangeText={(text) => lidarEntradaDeTexto(text, setDataFinal)}
                        value={dataFinal}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigateToRelatorio('RelatorioEntradasSaidas')}>
                    <Text style={styles.buttonText}>Emitir Relatório de Entradas e Saídas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigateToRelatorio('RelatorioDespesas')}>
                    <Text style={styles.buttonText}>Emitir Relatório de Despesas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigateToRelatorio('RelatorioLucro')}>
                    <Text style={styles.buttonText}>Emitir Relatório de Lucro</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
