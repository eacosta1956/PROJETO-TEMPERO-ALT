import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#ffe58b',
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
    backgroundColor: '#fff'
  },
  input2: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  scrollView: {
    maxHeight: 150,
    minHeight: 130,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
  },
  radioButton1: {
    width: '32%', 
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#4e6f35',
    marginRight: '2%', 
  },
  radioButton2: {
    width: '32%', 
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#4e6f35',
    marginRight: '2%',
  },
  radioButtonSelected: {
    backgroundColor: '#403817',
  },
  radioText: {
    color: '#fff',
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
    backgroundColor: '#4e6f35',
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '0,0,0',
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
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
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

});
