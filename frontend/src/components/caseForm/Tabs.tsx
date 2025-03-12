import { useRef } from 'react';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';
import { Status } from '../../models/Status';

interface TabsProps {
    cardStatus: Status | undefined;
    activeTab: Status;
    setActiveTab: (tab: Status) => void;
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
                
                {cardStatus === 'complementary' && (
                    <MuiTab key="complementary" label="Laudo Complementar" value="complementary" />
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