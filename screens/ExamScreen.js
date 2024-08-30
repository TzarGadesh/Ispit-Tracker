import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, push, set, update } from 'firebase/database';
import { auth, database } from '../firebase';

const ExamScreen = () => {
  const [name, setName] = useState('');
  const [rokPolaganja, setRokPolaganja] = useState('');
  const [espbPoeni, setEspbPoeni] = useState('');
  const [comment, setComment] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { examId } = route.params || {};

  const handleSaveExam = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      if (!name.trim()) {
        alert('Morate uneti naziv ispita.');
        return;
      }
      if (!rokPolaganja.trim()) {
        alert('Morate uneti Rok polaganja.');
        return;
      }
      if (!espbPoeni.trim() || isNaN(Number(espbPoeni))) {
        alert('Morate uneti broj ESPB bodova.');
        return;
      }

      const examRef = ref(database, `users/${userId}/exams`);
      if (examId) {
        const existingExamRef = ref(
          database,
          `users/${userId}/exams/${examId}`
        );
        update(existingExamRef, {
          name,
          rokPolaganja,
          espbPoeni,
          comment,
        })
          .then(() => {
            alert('Ispit updatovan uspesno!');
            navigation.goBack();
          })
          .catch((error) => alert(error.message));
      } else {
        const newExamRef = push(examRef);
        set(newExamRef, {
          name,
          rokPolaganja,
          espbPoeni,
          comment,
        })
          .then(() => {
            alert('Ispit sacuvan uspesno!');
            navigation.goBack();
          })
          .catch((error) => alert(error.message));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {examId ? 'Izmeni ispit' : 'Dodaj novi ispit'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Naziv Ispita"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Rok Polaganja"
        value={rokPolaganja}
        onChangeText={setRokPolaganja}
      />
      <TextInput
        style={styles.input}
        placeholder="ESPB Poeni"
        value={espbPoeni}
        onChangeText={setEspbPoeni}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Komentar"
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity onPress={handleSaveExam} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Sacuvaj ispit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Vrati se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EAD2AC',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#0081AF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ExamScreen;
