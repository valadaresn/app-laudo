import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import RegisterFields from './RegisterFields';
import SchedulingForm from './SchedulingForm';
import ExpertiseFields from './ExpertiseFields';
import { ExpertiseParticipants, ExpertiseProcedure } from './ExpertiseForm';
import { ICase } from '../../models/ICase';

function TabContent({ activeTab, register, errors }: 
    { activeTab: string; register: UseFormRegister<ICase>; errors: FieldErrors<ICase> }) {
    return (
        <>
            {activeTab === 'register' && (
                <RegisterFields register={register} errors={errors} />
            )}
            {activeTab === 'scheduling' && (
                <SchedulingForm register={register} errors={errors} />
            )}
            {activeTab === 'expertise' && (
                <ExpertiseFields register={register} errors={errors} />
            )}
            {activeTab === 'participants' && (
                <ExpertiseParticipants />
            )}
            {activeTab === 'procedure' && (
                <ExpertiseProcedure />
            )}
        </>
    );
}

export default TabContent;