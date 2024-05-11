import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import { db } from '../database/AbreConexao';

export default function ListarMovimentacoesModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);

  const consultarTodasTabelas = () => {
    db.transaction((transaction) => {
      const consultas = [
        'SELECT * FROM produtos;',
        'SELECT * FROM entrada_saida;',
        'SELECT * FROM estoque;'
      ];

      const tempData = [];

      function executarConsulta(indiceConsulta) {
        const consultaAtual = consultas[indiceConsulta];
        
        transaction.executeSql(
          consultaAtual,
          [],
          (_, { rows }) => {
            const resultados = rows._array;
            tempData.push({ consulta: consultaAtual, resultados });

            if (indiceConsulta < consultas.length - 1) {
              executarConsulta(indiceConsulta + 1);
            } else {
              setTableData([...tempData]);
              setModalVisible(true);
            }
          },
          (_, error) => {
            console.log(`Erro ao executar consulta: ${consultaAtual}`, error);
          }
        );
      }

      executarConsulta(0);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={consultarTodasTabelas}>
        <Text style={styles.buttonText}>Consultar Tabelas</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {tableData.map((item, index) => (
              <View key={index} style={styles.tableContainer}>
                <Text style={styles.queryText}>Consulta: {item.consulta}</Text>
                {item.resultados.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.rowContainer}>
                    {Object.keys(row).map((key, keyIndex) => (
                      <Text key={keyIndex}>{key}: {row[key]}</Text>
                    ))}
                  </View>
                ))}
                <View style={styles.emptySpace} />
              </View>
            ))}
          </ScrollView>
          <Button title="Fechar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  tableContainer: {
    marginBottom: 20,
  },
  queryText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rowContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  emptySpace: {
    height: 600, // Espaço em branco de 20 unidades
  },
});
