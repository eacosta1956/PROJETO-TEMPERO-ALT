import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { db } from '../database/AbreConexao';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

export default function RelatorioConsumo() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [relatorio, setRelatorio] = useState([]);

    const gerarRelatorio = () => {
        db.transaction((transaction) => {
            transaction.executeSql(
                `SELECT e.id_produto, SUM(e.quantidade) AS total_consumido, p.nome_produto
                 FROM entrada_saida e
                 JOIN produtos p ON e.id_produto = p.id_produto
                 WHERE e.data_atualizacao BETWEEN ? AND ?
                 GROUP BY e.id_produto;`,
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

    const exportarPDF = async () => {
        try {
            const { uri: htmlPath } = await generateHTMLFile();
            const { filePath } = await RNHTMLtoPDF.convert({
                html: htmlPath,
                fileName: 'RelatorioConsumo',
                directory: 'Documents',
            });
            console.log('PDF gerado:', filePath);
        } catch (error) {
            console.log('Erro ao exportar para PDF:', error);
        }
    };

    const generateHTMLFile = async () => {
        // Gerar o conteúdo HTML para o relatório
        const htmlContent = generateHTMLContent();
        // Salvar o HTML em um arquivo temporário
        const { uri } = await RNHTMLtoPDF.convert({
            html: htmlContent,
            fileName: 'RelatorioConsumoTemp',
        });
        log.console({uri})
        return htmlPath;
    };

    const generateHTMLContent = () => {
        // Gerar o conteúdo HTML com base nos dados do relatório
        let html = '<html><body>';
        relatorio.forEach((item) => {
            html += `<p>Produto: ${item.nome_produto} - Total Consumido: ${item.total_consumido}</p>`;
        });
        html += '</body></html>';
        return html;
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Data de início (DD/MM/AAAA)"
                onChangeText={(text) => setStartDate(text)}
                value={startDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de término (DD/MM/AAAA)"
                onChangeText={(text) => setEndDate(text)}
                value={endDate}
            />
            <TouchableOpacity style={styles.button} onPress={gerarRelatorio}>
                <Text style={styles.buttonText}>Gerar Relatório</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={exportarPDF}>
                <Text style={styles.buttonText}>Exportar para PDF</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Relatório de Consumo:</Text>
            <ScrollView style={styles.scrollView}>
                {relatorio.map((item) => (
                    <Text key={item.id_produto}>
                        Produto: {item.nome_produto} - Total Consumido: {item.total_consumido}
                    </Text>
                ))}
            </ScrollView>
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
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    button: {
        width: '80%',
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollView: {
        width: '100%',
    },
});
