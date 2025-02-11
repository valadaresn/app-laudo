import { useState } from "react";
import { Button } from "@mui/material";
import ExpertiseForm from "./ExpertiseForm";
import Modal from "../components/Modal";
import { useCaseForm } from "../hooks/useCaseForm";
import Tabs from "../components/caseForm/Tabs";
import RegisterFields from "../components/caseForm/RegisterFields";
import SchedulingFields from "../components/caseForm/SchedulingFields";
import ExpertiseFields from "../components/caseForm/ExpertiseFields";
import ReportFields from "../components/caseForm/ReportFields";
import PaymentFields from "../components/caseForm/PaymentFields";
import { defaultValues } from "../models/ICase";
import ExpertiseList from "../components/caseForm/ExpertiseList";
import GenericForm from "../components/common/GenericForm";
import { FormProvider } from "react-hook-form"; // 🚀 Importação necessária

interface CaseFormProps {
  caseId: string | null;
  onClose: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ caseId, onClose }) => {
  const { methods, handleSave, isDirty, activeTab, setActiveTab } = useCaseForm(caseId, defaultValues);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string | undefined>(undefined);

  const handleOpenModal = (expertiseId: string | undefined = undefined) => {
    setSelectedExpertiseId(expertiseId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveAndClose = async () => {
    if (navigator.onLine) {
      await handleSave();
    } else {
      handleSave();
    }
    onClose();
  };

  return (
    <FormProvider {...methods}> {/* 🚀 Agora tudo compartilha o mesmo contexto */}
      <>
        {!isModalOpen && (
          <GenericForm
            formMethods={methods}
            title="Processo"
            onSave={handleSave}
            onClose={onClose}
            isDirty={isDirty}
          >
            <Tabs cardStatus={methods.getValues().status} activeTab={activeTab} setActiveTab={setActiveTab} />
            <form onSubmit={methods.handleSubmit(handleSaveAndClose)}>
              {activeTab === "register" && <RegisterFields />}
              {activeTab === "scheduling" && <SchedulingFields />}
              {activeTab === "expertise" && (
                <>
                  <ExpertiseFields />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(undefined)}
                    style={{ marginTop: "16px" }}
                  >
                    Realizar Perícia
                  </Button>
                  <ExpertiseList caseId={caseId!} onExpertiseSelect={handleOpenModal} />
                </>
              )}
              {activeTab === "report" && <ReportFields />}
              {activeTab === "payment" && <PaymentFields />}
            </form>
          </GenericForm>
        )}
        {isModalOpen && (
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <ExpertiseForm expertiseId={selectedExpertiseId} onClose={handleCloseModal} />
          </Modal>
        )}
      </>
    </FormProvider>
  );
};

export default CaseForm;