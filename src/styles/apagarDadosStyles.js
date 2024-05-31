import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffe58b',
        padding: 20,
    },
    topContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    periodText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        alignItems: 'center',
        width: '80%',
    },
    buttonAtivado: {
        backgroundColor: '#8B0000',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '95%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    yesButton: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButton: {
        flex: 1,
        marginLeft: 10,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
        alignItems: 'center',
    },

});
