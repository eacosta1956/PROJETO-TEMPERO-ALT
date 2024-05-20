import { StyleSheet } from "react-native";

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '95%',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20, // Ajuste o valor para mover mais para cima
    },
    dateText: {
        fontSize: 16,
        marginBottom: 20,
    },
    itemContainer: {
        marginVertical: 5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    itemText: {
        fontSize: 16,
    },
    productName: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 20, 
        
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
        fontSize: 20,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
    totalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
