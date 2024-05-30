import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../styles/gerarRelatoriosStyles'; // Importe seus estilos aqui 
 
// Modal para o relatório de Entradas e Saídas do Estoque
export const ModalRelatorioEntradasSaidas = ({ modalVisible, fecharModal, startDate, endDate, relatorio }) => {
    return (
        
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
    
    );
};

// Modal para o relatório de Despesas de Aquisição dos Produtos
export const ModalRelatorioDespesas = ({ modalVisible, fecharModal, startDate, endDate, relatorio }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
            {/* Conteúdo do Modal para Despesas de Aquisição dos Produtos */}
            {/* ... */}
        </Modal>
    );
};

// Modal para o relatório de Lucro com a venda das Bebidas
export const ModalRelatorioLucroBebida = ({ modalVisible, fecharModal, startDate, endDate, relatorio }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
            {/* Conteúdo do Modal para Lucro com a venda das Bebidas */}
            {/* ... */}
        </Modal>
    );
};