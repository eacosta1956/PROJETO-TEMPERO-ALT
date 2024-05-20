import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/gerarRelatoriosStyles';

export default function GerarRelatorios() {
    const navigation = useNavigation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleInputChange = (text, setDate) => {
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

        setDate(formattedDate);
    };

    const navigateToRelatorio = (tipo) => {
        navigation.navigate(tipo, { startDate, endDate });
    };

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
