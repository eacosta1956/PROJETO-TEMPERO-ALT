import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  opcoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  opcaoButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    height: 40,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  opcaoText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 18,
  },
  opcaoSelecionadaText: {
    color: '#fff',
  },
  inputText: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  filtrarButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filtrarButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  filtroSelecionado: {
    backgroundColor: '#3498db',
  },
  filtroSelecionadoText: {
    color: '#fff',
  },
  limparButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    //paddingVertical: 1,
    paddingHorizontal: 20,
    height: 40,
    borderWidth: 1,
  },
  limparButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 12,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  nomeProduto: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonAtualizar: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  buttonEditar: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  buttonExcluir: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },

});
