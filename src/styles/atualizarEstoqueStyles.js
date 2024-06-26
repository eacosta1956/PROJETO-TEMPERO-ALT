import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffe58b',
    },
    input_qtde: {
      width: '80%',
      marginTop: 30,
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderRadius: 5,
    },
    input_modal: {
      width: '60%',
      backgroundColor: 'white',
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
      backgroundColor: '#E5B924',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#aaa',
      padding: 35,
      alignItems: 'center',
      width: '90%', 
      alignSelf: 'center', 
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
      backgroundColor: '#4e6f35',
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      width: 100,  
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      fontWeight:'bold',
      textAlign: 'center',
      fontSize: 15,
      marginBottom: 10,
    }
    
  });
  


