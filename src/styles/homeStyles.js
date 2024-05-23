// homeStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe58b',
    paddingHorizontal: 16,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
    marginTop: 50,
  },
  button: {
    margin: 10,
    padding: 20,
    backgroundColor: '#d20d0e',
    borderRadius: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    resizeMode: 'contain',
    width: 80, 
    height: 80, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10, 
  },
});
