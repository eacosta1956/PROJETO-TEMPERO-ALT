import { db } from "./AbreConexao";
import * as SQLite from 'expo-sqlite';

// Função responsável por criar as tabelas no banco de dados
// ---------------------------------------------------------
export function criaTabelas() {

    // Cria a tabela produtos
    // ----------------------
    db.transaction((transaction) => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS produtos (
            id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_produto TEXT,
            tipo_produto TEXT,
            data_cadastro TEXT,
            estoque_minimo INTEGER
        );`,
        [],
        () => console.log('Tabela produtos criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela produtos: ' + error)
        );
    });

    // Cria a tabela entrada_saida
    // ---------------------------
    db.transaction(transaction => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS entrada_saida (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produto INTEGER,
            quantidade INTEGER,
            data_atualizacao TEXT,
            estoque_atual INTEGER,
            preco_compra REAL,
            preco_venda REAL,
            FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
        );`,
        [],
        () => console.log('Tabela entrada_saida criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela entrada_saida: ' + error)
        );
    });

    // Cria a tabela estoque
    // ---------------------
    db.transaction(transaction => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produto INTEGER,
            estoque_atual INTEGER,
            data_atualizacao_estoque TEXT,
            ultimo_preco_compra REAL,
            ultimo_preco_venda REAL,
            FOREIGN KEY (id_produto) REFERENCES entrada_saida(id_produto)
        );`,
        [],
        () => console.log('Tabela estoque criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela estoque: ' + error)
        );
    });
    
};