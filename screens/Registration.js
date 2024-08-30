import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { signOut } from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [yearOfStudies, setYearOfStudies] = useState('');
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  const handleSaveProfile = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Registrovan je korisnik:', user.email);
      })
      .catch((error) => alert(error.message));

    try {
      const userId = auth.currentUser?.uid;
      const authToken = await auth.currentUser?.getIdToken(true);

      if (!name.trim()) {
        alert('Morate uneti ime i prezime.');
        return;
      }
      if (!faculty.trim()) {
        alert('Morate uneti vas fakultet.');
        return;
      }
      if (!yearOfStudies.trim()) {
        alert('Morate uneti godinu studija.');
        return;
      }

      if (userId && authToken) {
        const userRef = ref(database, `users/${userId}`);
        set(userRef, {
          name,
          faculty,
          yearOfStudies,
          authToken,
        });
        alert('Profil sacuvan uspesno!');
        navigation.replace('Home');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Dobrodošli!</Text>
      <Text style={styles.subheaderText}>Login informacije:</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Lozinka"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry
      />
      <Text style={styles.subheaderText2}>Lične informacije:</Text>

      <TextInput
        placeholder="Ime i Prezime"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Fakultet"
        value={faculty}
        onChangeText={(text) => setFaculty(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Godina studija"
        value={yearOfStudies}
        onChangeText={(text) => setYearOfStudies(text)}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Sačuvaj profil</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Otkaži registraciju</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subheaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#0782f9',
  },
  subheaderText2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#FF3B30',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
});
