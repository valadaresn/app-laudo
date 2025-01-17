import { useRef } from 'react';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';

interface TabsProps {
    cardStatus: 'register' | 'scheduling' | 'expertise' | 'report' | 'payment' | undefined;
    finalExpertiseDate: string;
    briefConclusion: string;
    expertiseReportUrl: string;
    activeTab: 'register' | 'scheduling' | 'expertise' | 'report' | 'payment';
    setActiveTab: (tab: 'register' | 'scheduling' | 'expertise' | 'report' | 'payment') => void;
}

function Tabs({ cardStatus, activeTab, setActiveTab }: TabsProps) {
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="tabs-container" ref={tabsContainerRef}>
            <MuiTabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
            >
                <MuiTab key="register" label="Cadastro" value="register" />

                {cardStatus === 'scheduling' && (
                    <MuiTab key="scheduling" label="Agendamento" value="scheduling" />
                )}

                {cardStatus === 'expertise' && (
                    <MuiTab key="expertise" label="Perícia" value="expertise" />
                )}

                {cardStatus === 'report' && (
                    <MuiTab key="report" label="Laudo" value="report" />
                )}

                {cardStatus === 'payment' && (
                    <MuiTab key="payment" label="Recebimento" value="payment" />
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