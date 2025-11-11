import { View, Text, StyleSheet } from 'react-native';

// "default" é importante para a importação
export default StyleSheet.create({
  // Note que todo o código de estilo foi movido para cá
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginBox:{
    width: '25%',
    height: '95%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  googleButton: {
    alignItems:'center',
    fontWeight: 'medium',
    marginBottom: 40,
    width: '70%',
    height: '6%',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 15,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
});