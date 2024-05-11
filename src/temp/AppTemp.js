import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/telas/Home';
import { criaTabelas } from './src/database/CriaTabelas';

import AtualizarEstoque from './src/telas/AtualizarEstoque';
import CadastrarProduto from './src/telas/CadastrarProduto';
import EditarProduto from './src/telas/EditarProduto';
import ExcluirProduto from './src/telas/ExcluirProduto';
import GerarRelatorios from './src/telas/GerarRelatorios';
import ListarProdutos from './src/telas/ListarProdutos';

import CadastrarProdutosRelatorio from './src/temp/CadastrarProdutosRelatorio';
import AtualizarEstoqueRelatorio from './src/temp/AtualizarEstoqueRelatorio.js';
import ListarMovimentacoesModal from './src/temp/ListarMovimentacoesModal';


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

