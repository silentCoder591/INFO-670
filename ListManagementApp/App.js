import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Add Item </Text>

      <TextInput defaultValue='Add Item' />
      <Button title='+' onPress={() => console.log("Item Added")} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
