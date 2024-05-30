import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
//import { consultarTodasTabelas  } from '../database/ConsultarTabelas';
import { db } from '../database/AbreConexao'; 

export default function ConsultarBanco() {
  useEffect(() => {
    consultarTodasTabelas((resultados) => {
      if (resultados.every((tabela) => tabela.length === 0)) {
        console.log('Nenhum dado encontrado nas tabelas.');
        return;
      }
      console.log('\n');
      console.log('\n');
      console.log('\n');
      console.log('=== Tabela produtos ===');
      console.log('\n');
      console.table(resultados[0]); // Exibe os resultados da tabela produtos em formato de tabela
      console.log('\n'); // Pula uma linha antes da próxima tabela

      console.log('=== Tabela entrada_saida ===');
      console.log('\n');
      console.table(resultados[1]); // Exibe os resultados da tabela entrada_saida em formato de tabela
      console.log('\n'); // Pula uma linha antes da próxima tabela

      console.log('=== Tabela estoque ===');
      console.log('\n');
      console.table(resultados[2]); // Exibe os resultados da tabela estoque_atual em formato de tabela
    });
  }, []);

  const consultarTodasTabelas = () => {

    db.transaction((transaction) => {
      const consultas = [
        'SELECT * FROM produtos;',
        'SELECT * FROM entrada_saida;',
        'SELECT * FROM estoque;'
      ];
  
      function executarConsulta(indiceConsulta) {
        const consultaAtual = consultas[indiceConsulta];
        console.log('\n');
        console.log('\n');
        
        console.log('\n');
        console.log(`Executando consulta: ${consultaAtual}`);
        console.log('\n');
        
        transaction.executeSql(
          consultaAtual,
          [],
          (_, { rows }) => {
            const resultados = rows._array;
  
            // Imprimir os resultados da consulta atual em linhas e colunas
            console.log(`=== Resultados da consulta ${indiceConsulta} ===`);
            console.log('\n');
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

  return (
    <View>
      <Text>Verifique o terminal para os dados das tabelas</Text>
    </View>
  );
}
