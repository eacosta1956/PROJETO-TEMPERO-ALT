import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../telas/Home';
import { criaTabelas } from '../database/CriaTabelas';

import AtualizarEstoque from '../telas/AtualizarEstoque';
import CadastrarProduto from '../telas/CadastrarProduto';
import EditarProduto from '../telas/EditarProduto';
import ExcluirProduto from '../telas/ExcluirProduto';
import GerarRelatorios from '../telas/GerarRelatorios';
import ListarProdutos from '../telas/ListarProdutos';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

