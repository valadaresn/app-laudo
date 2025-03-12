import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Tabs as MuiTabs, Tab as MuiTab, Box, TextField } from '@mui/material';
import { IExpertise, ExpertiseSchema } from '../models/ICase';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import GenericForm from '../components/common/GenericForm';

const defaultValues = ExpertiseSchema.parse({});

interface ExpertiseFormProps {
  expertiseId?: string;
  caseId?: string;  // Opcional porque podemos estar visualizando uma perícia existente
  onClose: () => void;
}

function ExpertiseForm({ expertiseId: initialExpertiseId, caseId, onClose }: ExpertiseFormProps) {
  const methods = useForm<IExpertise>({
    resolver: zodResolver(ExpertiseSchema),
    defaultValues
  });

  const { register, handleSubmit, formState: { errors }, reset } = methods;
  const [activeTab, setActiveTab] = useState('dados');
  const [expertiseId, setExpertiseId] = useState(initialExpertiseId);

  useEffect(() => {
    if (expertiseId) {
      // Carrega perícia existente
      const loadExpertise = async () => {
        try {
          const docRef = doc(db, 'expertises', expertiseId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const expertiseData = docSnap.data() as IExpertise;
            reset(expertiseData);
          }
        } catch (error) {
          console.error("Erro ao carregar perícia:", error);
        }
      };
      loadExpertise();
    } else if (caseId) {
      // Nova perícia - buscar dados do caso
      const fetchCaseData = async () => {
        try {
          const docRef = doc(db, 'cases', caseId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const caseData = docSnap.data();
            // Definir os campos básicos
            reset({
              ...defaultValues,
              plaintiff: caseData.plaintiff || '',
              defendant: caseData.defendant || '',
              caseId: caseId, // Importante: assegurar que o caseId seja definido
              dateTime: caseData.finalExpertiseDate || ''
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do caso:", error);
        }
      };
      
      fetchCaseData();
    } else {
      // Se não tem caseId nem expertiseId, usar valores padrão
      reset(defaultValues);
    }
  }, [expertiseId, reset, caseId]);

  const onSubmit = async (data: IExpertise) => {
    try {
      // Garantir que o caseId está incluído nos dados
      const expertiseData = { 
        ...data,
        caseId: caseId || data.caseId // Usar o caseId da prop se disponível, senão usar o do formulário
      };
      
      if (expertiseId) {
        await setDoc(doc(db, 'expertises', expertiseId), expertiseData);
      } else {
        const docRef = await addDoc(collection(db, 'expertises'), expertiseData);
        setExpertiseId(docRef.id);
      }
      console.log('Perícia salva com sucesso');
      onClose();
    } catch (e) {
      console.error('Erro ao salvar perícia:', e);
    }
  };

  return (
    <GenericForm
      formMethods={methods}
      title="Perícia"
      onSave={handleSubmit(onSubmit)}
      onClose={onClose}
      isDirty={methods.formState.isDirty}
    >
      <Container>
        <MuiTabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <MuiTab label="Dados" value="dados" />
          <MuiTab label="Participantes" value="participants" />
          <MuiTab label="Procedimento" value="procedure" />
          <MuiTab label="Parâmetro" value="parameters" />
          <MuiTab label="Análise" value="analysis" />
          <MuiTab label="Conclusão" value="briefConclusion" />
        </MuiTabs>
        <Box mt={2} className="form-group">
          {activeTab === 'dados' && (
            <>
              <Box mb={2}>
                <TextField
                  label="Autor"
                  placeholder="Informe os detalhes do autor..."
                  {...register('plaintiff')}
                  fullWidth
                  error={!!errors.plaintiff}
                  helperText={errors.plaintiff?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Réu"
                  placeholder="Informe os detalhes do réu..."
                  {...register('defendant')}
                  fullWidth
                  error={!!errors.defendant}
                  helperText={errors.defendant?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Data e Hora da Perícia"
                  type="datetime-local"
                  {...register('dateTime')}
                  fullWidth
                  error={!!errors.dateTime}
                  helperText={errors.dateTime?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Local da Perícia"
                  placeholder="Informe o local da perícia..."
                  {...register('location')}
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              {/* Campo caseId oculto */}
              <input type="hidden" {...register('caseId')} />
            </>
          )}
          {activeTab === 'participants' && (
            <TextField
              label="Participantes"
              placeholder="Informe os detalhes dos participantes..."
              {...register('participants')}
              multiline
              rows={15}
              fullWidth
              error={!!errors.participants}
              helperText={errors.participants?.message}
            />
          )}
          {activeTab === 'procedure' && (
            <TextField
              label="Procedimento"
              placeholder="Descreva o procedimento utilizado..."
              {...register('procedure')}
              multiline
              rows={15}
              fullWidth
              error={!!errors.procedure}
              helperText={errors.procedure?.message}
            />
          )}
          {activeTab === 'parameters' && (
            <TextField
              label="Parâmetros"
              placeholder="Informe os parâmetros da perícia..."
              {...register('parameters')}
              multiline
              rows={15}
              fullWidth
              error={!!errors.parameters}
              helperText={errors.parameters?.message}
            />
          )}
          {activeTab === 'analysis' && (
            <TextField
              label="Análise"
              placeholder="Descreva a análise realizada..."
              {...register('analysis')}
              multiline
              rows={15}
              fullWidth
              error={!!errors.analysis}
              helperText={errors.analysis?.message}
            />
          )}
          {activeTab === 'briefConclusion' && (
            <TextField
              label="Conclusão"
              placeholder="Informe a conclusão da perícia..."
              {...register('briefConclusion')}
              multiline
              rows={15}
              fullWidth
              error={!!errors.briefConclusion}
              helperText={errors.briefConclusion?.message}
            />
          )}
        </Box>
      </Container>
      <style>{`
        .MuiTab-root {
          text-transform: none;
        }
      `}</style>
    </GenericForm>
  );
}

export default ExpertiseForm;