import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: '90%',
  },
  input1: {
    width: '90%',
    marginBottom: 10,
    marginTop: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input2: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  scrollView: {
    maxHeight: 150,
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
  },
  radioButton1: {
    width: '32%', // Ajuste aqui para 32% da largura da tela, dividindo igualmente em três colunas
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
    marginRight: '2%', // Adicionando margem direita para separar os botões
  },
  radioButton2: {
    width: '32%', // Ajuste aqui para 32% da largura da tela, dividindo igualmente em três colunas
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
    marginRight: '2%', // Adicionando margem direita para separar os botões
  },
  radioButtonSelected: {
    backgroundColor: '#3498db',
  },
  radioText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
  button: {
    width: '100%',
    marginTop: 20,
    marginBottom: 50,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
