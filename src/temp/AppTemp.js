import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../telas/HomeTemp.js';
import { criaTabelas } from '../database/CriaTabelas.js';

import AtualizarEstoque from '../telas/AtualizarEstoque.js';
import CadastrarProduto from '../telas/CadastrarProduto.js';
import EditarProduto from '../telas/EditarProduto.js';
import ExcluirProduto from '../telas/ExcluirProduto.js';
import GerarRelatorios from '../telas/GerarRelatorios.js';
import ListarProdutos from '../telas/ListarProdutos.js';

import CadastrarProdutosRelatorio from './CadastrarProdutosRelatorio.js';
import AtualizarEstoqueRelatorio from './AtualizarEstoqueRelatorio.js';
import ListarMovimentacoesModal from './ListarMovimentacoesModal.js';


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
      <Stack.Navigator initialRouteName="HomeTemp">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AtualizarEstoque" component={AtualizarEstoque} />
        <Stack.Screen name="CadastrarProduto" component={CadastrarProduto} />
        <Stack.Screen name="EditarProduto" component={EditarProduto} />
        <Stack.Screen name="ExcluirProduto" component={ExcluirProduto} />
        <Stack.Screen name="GerarRelatorios" component={GerarRelatorios} />
        <Stack.Screen name="ListarProdutos" component={ListarProdutos} />

        {/* ======================================================== */}

        <Stack.Screen name="AtualizarEstoqueRelatorio" component={AtualizarEstoqueRelatorio} />
        <Stack.Screen name="CadastrarProdutosRelatorio" component={CadastrarProdutosRelatorio} />
        <Stack.Screen name="ListarMovimentacoesModal" component={ListarMovimentacoesModal} />





      </Stack.Navigator>
    </NavigationContainer>
  );
}

