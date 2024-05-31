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
    marginTop: -20,
    marginBottom: 40,
    resizeMode: 'contain',

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
