import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/telas/Home';
import CadastrarProduto from './src/telas/CadastrarProduto';
import EditarProduto from './src/telas/EditarProduto';
import ListarProdutos from './src/telas/ListarProdutos';
import AtualizarEstoque from './src/telas/AtualizarEstoque';
import ExcluirProduto from './src/telas/ExcluirProduto';
import GerarRelatorios from './src/telas/GerarRelatorios';
import ConsultarBanco from './src/telas/ConsultarBanco';
import { criaTabelas } from './src/database/CriaTabelas';

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
        <Stack.Screen name="CadastrarProduto" component={CadastrarProduto} />
        <Stack.Screen name="EditarProduto" component={EditarProduto} />
        <Stack.Screen name="ListarProdutos" component={ListarProdutos} />
        <Stack.Screen name="AtualizarEstoque" component={AtualizarEstoque} />
        <Stack.Screen name="ExcluirProduto" component={ExcluirProduto} />
        <Stack.Screen name="GerarRelatorios" component={GerarRelatorios} />
        <Stack.Screen name="ConsultarBanco" component={ConsultarBanco} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

