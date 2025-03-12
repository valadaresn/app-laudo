import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICase, defaultValues, CaseSchema } from '../models/ICase';
import { Status } from '../models/Status';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function useCaseForm(caseId: string | null) {
  const methods = useForm<ICase>({ defaultValues });
  const { reset, formState, getValues } = methods;
  const { isDirty } = formState;

  const initialValuesRef = useRef<ICase | null>(null);
  const [activeTab, setActiveTab] = useState<Status>('register');

  useEffect(() => {
    const fetchData = async () => {
      if (caseId) {
        const docSnap = await getDoc(doc(db, 'cases', caseId));
        if (docSnap.exists()) {
          // Mescla os valores retornados com os valores padrão
          const rawData = docSnap.data();
          const merged = { ...defaultValues, ...rawData };
          // Use o Zod para garantir que os defaults sejam aplicados para campos undefined
          const parsedData = CaseSchema.parse(merged);
          reset(parsedData);
        }
      } else {
        reset(defaultValues);
        initialValuesRef.current = defaultValues;
        setActiveTab('register');
      }
    };

    fetchData();
  }, [caseId, reset]);

  const handleSave = async () => {
    try {
      const currentValues = getValues();
      if (caseId) {
        await updateDoc(doc(db, 'cases', caseId), currentValues);
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