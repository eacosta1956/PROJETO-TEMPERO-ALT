import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { db } from '../database/AbreConexao'; 

export default function ApagarRegistros() {
    const apagarRegistros = () => {
        db.transaction((transaction) => {
            // Apagar todos os registros da tabela estoque
            transaction.executeSql(
                `DELETE FROM estoque;`,
                [],
                (_, { rowsAffected }) => {
                    console.log(`Registros excluídos da tabela estoque: ${rowsAffected}`);
                    
                    // Apagar todos os registros da tabela produtos
                    transaction.executeSql(
                        `DELETE FROM produtos;`,
                        [],
                        (_, { rowsAffected }) => {
                            console.log(`Registros excluídos da tabela produtos: ${rowsAffected}`);
                            
                            // Apagar todos os registros da tabela entrada_saida
                            transaction.executeSql(
                                `DELETE FROM entrada_saida;`,
                                [],
                                (_, { rowsAffected }) => {
                                    console.log(`Registros excluídos da tabela entrada_saida: ${rowsAffected}`);
                                    Alert.alert('Sucesso', 'Registros excluídos com sucesso.');
                                },
                                (_, error) => console.log('Erro ao excluir registros da tabela entrada_saida:', error)
                            );
                        },
                        (_, error) => console.log('Erro ao excluir registros da tabela produtos:', error)
                    );
                },
                (_, error) => console.log('Erro ao excluir registros da tabela estoque:', error)
            );
        });
    };

    return (
        <View style={styles.container}>
            <Button title="Apagar Registros" onPress={apagarRegistros} />
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
});
