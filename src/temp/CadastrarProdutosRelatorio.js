import React from 'react';
import { View, Button, Alert, StyleSheet, Styles } from 'react-native';
import { db } from '../database/AbreConexao'; 


export default function CadastrarProdutosRelatorio() {
    const cadastrarProdutos = () => {
        
        const novaDataCadastro = '2024/03/01 09:00:00'; // Data e horário desejados no formato AAAA-MM-DD HH:mm:ss

        // Arrays de bebidas e comidas
         const bebidas = [
            'COCA LATA', 'COCA LATA ZERO', 'COCA 2 L', 'COCA 2L ZERO', 'GUARANA 1,5', 'GUARANA LATA',
            'GUARANA LATA ZERO', 'FANTA UVA 600', 'FANTA UVA LATA', 'FANTA LARANJA 600', 'FANTA LARANJA LATA',
            'GUARANA 600', 'GUARAVITON', 'AGUA', 'AGUA COM GAS', 'LIMONETO', 'H20', 'DEL VALE UVA',
            'DEL VALE PESSEGO', 'DEL VALE MARACUJA', 'DEL VALE MANGA', 'COCA 600', 'COCA 600 ZERO',
            'BRAHMA LATAO', 'HEINEKEN LATAO', 'SCHWEPPES CITRUS', 'AGUA TONICA'
        ];

/*         // Arrays de bebidas e comidas
         const bebidas = [
            'COCA LATA', 
        ]; */

         const comidas = [
            'ARROZ', 'FEIJAO', 'MACARRAO ESPAGUETE', 'MACARRAO PARAFUSO', 'MACARRAO PENA',
            'FARINHA DE MESA', 'FARINHA DE ROSCA', 'GARFO DESCARTAVEL', 'FACA DESCARTAVEL',
            'QUENTINHA 150', 'OLEO'
        ];

/*          const comidas = [
            'ARROZ',
        ]; */


        db.transaction((transaction) => {
            // Apagar todos os registros da tabela estoque
            transaction.executeSql(
                `DELETE FROM estoque;`,
                [],
                (_, { rowsAffected }) => {
                    console.log('\n');
                    console.log(`Registros excluídos da tabela estoque: ${rowsAffected}`);
        
                    // Apagar todos os registros da tabela entrada_saida
                    transaction.executeSql(
                        `DELETE FROM entrada_saida;`,
                        [],
                        (_, { rowsAffected }) => {
                            console.log(`Registros excluídos da tabela entrada_saida: ${rowsAffected}`);
        
                            // Apagar todos os registros da tabela produtos
                            transaction.executeSql(
                                `DELETE FROM produtos;`,
                                [],
                                (_, { rowsAffected }) => {
                                    console.log(`Registros excluídos da tabela produtos: ${rowsAffected}`);
        
                                    // Cadastrar as bebidas na tabela produtos e estoque
                                    cadastrarItens(transaction, bebidas, novaDataCadastro, 'Bebida', 6);
        
                                    // Cadastrar as comidas na tabela produtos e estoque
                                    cadastrarItens(transaction, comidas, novaDataCadastro, 'Comida', 6);
        
                                    Alert.alert('Sucesso', 'Produtos cadastrados com sucesso.');
                                },
                                (_, error) => console.log('Erro ao excluir registros da tabela produtos:', error)
                            );
                        },
                        (_, error) => console.log('Erro ao excluir registros da tabela entrada_saida:', error)
                    );
                },
                (_, error) => console.log('Erro ao excluir registros da tabela estoque:', error)
            );
        });
    }

    function cadastrarItens(transaction, itens, dataCadastro, tipoProduto, estoqueMinimo) {
        itens.forEach((nomeProduto) => {
            transaction.executeSql(
                `INSERT INTO produtos (nome_produto, tipo_produto, data_cadastro, estoque_minimo) 
                VALUES (?, ?, ?, ?);`,
                [nomeProduto, tipoProduto, dataCadastro, estoqueMinimo],
                (_, { insertId }) => {
                    console.log(`Produto ${insertId} (${tipoProduto}) cadastrado.`);

                    // Cadastrar na tabela estoque
                    transaction.executeSql(
                        `INSERT INTO estoque (id_produto, estoque_atual, data_atualizacao_estoque) 
                        VALUES (?, ?, ?);`,
                        [insertId, 0, dataCadastro],
                        () => console.log(`Estoque do Produto ${insertId} (${tipoProduto}) atualizado.`),
                        (_, error) => console.log('Erro ao atualizar estoque:', error)
                    );
                },
                (_, error) => console.log('Erro ao cadastrar produto:', error)
            );
        });
    }

    return (
        <View style={styles.container}>
            <Button title="Cadastrar Produtos para Relatório" onPress={cadastrarProdutos} />
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
});
