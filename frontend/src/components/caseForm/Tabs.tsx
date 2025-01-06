import React, { useState, useEffect, useRef } from 'react';
import { Tab, Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';

interface Tab {
    key: string;
    label: string;
}

interface TabsProps {
    cardStatus: string | undefined;
    finalExpertiseDate: string;
    briefConclusion: string;
    expertiseReportUrl: string;
    activeTab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' | 'participants' | 'procedure' | 'parameters' | 'analysis' | 'briefConclusion';
    setActiveTab: (tab: 'register' | 'scheduling' | 'report' | 'payment' | 'expertise' | 'participants' | 'procedure' | 'parameters' | 'analysis' | 'briefConclusion') => void;
}

const Tabs: React.FC<TabsProps> = ({ cardStatus, finalExpertiseDate, briefConclusion, expertiseReportUrl, activeTab, setActiveTab }) => {
    const [showExpertiseTabs, setShowExpertiseTabs] = useState(true);
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (expertiseReportUrl) {
            setShowExpertiseTabs(false);
        }
    }, [expertiseReportUrl]);

    useEffect(() => {
        if (showExpertiseTabs && tabsContainerRef.current) {
            const lastTab = tabsContainerRef.current.querySelector('.MuiTab-root:last-child');
            if (lastTab) {
                lastTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
            }
        }
    }, [showExpertiseTabs]);

    const renderTabs = () => {
        const tabs: Tab[] = [];
        const today = new Date().toISOString().split('T')[0];

        switch (cardStatus) {
            case 'CADASTRO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                break;
            case 'AGENDAMENTO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                // Ocultar a aba de agendamento
                 tabs.push({ key: 'scheduling', label: 'Agendamento' });
                break;
            case 'PERICIA':
                tabs.push({ key: 'register', label: 'Cadastro' });
                
                tabs.push({ key: 'scheduling', label: 'Agendamento' });
                tabs.push({ key: 'expertise', label: 'Perícia' });
                if (showExpertiseTabs && !expertiseReportUrl) {
                    tabs.push({ key: 'participants', label: 'Participantes' });
                    tabs.push({ key: 'procedure', label: 'Procedimento' });
                    tabs.push({ key: 'parameters', label: 'Parâmetro' });
                    tabs.push({ key: 'analysis', label: 'Análise' });
                    tabs.push({ key: 'briefConclusion', label: 'Conclusão' });
                }
                break;
            case 'LAUDO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'report', label: 'Laudo' });
                break;
            case 'RECEBIMENTO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'report', label: 'Laudo' });
                tabs.push({ key: 'payment', label: 'Recebimento' });
                break;
            default:
                tabs.push({ key: 'register', label: 'Cadastro' });
                break;
        }

        if (briefConclusion) {
            tabs.push({ key: 'report', label: 'Laudo' });
        }

        return tabs;
    };

    const handleExpertiseCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowExpertiseTabs(event.target.checked);
    };

    return (
        <div className="tabs-container" ref={tabsContainerRef}>
            <MuiTabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
            >
                {renderTabs().map(tab => (
                    <MuiTab key={tab.key} label={tab.label} value={tab.key} />
                ))}
            </MuiTabs>
            {activeTab === 'expertise' && (
                <div className="expertise-content">
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={showExpertiseTabs}
                                onChange={handleExpertiseCheckboxChange}
                            />
                            Show additional expertise tabs
                        </label>
                    </div>
                </div>
            )}
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
};

export default Tabs;