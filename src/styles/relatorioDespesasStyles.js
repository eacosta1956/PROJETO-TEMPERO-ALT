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
        marginBottom: 10,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
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
    
    itemContainer: {
        marginVertical: 5,
    },
    totalHeader: {
        fontSize: 16,
    },
    totalAmount: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#d6301d',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },

    itemText: {
        fontSize: 16,
    },
    productName: {
        fontWeight: 'bold',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    

    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 10,
        width: '100%',
    },
    spacer: {
        height: 20,
    },
    errorMessage: {
        color: 'red',
        marginTop: 10,
    },
});
