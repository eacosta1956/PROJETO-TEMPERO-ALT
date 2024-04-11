import { db } from "./SQLite"

export function criaTabelas() {
    // Criar a tabela produtos 
    db.transaction((transaction) => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS produtos (
            id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_produto TEXT,
            volume_ou_peso REAL,
            unidade_medida TEXT,
            data_cadastro TEXT,
            tipo_produto TEXT,
            estoque_seguranca INTEGER,
            estoque_minimo INTEGER
        );`,
        [],
        () => console.log('Tabela produtos criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela produtos: ' + error)
        );
    });

    // Criar a tabela entrada_saida
    db.transaction(transaction => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS entrada_saida (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produto INTEGER,
            quantidade INTEGER,
            data TEXT,
            estoque_atual INTEGER,
            FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
        );`,
        [],
        () => console.log('Tabela entrada_saida criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela entrada_saida: ' + error)
        );
    });

     // Criar a tabela entrada_saida
     db.transaction(transaction => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS estoque_atual (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produto INTEGER,
            estoque_atual INTEGER,
            data TEXT,
            FOREIGN KEY (id_produto) REFERENCES entrada_saida(id_produto)
        );`,
        [],
        () => console.log('Tabela estoque atual criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela estoque atual: ' + error)
        );
    });
};