import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    input_qtde: {
      width: '80%',
      marginTop: 30,
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    input_modal: {
      width: '60%',
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    label: {
      fontSize: 14,
      //marginTop: 10,
      marginBottom: 15,
    },
    label1: {
      fontSize: 14,
      //fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
    },
    button: {
      width: '80%',
      marginTop: 20,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalCenteredView: {
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
      width: '90%', // Adicione esta linha
      alignSelf: 'center', // Adicione esta linha
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 15,
    },
    modalTitle: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,      
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      flex: 1, // Cada botão ocupa igualmente o espaço disponível
      marginHorizontal: 10, // Espaçamento entre os botões
    },
    modalButtonText: {
      textAlign: 'center',
      padding: 10,
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  