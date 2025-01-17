import React, { useRef } from 'react';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';

interface TabsProps {
    cardStatus: string | undefined;
    finalExpertiseDate: string;
    briefConclusion: string;
    expertiseReportUrl: string;
    activeTab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise';
    setActiveTab: (tab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise') => void;
}

function Tabs({ cardStatus, finalExpertiseDate, briefConclusion, expertiseReportUrl, activeTab, setActiveTab }: TabsProps) {
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
                {(cardStatus === 'AGENDAMENTO' || cardStatus === 'PERICIA') && (
                    <MuiTab key="scheduling" label="Agendamento" value="scheduling" />
                )}
                {cardStatus === 'PERICIA' && (
                    <MuiTab key="expertise" label="Perícia" value="expertise" />
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
            <style>{`
                .tabs-container {
                    margin-bottom: 20px;
                    overflow-x: auto;
                }
                .MuiTab-root {
                    text-transform: none;
                }
            `}</style>
        </div>
    );
}

export default Tabs;