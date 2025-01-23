import { collection, doc, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ICase } from '../models/ICase';

class CaseService {
  static getCaseById(cardId: string, callback: (cardData: ICase | null) => void) {
    const docRef = doc(db, 'cases', cardId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const cardData = snapshot.data() as ICase;

        cardData.id = snapshot.id;

        callback(cardData);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }

  static async addCase(data: ICase) {
    await addDoc(collection(db, 'cases'), data);
  }

  static async updateCase(cardId: string, data: ICase) {
    const docRef = doc(db, 'cases', cardId);
    await updateDoc(docRef, data);
  }
}

export default CaseService;