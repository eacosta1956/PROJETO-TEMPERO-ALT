import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe58b',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '95%',
    },


    // Estilos para o botão e o modal
    button: {
        width: 360,
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 10,
        marginBottom: 20,
        height: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
      input: {
        width: 200,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlign: 'center', // Centraliza o texto horizontalmente
        textAlignVertical: 'center', // Centraliza o texto verticalmente
    },
    
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    itemContainer: {
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#d6301d',
        borderRadius: 5,
        alignItems: 'center',
    },
    periodSeparator: {
        marginBottom: 10,
    },
    productName: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    periodText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 35,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'normal', // Pode ajustar o peso da fonte conforme necessário
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeaderText:{
        fontWeight: 'bold',
    },
    sectionContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    itemText: {
        fontSize: 16,
    },
    line: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5,
    },
    spacer: {
        height: 20,
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
    separator: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 3,
    },  
});

