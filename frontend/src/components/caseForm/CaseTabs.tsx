import React, { useRef } from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, Box, TextField } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import RegisterFields from './RegisterFields';
import SchedulingForm from './SchedulingForm';
import ExpertiseFields from './ExpertiseFields';
import { ExpertiseParticipants, ExpertiseProcedure } from './ExpertiseForm';
import { ICase } from '../../models/ICase';

interface CaseTabsProps {
    cardStatus: string | undefined;
    finalExpertiseDate: string;
    briefConclusion: string;
    expertiseReportUrl: string;
    activeTab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' | 'participants' | 'procedure' | 'parameters' | 'analysis' | 'briefConclusion';
    setActiveTab: (tab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' | 'participants' | 'procedure' | 'parameters' | 'analysis' | 'briefConclusion') => void;
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

function CaseTabs({ cardStatus, finalExpertiseDate, briefConclusion, expertiseReportUrl, activeTab, setActiveTab, register, errors }: CaseTabsProps) {
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="tabs-container" ref={tabsContainerRef}>
            <MuiTabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
            >
                <MuiTab key="register" label="Cadastro" value="register" />
                {cardStatus === 'AGENDAMENTO' && (
                    <MuiTab key="scheduling" label="Agendamento" value="scheduling" />
                )}
                {cardStatus === 'PERICIA' && (
                    <MuiTab key="scheduling" label="Agendamento" value="scheduling" />
                )}
                {cardStatus === 'LAUDO' && (
                    <MuiTab key="report" label="Laudo" value="report" />
                )}
                {cardStatus === 'RECEBIMENTO' && (
                    <>
                        <MuiTab key="report" label="Laudo" value="report" />
                        <MuiTab key="payment" label="Recebimento" value="payment" />
                    </>
                )}
                {briefConclusion && (
                    <MuiTab key="report" label="Laudo" value="report" />
                )}
            </MuiTabs>
            <div className="tab-content">
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
            </div>
            <style>{`
                .tabs-container {
                    margin-bottom: 20px;
                    overflow-x: auto;
                }
                .MuiTab-root {
                    text-transform: none;
                }
                .tab-content {
                    margin-top: 20px;
                }
            `}</style>
        </div>
    );
}

export default CaseTabs;