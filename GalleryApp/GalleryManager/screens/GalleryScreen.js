import React from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

// sample top‑10 movie thumbnails
const movies = [
  { id: '1', title: 'The Shawshank Redemption', thumbnail: require('../assets/images/shawshank.jpg') },
  { id: '2', title: 'The Godfather',           thumbnail: require('../assets/images/godfather.jpg') },
  { id: '3', title: 'The Dark Knight',         thumbnail: require('../assets/images/dark_knight.jpg') },
  { id: '4', title: 'Rush',         thumbnail: require('../assets/images/rush.jpg') },
  // …add up to 10
];

export default function GalleryScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Pictures', { movieId: item.id })}
    >
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <Text style={styles.caption}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Top Rated Movies</Text>
      <FlatList
        data={movies}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginLeft: 5,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  thumbnail: {
    width: (width / 2) - 20,
    height: ((width / 2) - 20) * 1.5,
    borderRadius: 8,
  },
  caption: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
  },
});
