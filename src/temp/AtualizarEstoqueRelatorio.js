import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../database/AbreConexao';


export default function AtualizarEstoqueRelatorio() {

    const bebidas = [
        { nome: 'AGUA COM GAS', precoCompra: 1.69, precoVenda: 4.00 },
        { nome: 'AGUA TONICA', precoCompra: 3.39, precoVenda: 6.00 },
        { nome: 'AGUA', precoCompra: 1.59, precoVenda: 3.00 },
        { nome: 'BRAHMA LATAO', precoCompra: 4.49, precoVenda: 7.00 },
        { nome: 'COCA 2 L', precoCompra: 9.49, precoVenda: 12.00 },
        { nome: 'COCA 2L ZERO', precoCompra: 9.49, precoVenda: 12.00 },
        { nome: 'COCA 600 ZERO', precoCompra: 5.29, precoVenda: 7.00 },
        { nome: 'COCA 600', precoCompra: 5.29, precoVenda: 7.00 },
        { nome: 'COCA LATA ZERO', precoCompra: 4.19, precoVenda: 6.00 },
        { nome: 'COCA LATA', precoCompra: 3.69, precoVenda: 6.00 },
        { nome: 'DEL VALE MANGA', precoCompra: 2.35, precoVenda: 6.00 },
        { nome: 'DEL VALE MARACUJA', precoCompra: 2.35, precoVenda: 6.00 },
        { nome: 'DEL VALE PESSEGO', precoCompra: 2.35, precoVenda: 6.00 },
        { nome: 'DEL VALE UVA', precoCompra: 2.35, precoVenda: 6.00 },
        { nome: 'FANTA LARANJA 600', precoCompra: 4.49, precoVenda: 7.00 },
        { nome: 'FANTA LARANJA LATA', precoCompra: 3.09, precoVenda: 6.00 },
        { nome: 'FANTA UVA 600', precoCompra: 4.49, precoVenda: 7.00 },
        { nome: 'FANTA UVA LATA', precoCompra: 3.09, precoVenda: 6.00 },
        { nome: 'GUARANA 1,5', precoCompra: 5.99, precoVenda: 10.00 },
        { nome: 'GUARANA 600', precoCompra: 6.00, precoVenda: 7.00 },
        { nome: 'GUARANA LATA ZERO', precoCompra: 3.59, precoVenda: 6.00 },
        { nome: 'GUARANA LATA', precoCompra: 3.59, precoVenda: 6.00 },
        { nome: 'GUARAVITON', precoCompra: 2.69, precoVenda: 6.00 },
        { nome: 'H2O', precoCompra: 4.29, precoVenda: 7.00 },
        { nome: 'HEINEKEN LATAO', precoCompra: 6.49, precoVenda: 10.00 },
        { nome: 'LIMONETO', precoCompra: 4.29, precoVenda: 7.00 },
        { nome: 'SCHWEPPES CITRUS', precoCompra: 2.99, precoVenda: 6.00 },
    ];

    const comidas = [
        { nome: 'ARROZ', precoCompra: 32.99, precoVenda: 0.00 },
        { nome: 'FEIJAO', precoCompra: 8.19, precoVenda: 0.00 },
        { nome: 'MACARRAO ESPAGUETE', precoCompra: 4.29, precoVenda: 0.00 },
        { nome: 'MACARRAO PARAFUSO', precoCompra: 4.69, precoVenda: 0.00 },
        { nome: 'MACARRAO PENA', precoCompra: 4.99, precoVenda: 0.00 },
        { nome: 'FARINHA DE MESA', precoCompra: 4.99, precoVenda: 0.00 },
        { nome: 'FARINHA DE ROSCA', precoCompra: 6.89, precoVenda: 0.00 },
        { nome: 'OLEO', precoCompra: 6.49, precoVenda: 0.00 },
    ];

    const descartaveis = [
        { nome: 'GARFO DESCARTAVEL', precoCompra: 7.67, precoVenda: 0.00 },
        { nome: 'FACA DESCARTAVEL', precoCompra: 8.25, precoVenda: 0.00 },
        { nome: 'QUENTINHA 150', precoCompra: 32.98, precoVenda: 0.00 },
    ];

    const getProductPriceDetails = (nomeProduto) => {
        const allProducts = [...bebidas, ...comidas, ...descartaveis];
        return allProducts.find(product => product.nome === nomeProduto) 
    };

    const atualizaMovimentacoes = async () => {
        try {
            const produtos = await consultaProdutos(); // Consulta os IDs dos produtos

            const datasAtualizacao = [
                '2024/03/05 15:00:00',
                '2024/03/10 15:00:00',
                '2024/03/15 15:00:00',
                '2024/03/20 15:00:00',
                '2024/03/25 15:00:00',
                '2024/03/30 15:00:00',
            ];
            let cont = 0;
            for (const dataStr of datasAtualizacao) {
                let indice = 0;
                for (const produto of produtos) {
                    const partesDataHora = dataStr.split(' ')[0].split('/');
                    const dia = parseInt(partesDataHora[2], 10);
                    const adicionar = dia % 10 === 5;

                    
                    const idProduto = produtos[indice].id_produto;
                    const nomeProduto = produtos[indice].nome_produto;
                    const { precoCompra, precoVenda } = getProductPriceDetails(nomeProduto);

                    try {
                        const saldoEstoque = await consultaEstoquePromise(produtos, indice, dataStr, cont);
                        const qtde = adicionar ? getRandomInt(20, 30) : -getRandomInt(1, 10);
                        const novoSaldo = saldoEstoque + qtde;

                        atualizaEntradaSaida(idProduto, qtde, novoSaldo, dataStr, cont, precoCompra, precoVenda, nomeProduto);
                        atualizaEstoque(produtos, indice, qtde, novoSaldo, dataStr, cont, precoCompra, precoVenda,);
                    } catch (error) {
                        console.error('Erro ao consultar ou atualizar estoque:', error);
                    }
    
                    indice++;
                }
                cont++;
            }
            Alert.alert('Movimentações inseridas.');
        } catch (error) {
            console.error('Erro ao atualizar movimentações:', error);
        }
    };

    const consultaProdutos = () => {
        return new Promise((resolve, reject) => {
            db.transaction((transaction) => {
                transaction.executeSql(
                    `SELECT id_produto, nome_produto FROM produtos;`,
                    [],
                    (_, { rows }) => {
                        const produtos = [];
                        for (let i = 0; i < rows.length; i++) {
                            const { id_produto, nome_produto } = rows.item(i);
                            produtos.push({ id_produto, nome_produto });
                        }
                        resolve(produtos); // Resolve a Promise com os IDs encontrados
                    },
                    (_, error) => {
                        reject(new Error('Erro ao consultar produtos:', error));
                    }
                );
            });
        });
    };
    

    const atualizaEntradaSaida = (idProduto, qtde, novoSaldo, dataStr, cont, precoCompra, precoVenda, nomeProduto) => {
        db.transaction((transaction) => {
            transaction.executeSql(
                `INSERT INTO entrada_saida (id_produto, quantidade, data_atualizacao, estoque_atual, preco_compra, preco_venda) 
                VALUES (?, ?, ?, ?, ?, ?);`,
                [idProduto, qtde, dataStr, novoSaldo, precoCompra, precoVenda],
                (_, { insertId }) => {
                    console.log('Inserção na tabela entrada_saida realizada com sucesso.');
                },
                (_, error) => {
                    console.log('Erro ao inserir na tabela entrada_saida:', error);
                }
            );
        });
    };

    const atualizaEstoque = (produtos, indice, qtde, novoSaldo, dataStr, cont, precoCompra, precoVenda,) => {
        const idProduto = produtos[indice].id_produto;
        db.transaction((transaction) => {
            transaction.executeSql(
                `UPDATE estoque SET estoque_atual = ?, data_atualizacao_estoque = ? , ultimo_preco_compra = ?, ultimo_preco_venda = ? WHERE id_produto = ?`,
                [novoSaldo, dataStr, precoCompra, precoVenda, idProduto],
                (_, result) => {
    
                    // Após o UPDATE, faz uma consulta para obter o novo valor do estoque atualizado
                    transaction.executeSql(
                        `SELECT estoque_atual FROM estoque WHERE id_produto = ?`,
                        [idProduto],
                        (_, { rows }) => {
                            if (rows.length > 0) {
                                const novoEstoque = rows.item(0).estoque_atual;
                                // Agora você pode usar esse valor conforme necessário
                            } else {
                                console.log('Nenhum resultado encontrado para este id de produto.');
                            }
                        },
                        (_, error) => {
                            console.log('Erro ao consultar estoque atualizado:', error);
                        }
                    );
                },
                (_, error) => {
                    console.log('Erro ao atualizar estoque:', error);
                }
            );
        });
    };
    
    // Função que retorna uma Promise para consultaEstoque
    const consultaEstoquePromise = (produtos, indice, dataAtualizacao, cont) => {
        const idProduto = produtos[indice].id_produto;
        return new Promise((resolve, reject) => {
            db.transaction((transaction) => {
                transaction.executeSql(
                    `SELECT estoque_atual FROM estoque WHERE id_produto = ?;`,
                    [idProduto],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            const saldoEstoque = rows.item(0).estoque_atual;
                            resolve(saldoEstoque); // Resolve a Promise com o saldoEstoque
                        } else {
                            reject(new Error('Nenhum resultado encontrado para este id de produto.'));
                        }
                    },
                    (_, error) => {
                        reject(error); // Rejeita a Promise com o erro
                    }
                );
            });
        });
    };
    
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={atualizaMovimentacoes}>
                <Text style={styles.buttonText}>Atualizar Estoque Semanalmente</Text>
            </TouchableOpacity>
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
