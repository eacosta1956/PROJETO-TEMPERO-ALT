import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { consultarTodasTabelas  } from '../database/DBUtils';

export default function ExibirDadosTabelas() {
  useEffect(() => {
    consultarTodasTabelas((resultados) => {
      if (resultados.every((tabela) => tabela.length === 0)) {
        console.log('Nenhum dado encontrado nas tabelas.');
        return;
      }
      
      console.log('=== Tabela produtos ===');
      console.table(resultados[0]); // Exibe os resultados da tabela produtos em formato de tabela
      console.log('\n'); // Pula uma linha antes da próxima tabela

      console.log('=== Tabela entrada_saida ===');
      console.table(resultados[1]); // Exibe os resultados da tabela entrada_saida em formato de tabela
      console.log('\n'); // Pula uma linha antes da próxima tabela

      console.log('=== Tabela estoque_atual ===');
      console.table(resultados[2]); // Exibe os resultados da tabela estoque_atual em formato de tabela
    });
  }, []);

  return (
    <View>
      <Text>Verifique o terminal para os dados das tabelas</Text>
    </View>
  );
}
