import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  SafeAreaView,
  Pressable
} from 'react-native';

const { width } = Dimensions.get('window');

// Movie-specific images mapping
const movieImagesData = {
  '1': [ // Shawshank Redemption
    // { id: '1', image: require('../assets/images/shawshank.jpg') },
    { id: '1', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-1375.jpg?ssl=1'},
    { id: '2', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-1678.jpg?ssl=1'},
    { id: '3', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-3494.jpg?ssl=1'},
    { id: '4', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-4862.jpg?ssl=1'},
    { id: '5', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-6210.jpg?ssl=1'},
    { id: '6', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-6293.jpg?ssl=1'},
    { id: '7', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-8779.jpg?ssl=1'},
    { id: '8', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-8764.jpg?ssl=1'},
    { id: '9', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-10058.jpg?ssl=1'},
    { id: '10', uri: 'https://i0.wp.com/img.screencaps.us/199/4k-4-shawshank/full/shawshank4k-movie-screencaps.com-10289.jpg?ssl=1'},
    
  ],
  '2': [ // The Godfather
    { id: '1', uri: 'https://i0.wp.com/imgs.screencaps.us/197/2-godfather/full/godfather-movie-screencaps.com-359.jpg?ssl=1'},
    { id: '2', uri: 'https://i0.wp.com/imgs.screencaps.us/197/2-godfather/full/godfather-movie-screencaps.com-2003.jpg?ssl=1'},
    { id: '3', uri: 'https://i0.wp.com/imgs.screencaps.us/197/2-godfather/full/godfather-movie-screencaps.com-3453.jpg?ssl=1'},
    { id: '4', uri: 'https://i0.wp.com/imgs.screencaps.us/197/2-godfather/full/godfather-movie-screencaps.com-10575.jpg?ssl=1'},
    { id: '5', uri: 'https://i0.wp.com/imgs.screencaps.us/197/2-godfather/full/godfather-movie-screencaps.com-11728.jpg?ssl=1'},
    { iD: '6', uri: 'https://i0.wp.com/imgs.screencaps.us/197/2-godfather/full/godfather-movie-screencaps.com-20198.jpg?ssl=1'}
  ],
  '3': [ // The Dark Knight
    { id: '1', uri: 'https://i0.wp.com/img.screencaps.us/200/8-dark-knight/full/darkknight-movie-screencaps.com-63.jpg?ssl=1'},
    { id: '2', uri: 'https://i0.wp.com/img.screencaps.us/200/8-dark-knight/full/darkknight-movie-screencaps.com-373.jpg?ssl=1'},
    { id: '3', uri: 'https://i0.wp.com/img.screencaps.us/200/8-dark-knight/full/darkknight-movie-screencaps.com-1443.jpg?ssl=1'},
    { id: '4', uri: 'https://i0.wp.com/img.screencaps.us/200/8-dark-knight/full/darkknight-movie-screencaps.com-2738.jpg?ssl=1'},
    { id: '5', uri: 'https://i0.wp.com/img.screencaps.us/200/8-dark-knight/full/darkknight-movie-screencaps.com-17208.jpg?ssl=1'},
    { id: '6', uri: 'https://i0.wp.com/img.screencaps.us/200/8-dark-knight/full/darkknight-movie-screencaps.com-17018.jpg?ssl=1'},
  ],
  '4': [ // Rush
    { id: '1', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyRGk7zzHj8XCGV9q5OuqqqkDBZ_NgNjWaJw&s'},
    { id: '2', uri: 'https://media.hagerty.com/media/wp-content/uploads/uscamediasite/images/story-images/2019/05/23/rush(123)20190522204827'},
    { id: '3', uri: 'https://img.theweek.in/content/dam/week/news/entertainment/images/2019/5/23/Rush-Poster.jpg'},
    { id: '4', uri: 'https://www.topgear.com/sites/default/files/images/gallery-migration/2013-09/7515431C-D5B3-4414-A317-2CA46201DB21.jpg'},
    
  ],
};

export default function PicturesScreen({ route, navigation }) {
  // Check if route.params exists before accessing movieId
  const movieId = route.params?.movieId;
  const [selectedImage, setSelectedImage] = useState(null);

  // If no movieId is provided, show a message
  if (!movieId) {
    return (
      <View style={styles.container}>
        <Text style={styles.noImagesText}>Please select a movie from the Gallery to view its pictures</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Gallery')}
        >
          <Text style={styles.buttonText}>Go to Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get images for the specific movie
  const moviePictures = movieImagesData[movieId] || [];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => setSelectedImage(item.uri ? { uri: item.uri } : item.image)}
    >
      <Image 
        source={item.uri ? { uri: item.uri } : item.image} 
        style={styles.gridImage}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {moviePictures.length === 0 ? (
        <Text style={styles.noImagesText}>No images available for this movie</Text>
      ) : (
        <FlatList
          data={moviePictures}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={renderItem}
          contentContainerStyle={styles.gridContainer}
        />
      )}

      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Pressable 
            style={styles.modalBackground}
            onPress={() => setSelectedImage(null)}
          >
            <Image
              source={selectedImage}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gridContainer: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    margin: 4,
  },
  gridImage: {
    width: (width / 2) - 16,
    height: ((width / 2) - 16) * 1.5,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: width * 1.5,
  },
  noImagesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
