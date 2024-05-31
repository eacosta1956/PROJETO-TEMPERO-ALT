import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/telas/Home.js';
import { criaTabelas } from './src/database/CriaTabelas.js';

import ApagarDados from './src/telas/ApagarDados.js';
import AtualizarEstoque from './src/telas/AtualizarEstoque.js';
import CadastrarProduto from './src/telas/CadastrarProduto.js';
import EditarProduto from './src/telas/EditarProduto.js';
import ExcluirProduto from './src/telas/ExcluirProduto.js';
import GerarRelatorios from './src/telas/GerarRelatorios.js';
import ListarProdutos from './src/telas/ListarProdutos.js';
import RelatorioEntradasSaidas from './src/telas/RelatorioEntradasSaidas';
import RelatorioDespesas from './src/telas/RelatorioDespesas';
import RelatorioLucro from './src/telas/RelatorioLucro';

// Configuração da navegação
const Stack = createStackNavigator();

// Função principal
export default function App() {
  // Cria as tabelas no banco de dados ao iniciar o aplicativo
  React.useEffect(() => {
    criaTabelas();
  }, []);

  // Retorno da função principal
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#e3731b',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: 'Controle de Estoque' }} />
        <Stack.Screen name="ApagarDados" component={ApagarDados} options={{ title: 'Apagar Dados'}} />
        <Stack.Screen name="AtualizarEstoque" component={AtualizarEstoque} options={{ title: 'Atualizar Estoque'}}/>
        <Stack.Screen name="CadastrarProduto" component={CadastrarProduto} options={{ title: 'Cadastrar Produto'}} />
        <Stack.Screen name="EditarProduto" component={EditarProduto} options={{ title: 'Editar Produto'}} />
        <Stack.Screen name="ExcluirProduto" component={ExcluirProduto} options={{ title: 'Excluir Produto'}}/>
        <Stack.Screen name="GerarRelatorios" component={GerarRelatorios} options={{ title: 'Gerar Relatórios'}}/>
        <Stack.Screen name="ListarProdutos" component={ListarProdutos} options={{ title: 'Produtos Cadastrados' }} />
        <Stack.Screen name="RelatorioEntradasSaidas" component={RelatorioEntradasSaidas} options={{ title: 'Relatório de Entrada e Saída'}} />
        <Stack.Screen name="RelatorioDespesas" component={RelatorioDespesas} options={{ title: 'Relatório de Despesas'}} />
        <Stack.Screen name="RelatorioLucro" component={RelatorioLucro} options={{ title: 'Relatório de Lucro'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
