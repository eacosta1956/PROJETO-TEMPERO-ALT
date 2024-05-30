import { db } from "./SQLite" // Importe o banco de dados SQLite

export function consultarTodasTabelas() {
    db.transaction((transaction) => {
      const consultas = [
        'SELECT * FROM produtos;',
        'SELECT * FROM entrada_saida;',
        'SELECT * FROM estoque_atual;'
      ];
  
      function executarConsulta(indiceConsulta) {
        const consultaAtual = consultas[indiceConsulta];
        console.log(`Executando consulta: ${consultaAtual}`);
  
        transaction.executeSql(
          consultaAtual,
          [],
          (_, { rows }) => {
            const resultados = rows._array;
  
            // Imprimir os resultados da consulta atual em linhas e colunas
            console.log(`=== Resultados da consulta ${indiceConsulta} ===`);
            resultados.forEach((resultado, index) => {
              console.log(`Registro ${index + 1}:`);
              Object.keys(resultado).forEach((key) => {
                console.log(`${key}: ${resultado[key]}`);
              });
              console.log(); // Adicionar uma linha em branco após cada registro
            });
  
            // Imprimir uma linha em branco após os resultados, exceto para a última consulta
            if (indiceConsulta < consultas.length - 1) {
              console.log(); // Adicionar uma linha em branco
            }
  
            // Se houver mais consultas, executar a próxima
            if (indiceConsulta < consultas.length - 1) {
              executarConsulta(indiceConsulta + 1);
            }
          },
          (_, error) => {
            console.log(`Erro ao executar consulta: ${consultaAtual}`, error);
          }
        );
      }
  
      executarConsulta(0); // Começa a executar as consultas
    });
  }