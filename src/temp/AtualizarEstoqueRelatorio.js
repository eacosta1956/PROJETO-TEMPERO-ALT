import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../database/AbreConexao';


export default function AtualizarEstoqueRelatorio() {

    const atualizaMovimentacoes = async () => {
        try {
            const idsProdutos = await consultaProdutos(); // Consulta os IDs dos produtos

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
                for (const idProduto of idsProdutos) {
                    console.log('\n');
                    const dataAtual = new Date();
                    console.log("Data atual:", dataAtual);
                    console.log(`datasAtualizacao.forEach1 - Cont: ${cont}`);
                    console.log(`datasAtualizacao.forEach1 - Valor de id_produto: ${idProduto}`);
                    console.log(`datasAtualizacao.forEach1 - Data de atualização: ${dataStr}`);

                    const partesDataHora = dataStr.split(' ')[0].split('/');
                    const dia = parseInt(partesDataHora[2], 10);

                    const adicionar = dia % 10 === 5;
                    console.log(`datasAtualizacao.forEach1 - Valor de adicionar: ${adicionar}`);
    
                    try {
                        const saldoEstoque = await consultaEstoquePromise(idsProdutos, indice, dataStr, cont);
                        const qtde = adicionar ? getRandomInt(20, 30) : -getRandomInt(1, 10);
                        const novoSaldo = saldoEstoque + qtde;
                        
                        console.log('\n');
                        console.log(`datasAtualizacao.forEach2 - Cont: ${cont}`);
                        console.log(`datasAtualizacao.forEach2 - Valor de novoSaldo: ${novoSaldo}`);
                        console.log(`datasAtualizacao.forEach2 - Valor de saldoEstoque: ${saldoEstoque}`);
                        console.log(`datasAtualizacao.forEach2 - Valor de qtde: ${qtde}`);
    
                        atualizaEntradaSaida(idsProdutos, indice, qtde, novoSaldo, dataStr, cont);
                        atualizaEstoque(idsProdutos, indice, qtde, novoSaldo, dataStr, cont);
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
                    `SELECT id_produto FROM produtos;`,
                    [],
                    (_, { rows }) => {
                        const idsProdutos = [];
                        for (let i = 0; i < rows.length; i++) {
                            idsProdutos.push(rows.item(i).id_produto);
                        }
                        resolve(idsProdutos); // Resolve a Promise com os IDs encontrados
                    },
                    (_, error) => {
                        reject(new Error('Erro ao consultar IDs de produtos:', error));
                    }
                );
            });
        });
    };
    

    const consultaEstoque = (idsProdutos, indice, dataStr, cont, callback) => {
        db.transaction((transaction) => {
            transaction.executeSql(
                `SELECT estoque_atual FROM estoque WHERE id_produto = ?;`,
                [idsProdutos[indice]],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const saldoEstoque = rows.item(0).estoque_atual;
                        callback(saldoEstoque);
                        console.log('\n');
                        const dataAtual = new Date();
                        console.log("Data atual:", dataAtual);
                        console.log(`consultaEstoque - Cont: ${cont}`);
                        console.log(`consultaEstoque - ID: ${idsProdutos[indice]}`);
                        console.log(`consultaEstoque - Índice: ${indice}`);
                        console.log(`consultaEstoque - Data: ${dataStr}`);
                        console.log(`consultaEstoque - Valor de saldoEstoque: ${saldoEstoque}`);
                    } else {
                        console.log('Nenhum resultado encontrado para este id de produto.');
                    }
                },
                (_, error) => {
                    console.log('Erro ao consultar estoque atual:', error);
                }
            );
        });
    };
    
    const atualizaEntradaSaida = (idsProdutos, indice, qtde, novoSaldo, dataStr, cont) => {
        console.log('\n');
        const dataAtual = new Date();
        console.log("Data atual:", dataAtual);
        console.log(`AtualizaEntradaSaida - Cont: ${cont}`);
        console.log(`AtualizaEntradaSaida - Ids do produto: ${idsProdutos[indice]}`);
        console.log(`AtualizaEntradaSaida - Índice: ${indice}`);
        console.log(`AtualizaEntradaSaida - Qtde: ${qtde}`);
        console.log(`AtualizaEntradaSaida - Novo Saldo: ${novoSaldo}`);
        console.log(`AtualizaEntradaSaida - Data: ${dataStr}`);
        db.transaction((transaction) => {
            transaction.executeSql(
                `INSERT INTO entrada_saida (id_produto, quantidade, data_atualizacao, estoque_atual) 
                VALUES (?, ?, ?, ?);`,
                [idsProdutos[indice], qtde, dataStr, novoSaldo],
                (_, { insertId }) => {
                    console.log('Inserção na tabela entrada_saida realizada com sucesso.');
                },
                (_, error) => {
                    console.log('Erro ao inserir na tabela entrada_saida:', error);
                }
            );
        });
    };

    const atualizaEstoque = (idsProdutos, indice, qtde, novoSaldo, dataStr, cont) => {
        console.log('\n');
        const dataAtual = new Date();
        console.log("Data atual:", dataAtual);
        console.log(`AtualizaEstoque1 - Cont: ${cont}`);
        console.log(`AtualizaEstoque1 - Id do produto: ${idsProdutos}`);
        console.log(`AtualizaEstoque1 - Índice: ${indice}`);
        console.log(`AtualizaEstoque1 - Qtde: ${qtde}`);
        console.log(`AtualizaEstoque1 - Novo Saldo: ${novoSaldo}`);
        console.log(`AtualizaEstoque1 - Data: ${dataStr}`);
        db.transaction((transaction) => {
            transaction.executeSql(
                `UPDATE estoque SET estoque_atual = ?, data_atualizacao_estoque = ? WHERE id_produto = ?`,
                [novoSaldo, dataStr, idsProdutos[indice]],
                (_, result) => {
                    console.log('\n');
                    const dataAtual = new Date();
                    console.log("Data atual:", dataAtual);
                    console.log(`AtualizaEstoque2 - Cont: ${cont}`);
                    console.log(`AtualizaEstoque2 - Id do produto: ${idsProdutos}`);
                    console.log(`AtualizaEstoque2 - Índice: ${indice}`);
                    console.log(`AtualizaEstoque2 - Novo Saldo: ${novoSaldo}`);
                    console.log(`AtualizaEstoque2 - Data: ${dataStr}`);
                    console.log('UPDATE executado com sucesso. Linhas afetadas:', result.rowsAffected);
    
                    // Após o UPDATE, faz uma consulta para obter o novo valor do estoque atualizado
                    transaction.executeSql(
                        `SELECT estoque_atual FROM estoque WHERE id_produto = ?`,
                        [idsProdutos[indice]],
                        (_, { rows }) => {
                            if (rows.length > 0) {
                                const novoEstoque = rows.item(0).estoque_atual;
                                console.log(`Novo estoque atualizado: ${novoEstoque}`);
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
    const consultaEstoquePromise = (idsProdutos, indice, dataAtualizacao, cont) => {
        return new Promise((resolve, reject) => {
            db.transaction((transaction) => {
                transaction.executeSql(
                    `SELECT estoque_atual FROM estoque WHERE id_produto = ?;`,
                    [idsProdutos[indice]],
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



    const formatDate = (date) => {
        if (!date || !(date instanceof Date)) {
            return ''; // Retorna uma string vazia se a data não for válida
        }
    
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        //console.log('\n');
        //console.log(`formatdate: ${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

    };
    

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };


/*
export default function AtualizarEstoqueRelatorio() {
    const atualizarEstoqueSemanal = () => {
        const datasAtualizacao = [
            '2024-04-05T09:00:00.000Z',
            '2024-04-10T09:00:00.000Z',
            '2024-04-15T09:00:00.000Z',
            '2024-04-20T09:00:00.000Z',
            '2024-04-25T09:00:00.000Z',
            '2024-04-30T09:00:00.000Z',
        ];

        db.transaction((transaction) => {
            transaction.executeSql(
                `SELECT id_produto FROM produtos;`,
                [],
                (_, { rows }) => {
                    const idsProdutos = [];
                    for (let i = 0; i < rows.length; i++) {
                        idsProdutos.push(rows.item(i).id_produto);
                    }

                    // Chama a função de atualização para cada produto
                    idsProdutos.forEach((idProduto) => {
                        atualizarEstoqueProdutos(transaction, idProduto, datasAtualizacao);
                    });
                },
                (_, error) => {
                    console.log('Erro ao consultar IDs de produtos:', error);
                }
            );
        });
    };

    const atualizarEstoqueProdutos = (transaction, idProduto, datasAtualizacao) => {
        datasAtualizacao.forEach((dataStr) => {
            const dataAtualizacao = new Date(dataStr);
            const adicionar = dataAtualizacao.getDate() % 10 === 5;

            atualizarSaldoEstoque(transaction, idProduto, dataAtualizacao, adicionar);
        });

    };

    const atualizarSaldoEstoque = (transaction, idProduto, dataAtualizacao, adicionar) => {
        transaction.executeSql(
            `SELECT estoque_atual FROM estoque WHERE id_produto = ?;`,
            [idProduto],
            (_, { rows }) => {
                if (rows.length > 0) {
                    let saldoEstoque = rows.item(0).estoque_atual; // Obter o saldo atual do estoque

                    const quantidade = adicionar ? getRandomInt(20, 30) : -getRandomInt(1, 10);
                    let novoSaldo = saldoEstoque + quantidade;

                    // Verificar se o novo saldo é menor que zero
                    if (novoSaldo < 0) {
                        novoSaldo = 0; // Manter o saldo mínimo como zero
                    }

                    // Insere movimentação na tabela entrada_saida
                    transaction.executeSql(
                        `INSERT INTO entrada_saida (id_produto, quantidade, data_atualizacao, estoque_atual) 
                        VALUES (?, ?, ?, ?);`,
                        [idProduto, quantidade, formatDate(dataAtualizacao), novoSaldo],
                        () => {
                            // Atualiza o saldo na tabela estoque
                            transaction.executeSql(
                                `UPDATE estoque SET estoque_atual = ?, data_atualizacao_estoque = ? WHERE id_produto = ?`,
                                [novoSaldo, formatDate(dataAtualizacao), idProduto],
                                () => {
                                    // Saldo atualizado com sucesso
                                },
                                (_, error) => {
                                    console.log('Erro ao atualizar estoque:', error);
                                }
                            );
                        },
                        (_, error) => {
                            console.log('Erro ao inserir movimentação:', error);
                        }
                    );
                } else {
                    console.log('Nenhum resultado encontrado para este id de produto.');
                }
            },
            (_, error) => {
                console.log('Erro ao consultar estoque atual:', error);
            }
        );
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

*/
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
