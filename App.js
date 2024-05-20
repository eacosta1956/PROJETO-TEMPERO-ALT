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
// -------------------------
const Stack = createStackNavigator();

// Função principal
// ----------------
export default function App() {
  // Cria as tabelas no banco de dados ao iniciar o aplicativo
  // ---------------------------------------------------------
  React.useEffect(() => {
    criaTabelas();
  }, []);


  // Retorno da função principal
  // Esse trecho de código está configurando a navegação do
  // aplicativo usando o React Navigation
  // ------------------------------------------------------
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ApagarDados" component={ApagarDados} />
        <Stack.Screen name="AtualizarEstoque" component={AtualizarEstoque} />
        <Stack.Screen name="CadastrarProduto" component={CadastrarProduto} />
        <Stack.Screen name="EditarProduto" component={EditarProduto} />
        <Stack.Screen name="ExcluirProduto" component={ExcluirProduto} />
        <Stack.Screen name="GerarRelatorios" component={GerarRelatorios} />
        <Stack.Screen name="ListarProdutos" component={ListarProdutos} />

        <Stack.Screen name="RelatorioEntradasSaidas" component={RelatorioEntradasSaidas} />
        <Stack.Screen name="RelatorioDespesas" component={RelatorioDespesas} />
        <Stack.Screen name="RelatorioLucro" component={RelatorioLucro} />

        {/* ======================================================== */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}