import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 10,
        width: '90%',
        maxHeight: '95%',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20, // Ajuste o valor para mover mais para cima
    },
    dateText: {
        fontSize: 16,
        marginBottom: 20,
    },
    itemContainer: {
        marginVertical: 2,
    },
    totalContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        marginVertical: 3,
        // Se necessário, adicione padding ou margens adicionais aqui
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5, // Ajuste conforme necessário para o espaçamento entre as linhas
    },
    totalHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10, // Adicionar margem à direita para separação do valor
    },
    totalAmount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemText: {
        fontSize: 14,
    },
    productName: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 10, 
    },
    sortButton: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e3731b',
        borderRadius: 5,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#d6301d',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
    },
    separator: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 3,
    },    
});
