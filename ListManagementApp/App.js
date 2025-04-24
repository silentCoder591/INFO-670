import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground, FlatList, Alert } from 'react-native';


export default function App() {

  const [movieTitle, setMovieTitle] = useState('');
  const [movies, setMovies] = useState([]);

  const handleAddMovie = () => {
    if (movieTitle.trim() !== '') {
      setMovies([...movies, { title: movieTitle }]);
      setMovieTitle('');
    }
    else {
      Alert.alert('Error', 'Please enter a movie title', [{ text: 'OK' }]);
      console.log("Error - No movie")
      
    }
  
  };

  const handleClearList = () => {
    setMovies([]);
    Alert.alert('Success', 'Movie List cleared',[{text:'OK'}])
  };

  return (
    <View style={styles.container}>

      <ImageBackground
        source={require('./assets/images/background.jpg')} 
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover">
   
        <View style={{ flex: 1 }}></View>
          {/* App Name */}
          <View style={styles.appNameContainer}>
            <Text style={styles.appName}>Movie Manager</Text>
          </View>

          {/* Add/Clear Movie Container */}
          <View style={styles.addButtonContainer}> 

            <TextInput
              style={styles.textInput}
              value={movieTitle}
              onChangeText={(text) => setMovieTitle(text)}
              placeholder="Enter movies to watch"
            />
            
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginRight: 10 }}>
                <Button title="Add Movie" color="#fff" onPress={handleAddMovie} />
              </View>
              <Button title="Clear List" color="#fff" onPress={handleClearList} />
            </View>
          </View>

          {/* Movie List */}
          <View style={{ flex: 6, marginTop:20 }}>
            <Text style={{ fontSize: 20, fontWeight:'bold', marginBottom: 10, marginLeft:10, color:'#fff' }}>
              Movies to Watch List:
            </Text>
            <FlatList
              data={movies}
              renderItem={({ item }) => (
                <View style={styles.movieItem}>
                  <Text style={styles.movieTitle}>{item.title}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

      </ImageBackground>
       <StatusBar style="auto" />
     </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign:'center',
    marginTop: -20,
  },
  movieItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginLeft: 10,
  },
  movieTitle: {
    fontSize: 18,
    color: '#fff',
    justifyContent:'center',
    alignItems:'center',
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-60,
    
  },
  appNameContainer:{
    flex: 1,
    marginTop: -20,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});
