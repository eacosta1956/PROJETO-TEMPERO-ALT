import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffe58b',
    },
    button: {
      width: '80%',
      marginTop: 30,
      padding: 10,
      backgroundColor: 'red',
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
      backgroundColor: '#E5B924',
      borderRadius: 10,
      padding: 35,
      alignItems: 'center',
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 15,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 20,
    },
    buttonModal: {
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      backgroundColor: 'green',
    },
    buttonModalCancel: {
      backgroundColor: 'red',
    },
  });