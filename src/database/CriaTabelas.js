import { db } from "./AbreConexao"
import * as SQLite from 'expo-sqlite';


// Função responsável por criar as tabelas no banco de dados
// ---------------------------------------------------------
export function criaTabelas() {

    // Cria a tabela produtos
    // ----------------------
    db.transaction((transaction) => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS produtos (
            id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_produto TEXT UNIQUE,
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

    // Cria a tabela entrada_saida
    // ---------------------------
    db.transaction(transaction => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS entrada_saida (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produto INTEGER,
            quantidade INTEGER,
            data_atualizacao TEXT,
            estoque_atual INTEGER,
            FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
        );`,
        [],
        () => console.log('Tabela entrada_saida criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela entrada_saida: ' + error)
        );
    });

     // Cria a tabela estoque
     // ---------------------------
     db.transaction(transaction => {
        transaction.executeSql(`CREATE TABLE IF NOT EXISTS estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_produto INTEGER,
            estoque_atual INTEGER,
            data_atualizacao_estoque TEXT,
            FOREIGN KEY (id_produto) REFERENCES entrada_saida(id_produto)
        );`,
        [],
        () => console.log('Tabela estoque criada com sucesso.'),
        (_, error) => console.log('Erro ao criar tabela estoque atual: ' + error)
        );
    });
};

/*
    // exclui tabelas
    // --------------
    // Abre o banco de dados
    const db = SQLite.openDatabase('ControlEstoque3.db');

    // Função para excluir as tabelas
    const excluirTabelas = () => {
    db.transaction((transaction) => {
        transaction.executeSql(
        "DROP TABLE IF EXISTS nova_tabela;",
        [],
        (_, { rowsAffected }) => {
            console.log(`Tabela 'nova_tabela' excluída com sucesso. Linhas afetadas: ${rowsAffected}`);
        },
        (_, error) => {
            console.log('Erro ao excluir tabela nova_tabela:', error);
        }
        );

        transaction.executeSql(
        "DROP TABLE IF EXISTS tabelaestoque;",
        [],
        (_, { rowsAffected }) => {
            console.log(`Tabela 'tabelaestoque' excluída com sucesso. Linhas afetadas: ${rowsAffected}`);
        },
        (_, error) => {
            console.log('Erro ao excluir tabela tabelaestoque:', error);
        }
        );

        transaction.executeSql(
        "DROP TABLE IF EXISTS estoque_atual;",
        [],
        (_, { rowsAffected }) => {
            console.log(`Tabela 'estoque_atual' excluída com sucesso. Linhas afetadas: ${rowsAffected}`);
        },
        (_, error) => {
            console.log('Erro ao excluir tabela estoque_atual:', error);
        }
        );
    });
    };
    // Chamada da função para excluir as tabelas
    excluirTabelas();
*/


/*
    // Mostra a estrutura de uma tabela
    // --------------------------------
    db.transaction((transaction) => {
        transaction.executeSql(
        `SELECT sql FROM sqlite_master WHERE type='table' AND name='estoque';`,
        [],
        (_, { rows }) => {
            if (rows.length > 0) {
            console.log('Estrutura da tabela estoque:');
            console.log(rows.item(0).sql);
            } else {
            console.log('Tabela não encontrada ou vazia.');
            }
        },
        (_, error) => {
            console.log('Erro ao consultar estrutura da tabela:', error);
        }
        );
    });
    //*/  

    /*
    // Mostrar tabelas criadas
    // -----------------------
    db.transaction((transaction) => {
        transaction.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
          [],
          (_, { rows }) => {
            if (rows.length > 0) {
              console.log('Tabelas encontradas:');
              rows._array.forEach((table) => {
                console.log(table.name);
              });
            } else {
              console.log('Nenhuma tabela encontrada no banco de dados.');
            }
          },
          (_, error) => {
            console.log('Erro ao consultar tabelas:', error);
          }
        );
      });
      */
      
