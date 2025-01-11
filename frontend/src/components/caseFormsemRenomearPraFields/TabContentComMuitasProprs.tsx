import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';
import RegisterForm from './RegisterForm';
import SchedulingForm from './SchedulingForm';
import ReportForm from './ReportForm';
import PaymentForm from './PaymentForm';
import { ExpertiseParticipants, ExpertiseProcedure, ExpertiseParameters, ExpertiseAnalysis, ExpertiseBriefConclusion } from './ExpertiseForm';
import { TextField, Button } from '@mui/material';

interface TabContentProps {
    activeTab: string;
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
    isEditing: boolean;
    handleEdit: () => void;
    handleCancel: () => void;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, register, errors, isEditing, handleEdit, handleCancel }) => {
    return (
        <>
            {activeTab === 'register' && (
                <RegisterForm
                    register={register}
                    errors={errors}
                    isEditing={isEditing}
                    handleEdit={handleEdit}
                    handleCancel={handleCancel}
                />
            )}
            {activeTab === 'scheduling' && (
                <SchedulingForm register={register} errors={errors} />
            )}
            {activeTab === 'expertise' && (
                <div className="form-group">
                    <TextField
                        label="Data Perícia"
                        type="date"
                        {...register('scheduling.finalExpertiseDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            )}
            {activeTab === 'participants' && (
                <ExpertiseParticipants />
            )}
            {activeTab === 'procedure' && (
                <ExpertiseProcedure />
            )}
            {activeTab === 'parameters' && (
                <ExpertiseParameters />
            )}
            {activeTab === 'analysis' && (
                <ExpertiseAnalysis />
            )}
            {activeTab === 'briefConclusion' && (
                <ExpertiseBriefConclusion />
            )}
            {activeTab === 'report' && (
                <ReportForm register={register} errors={errors} />
            )}
            {activeTab === 'payment' && (
                <PaymentForm register={register} errors={errors} />
            )}
        </>
    );
};

export default TabContent;