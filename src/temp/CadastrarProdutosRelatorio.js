import React from 'react';
import { View, Button, Alert, StyleSheet, Styles } from 'react-native';
import { db } from '../database/AbreConexao'; 


export default function CadastrarProdutosRelatorio() {
    const cadastrarProdutos = () => {
        
        const novaDataCadastro = '2024/03/01 09:00:00'; // Data e horário desejados no formato AAAA-MM-DD HH:mm:ss

        const bebidas = [
            { nome: 'AGUA COM GAS', estoqueMinimo: 6 },
            { nome: 'AGUA TONICA', estoqueMinimo: 6 },
            { nome: 'AGUA', estoqueMinimo: 6 },
            { nome: 'BRAHMA LATAO', estoqueMinimo: 6 },
            { nome: 'COCA 2 L', estoqueMinimo: 6 },
            { nome: 'COCA 2L ZERO', estoqueMinimo: 6 },
            { nome: 'COCA 600 ZERO', estoqueMinimo: 6 },
            { nome: 'COCA 600', estoqueMinimo: 6 },
            { nome: 'COCA LATA ZERO', estoqueMinimo: 6 },
            { nome: 'COCA LATA', estoqueMinimo: 6 }, 
            { nome: 'DEL VALE MANGA', estoqueMinimo: 6 },
            { nome: 'DEL VALE MARACUJA', estoqueMinimo: 6 },
            { nome: 'DEL VALE PESSEGO', estoqueMinimo: 6 },
            { nome: 'DEL VALE UVA', estoqueMinimo: 6 },
            { nome: 'FANTA LARANJA 600', estoqueMinimo: 6 },
            { nome: 'FANTA LARANJA LATA', estoqueMinimo: 6 },
            { nome: 'FANTA UVA 600', estoqueMinimo: 6 },
            { nome: 'FANTA UVA LATA', estoqueMinimo: 6 },
            { nome: 'GUARANA 1,5', estoqueMinimo: 6 },
            { nome: 'GUARANA 600', estoqueMinimo: 6 },
            { nome: 'GUARANA LATA ZERO', estoqueMinimo: 6 },
            { nome: 'GUARANA LATA', estoqueMinimo: 6 },
            { nome: 'GUARAVITON', estoqueMinimo: 6 },
            { nome: 'H2O', estoqueMinimo: 6 },
            { nome: 'HEINEKEN LATAO', estoqueMinimo: 6 },
            { nome: 'LIMONETO', estoqueMinimo: 6 },
            { nome: 'SCHWEPPES CITRUS', estoqueMinimo: 6 },


        ];

        const comidas = [
            { nome: 'ARROZ', estoqueMinimo: 10 }, 
            { nome: 'FEIJAO', estoqueMinimo: 8 },
            { nome: 'MACARRAO ESPAGUETE', estoqueMinimo: 5 }, 
            { nome: 'MACARRAO PARAFUSO', estoqueMinimo: 3 },
            { nome: 'MACARRAO PENA', estoqueMinimo: 3 }, 
            { nome: 'FARINHA DE MESA', estoqueMinimo: 8 },
            { nome: 'FARINHA DE ROSCA', estoqueMinimo: 5 }, 
            { nome: 'OLEO', estoqueMinimo: 8 },
        ];

        const descartaveis = [
            { nome: 'FACA DESCARTAVEL', estoqueMinimo: 4 },
            { nome: 'GARFO DESCARTAVEL', estoqueMinimo: 4 }, 
            { nome: 'QUENTINHA 150', estoqueMinimo: 150 },
        ];

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
                                    cadastrarItens(transaction, bebidas, novaDataCadastro, 'Bebida');
        
                                    // Cadastrar as comidas na tabela produtos e estoque
                                    cadastrarItens(transaction, comidas, novaDataCadastro, 'Comida');

                                    // Cadastrar os descartáveis na tabela produtos e estoque
                                    cadastrarItens(transaction, descartaveis, novaDataCadastro, 'Descartavel');
        
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

    function cadastrarItens(transaction, itens, dataCadastro, tipoProduto) {
        itens.forEach(({ nome, estoqueMinimo }, index) => {
            transaction.executeSql(
                `INSERT INTO produtos (nome_produto, tipo_produto, data_cadastro, estoque_minimo) 
                VALUES (?, ?, ?, ?);`,
                [nome, tipoProduto, dataCadastro, estoqueMinimo],
                (_, { insertId }) => {
                    console.log(`Produto ${insertId} (${nome}) cadastrado.`);
                    transaction.executeSql(
                        `INSERT INTO estoque (id_produto, estoque_atual, data_atualizacao_estoque, ultimo_preco_compra, ultimo_preco_venda) 
                        VALUES (?, ?, ?, ?, ?);`,
                        [insertId, 0, dataCadastro],
                        () => console.log(`Estoque do Produto ${insertId} (${nome}) atualizado.`),
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
