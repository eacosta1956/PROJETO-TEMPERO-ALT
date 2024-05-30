import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { db } from '../database/AbreConexao';

const ConsultarEstruturaTabelas = () => {
  useEffect(() => {
    consultaEstruturaTabela();
  }, []);

  const consultaEstruturaTabela = () => {
    db.transaction(transaction => {
      transaction.executeSql(
        `PRAGMA table_info(produtos);`,
        [],
        (_, result) => {
          console.log('\n');
          console.log('Estrutura da tabela produtos:');
          result.rows._array.forEach(column => {
            console.log(`Column name: ${column.name}, Type: ${column.type}`);
          });
        },
        (_, error) => {
          console.log('Erro ao consultar estrutura da tabela produtos:', error);
        }
      );
    });
  };


    db.transaction(transaction => {
      transaction.executeSql(
        `PRAGMA table_info(entrada_saida);`,
        [],
        (_, result) => {
          console.log('\n');
          console.log('Estrutura da tabela entrada_saida:');
          result.rows._array.forEach(column => {
            console.log(`Column name: ${column.name}, Type: ${column.type}`);
          });
        },
        (_, error) => {
          console.log('Erro ao consultar estrutura da tabela entrada_saida:', error);
        }
      );
    });



    db.transaction(transaction => {
      transaction.executeSql(
        `PRAGMA table_info(estoque);`,
        [],
        (_, result) => {
          console.log('\n');
          console.log('Estrutura da tabela estoque:');
          result.rows._array.forEach(column => {
            console.log(`Column name: ${column.name}, Type: ${column.type}`);
          });
        },
        (_, error) => {
          console.log('Erro ao consultar estrutura da tabela estoque:', error);
        }
      );
    });


  return (
    <View>
      <Text>Consulta Estrutura Tabela</Text>
    </View>
  );
};

export default ConsultarEstruturaTabelas;
