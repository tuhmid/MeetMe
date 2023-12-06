import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    //general style
   container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
    //header style
  header: {
    height: 60,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
  },
  //form style
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inputBox: {
    height: 40,
    width: 40,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  //invitee list style
  inviteesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inviteeItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },

  // Add more styles as needed
});

export default styles;