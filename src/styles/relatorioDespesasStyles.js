import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe58b',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
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
        marginBottom: 10,
        textAlign: 'center',
    },
    scrollViewContainer: {
        paddingBottom: 20,
    },
    sectionContainer: {
        marginTop: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemContainer: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 14,
    },
    productName: {
        fontWeight: 'bold',
    },
    totalsContainer: {
        marginTop: 10,
    },
    line: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 1,
    },
    totalHeader: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 14,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
});
