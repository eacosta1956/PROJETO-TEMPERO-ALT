// Home.js
import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import styles from '../styles/homeStyles';

export default function Home({ navigation }) {
  return (
    
    <View style={styles.container}>

      {/* Botões de ação para as funcionalidades */}
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        
        {/* Botão para navegar para a tela de Listar Produtos */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListarProdutos')}>
          <View style={styles.buttonContent}>
            
            {/* Ícone e texto do botão */}
            <Image source={require('../assets/ListaRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Listar Produtos</Text>
          </View>
        </TouchableOpacity>
        
        {/* Botão para navegar para a tela de Cadastrar Produto */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastrarProduto')}>
          <View style={styles.buttonContent}>
            
            {/* Ícone e texto do botão */}
            <Image source={require('../assets/CadastrarRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cadastrar Produto</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Segunda linha de botões */}
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        
        {/* Botão para navegar para a tela de Gerar Relatórios */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GerarRelatorios')}>
          <View style={styles.buttonContent}>
            
            {/* Ícone e texto do botão */}
            <Image source={require('../assets/ReportRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Gerar Relatórios</Text>
          </View>
        </TouchableOpacity>
        
        {/* Botão para navegar para a tela de Apagar Dados */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ApagarDados')}>
          <View style={styles.buttonContent}>
            
            {/* Ícone e texto do botão */}
            <Image source={require('../assets/LimparBancoRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Apagar Dados</Text>
          </View>
        </TouchableOpacity>
        
      </View>

    </View>
  );
}
