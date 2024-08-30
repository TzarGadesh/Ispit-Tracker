import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { signOut } from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const userRef = ref(database, `users/${userId}`);
      const examsRef = ref(database, `users/${userId}/exams`);

      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          alert('No user data found!');
        }
      });
      onValue(examsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const examsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setExams(examsArray);
        }
      });
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  const handleDeleteExam = (examId) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const examRef = ref(database, `users/${userId}/exams/${examId}`);
      remove(examRef)
        .then(() => {
          alert('Exam deleted successfully!');
          setExams((prevExams) =>
            prevExams.filter((exam) => exam.id !== examId)
          );
        })
        .catch((error) => alert(error.message));
    }
  };
  const handlePassedExam = (examId) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const examRef = ref(database, `users/${userId}/exams/${examId}`);
      remove(examRef)
        .then(() => {
          alert('Čestitke na položenom ispitu!');
          setExams((prevExams) =>
            prevExams.filter((exam) => exam.id !== examId)
          );
        })
        .catch((error) => alert(error.message));
    }
  };
  const handleSelectExam = (examId) => {
    setSelectedExam(examId === selectedExam ? null : examId);
  };

  const handleAddExam = () => {
    navigation.navigate('Exams');
  };
  const handleEditExam = (examId) => {
    navigation.navigate('Exams', {
      examId: examId,
    });
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>Korisnik: {userData.name}</Text>
          <Text style={styles.profileText}>Fakultet: {userData.faculty}</Text>
          <Text style={styles.profileText}>
            Godina studija: {userData.yearOfStudies}
          </Text>
        </View>
      ) : (
        <Text>Ucitavamo tvoj profil...</Text>
      )}

      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.examContainer}>
            <Text style={styles.subheaderText}>{item.name}</Text>
            <Text style={styles.examText}>Rok: {item.rokPolaganja}</Text>
            <Text style={styles.examText}>ESPB poeni: {item.espbPoeni}</Text>
            <Text style={styles.examText}>Comment: {item.comment}</Text>
            <TouchableOpacity
              onPress={() => handlePassedExam(item.id)}
              style={styles.actionButton2}
            >
              <Text style={styles.actionButtonText2}>Polozen?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelectExam(item.id)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Izmeni/Obrisi</Text>
            </TouchableOpacity>
            {selectedExam === item.id && (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  onPress={() => handleEditExam(item.id)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Izmeni</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteExam(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Izbrisi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <TouchableOpacity onPress={handleAddExam} style={styles.addExamButton}>
        <Text style={styles.addExamButtonText}>Dodaj ispit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EAD2AC',
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  examContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  examText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  actionButton: {
    backgroundColor: '#0782F9',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton2: {
    backgroundColor: '#4B644A',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  actionButtonText2: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FFA726',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },

  editButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  addExamButton: {
    backgroundColor: '#0081AF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  addExamButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#00ABE7',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#0782f9',
    textAlign: 'center',
  },
});
