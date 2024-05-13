import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingTop: 10,
    marginLeft: 20,
  },

  opcaoButtonEstMin: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 1,
    height: 40,
    width: '95%',
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  opcaoTextEstMin: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 14,
  },
  opcaoSelecionadaText: {
    color: '#fff',
  },
  filtroSelecionado: {
    backgroundColor: '#3498db',
  },


  opcoesContainerNomeProduto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    width: '95%',
  },
  opcoesContainerTipoProduto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    width: '95%',
  },
  inputText: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  limparButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
    paddingHorizontal: 20,
    height: 40,
    borderWidth: 1,
    witdh: '20%',
  },
  limparButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 12,
  },


  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 1,
    borderRadius: 10,
    marginBottom: 1,
    width: '95%',
  },
  nomeProduto: {
    fontWeight: 'bold',
  },


  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    width: '95%',
  },
  buttonAtualizar: {
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 5,
    width: '31%',
    alignItems: 'center',
  },
  buttonEditar: {
    padding: 5,
    backgroundColor: 'blue',
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  buttonExcluir: {
    padding: 5,
    backgroundColor: '#8B0000',
    borderRadius: 5,
    width: '30%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
