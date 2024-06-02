import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/gerarRelatoriosStyles';

export default function GerarRelatorios() {
    const navigation = useNavigation();
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');

    // Função para lidar com a entrada de texto e formatar as datas inseridas.
    const lidarEntradaDeTexto = (text, setDate) => {
        const cleanedText = text.replace(/\D/g, ''); // Remove caracteres não numéricos
        const maxLength = 8;
        const formattedText = cleanedText.slice(0, maxLength);

        let formattedDate = '';
        for (let i = 0; i < formattedText.length; i++) {
            if (i === 2 || i === 4) {
                formattedDate += '/';
            }
            formattedDate += formattedText[i];
        }

        setDate(formattedDate);
    };

    // Função para validar se a data está no formato correto e é uma data válida.
    const isValidDate = (dateString) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(dateString)) return false;

        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        return date && (date.getMonth() + 1) === month && date.getDate() === day;
    };

    // Função para converter a data de DD/MM/AAAA para AAAA/MM/DD.
    const convertToYYYYMMDD = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}/${month}/${day}`;
    };

    // Função para navegar para diferentes tipos de relatórios com as datas fornecidas.
    const navigateToRelatorio = (tipo) => {
        if (!isValidDate(dataInicial) || !isValidDate(dataFinal)) {
            Alert.alert('Data Inválida', 'Por favor, insira datas válidas no formato DD/MM/AAAA.');
            return;
        }
        const formattedDataInicial = convertToYYYYMMDD(dataInicial);
        const formattedDataFinal = convertToYYYYMMDD(dataFinal);
        navigation.navigate(tipo, { dataInicial: formattedDataInicial, dataFinal: formattedDataFinal });
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.periodText}>Período de Avaliação</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Data Inicial</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/AAAA"
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
                        placeholder="DD/MM/AAAA"
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
