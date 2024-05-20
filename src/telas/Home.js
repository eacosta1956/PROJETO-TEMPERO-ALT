// Home.js
import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import styles from '../styles/homeStyles';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListarProdutos')}>
          <View style={styles.buttonContent}>
            <Image source={require('../assets/ListaRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Listar Produtos</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastrarProduto')}>
          <View style={styles.buttonContent}>
            <Image source={require('../assets/CadastrarRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cadastrar Produto</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GerarRelatorios')}>
          <View style={styles.buttonContent}>
            <Image source={require('../assets/ReportRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Gerar Relatórios</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ApagarDados')}>
          <View style={styles.buttonContent}>
            <Image source={require('../assets/LimparBancoRender.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Apagar Dados</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
