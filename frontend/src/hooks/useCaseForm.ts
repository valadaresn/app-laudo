import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { ICase } from '../models/ICase';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Status } from '../models/Status';

export function useCaseForm(caseId: string | null, defaultValues: ICase) {
  const methods = useForm<ICase>({ defaultValues });
  const { reset, formState, getValues } = methods;
  const { isDirty } = formState;

  const initialValuesRef = useRef<ICase | null>(null);
  const [activeTab, setActiveTab] = useState<Status>('register');

  useEffect(() => {
    const fetchData = async () => {
      if (caseId) {
        const docRef = doc(db, 'cases', caseId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const caseData = snapshot.data() as ICase;
          caseData.id = snapshot.id;

          // Atualiza o formulário com os dados do caso
          reset({ ...caseData, id: caseId });
          initialValuesRef.current = { ...caseData, id: caseId };

          // Define a aba ativa com base no status do caso
          setActiveTab(caseData.status);
        } else {
          // Reseta o formulário para os valores padrão se o caso não existir
          reset(defaultValues);
          initialValuesRef.current = defaultValues;
          setActiveTab('register');
        }
      } else {
        // Reseta o formulário para os valores padrão se não houver caseId
        reset(defaultValues);
        initialValuesRef.current = defaultValues;
        setActiveTab('register');
      }
    };

    fetchData();
  }, [caseId, reset, defaultValues]);

  const handleSave = async () => {
    try {
      const currentValues = getValues();
      if (caseId) {
        const docRef = doc(db, 'cases', caseId);
        await updateDoc(docRef, currentValues);
      } else {
        await addDoc(collection(db, 'cases'), currentValues);
      }
      reset(currentValues);
    } catch (error) {
      console.error("Error saving case:", error);
    }
  };

  return { methods, handleSave, isDirty, activeTab, setActiveTab };
}