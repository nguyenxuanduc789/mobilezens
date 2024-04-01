/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Platform, StatusBar, TouchableOpacity, ScrollView,Alert  } from 'react-native';
import url from './Url';
import * as SecureStore from 'expo-secure-store';

const App = () => {
  const [jokes, setJokes] = useState([]);
  const [currentJoke, setCurrentJoke] = useState(null);
  useEffect(() => {
    fetchJokes();
    getStoredCookies();
  }, []);
  const fetchJokes = async () => {
    try {
      const response = await fetch(`${url}/jokes/getallcontent`);
      const data = await response.json();
      setJokes(data);
      setCurrentJoke(data[0]);
    } catch (error) {
      console.error('Error fetching jokes:', error);
    }
  };
  const handleShowNextJoke = async () => {
    const nextIndex = currentJoke ? jokes.indexOf(currentJoke) + 1 : 0;
    if (nextIndex === 4) {
      Alert.alert(
        'That is all the jokes for today!',
        'Come back another day !',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
      return;
    } 
    const nextJokeId = jokes[nextIndex]._id;
    let storedCookies = await SecureStore.getItemAsync('_id');
    if (!storedCookies) {
      storedCookies = [];
    } else {
      storedCookies = JSON.parse(storedCookies);
    }
    if (!storedCookies.includes(nextJokeId)) {
      storedCookies.push(nextJokeId);
      await SecureStore.setItemAsync('_id', JSON.stringify(storedCookies))
        .then(() => {
          console.log('Cookie set:', nextJokeId);
        })
        .catch((error) => {
          console.log('Error setting cookie:', error);
        });
    } else {
      console.log('Cookie already set:', nextJokeId);
    }
    setCurrentJoke(jokes[nextIndex]);
  };
  const getStoredCookies = async () => {
    try {
      const cookies = await SecureStore.getItemAsync('_id');
      console.log('All cookies:', cookies);
    } catch (error) {
      console.error('Error getting cookies:', error);
    }
  };  
  const clearAllCookies = async () => {
    try {
      await SecureStore.deleteItemAsync('_id');
      console.log('All cookies cleared.');
      setCurrentJoke(jokes[0]);
    } catch (error) {
      console.log('Error clearing cookies:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Image source={require('./icon/iconh.jpg')} style={styles.leftIcon} />
        <View style={styles.navbarTextContainer}>
          <Text style={styles.navbarTextTop}>Handicrafted by</Text>
          <Text style={styles.navbarText}>Jms HLS</Text>
        </View>
        <Image source={require('./icon/iconhoa.jpg')} style={styles.rightIcon} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={[styles.jokeContainer, styles.fixedContainer]}>
            <View style={styles.jokeContent}>
              <Text style={styles.jokeText}>
                Why did the doctor always bring a red pen to work?
              </Text>
              <Text style={styles.punchlineText}>
                In case they needed to draw blood!
              </Text>
            </View>
          </View>
          {currentJoke && (
            <View style={[styles.additionalInfoContainer,{marginTop:150}]}>
              <Text style={styles.additionalInfo}>{currentJoke.content}</Text>
            </View>
          )}
          <View style={[styles.buttonContainer,{marginTop:20}]}>
            <TouchableOpacity onPress={handleShowNextJoke} style={[styles.button, { backgroundColor: '#007fff', marginRight: 10 }]}>
              <Text style={styles.buttonText}>This is Funny!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShowNextJoke} style={[styles.button, { backgroundColor: '#008000' }]}>
              <Text style={styles.buttonText}>This is not Funny.</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={clearAllCookies} style={[styles.button, { backgroundColor: '#FF0000' }]}>
              <Text style={styles.buttonText}>Clear Cookie.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNavbar}>
        <View style={styles.bottomNavbarTextContainer}>
          <Text style={styles.bottomNavbarText}>
            This app is created as part of Hlsolutions program. The materials contained on this website are provided for general information only and do not constitute any form of advice. HLS assumes no responsibility for the accuracy of any particular statement and accepts no liability for any loss or damage which may arise from reliance on the information contained on this site.
          </Text>
        </View>
        <Text style={styles.copyrightText}>Copyright 2021 HLS</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navbar: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  navbarTextContainer: {
    alignItems: 'center',
  },
  navbarTextTop: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 160,
  },
  navbarText: {
    fontSize: 18,
    color: '#000000',
    marginLeft: 180,
  },
  leftIcon: {
    width: 60,
    height: 60,
    marginLeft: 10,
  },
  rightIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  jokeContainer: {
    backgroundColor: '#008000',
    width: '100%',
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  jokeText: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  punchlineText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  additionalInfo: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  bottomNavbar: {
    height: 140,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  bottomNavbarTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  bottomNavbarText: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
  },
});

export default App;
