import React, { useState, useEffect } from 'react';

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
    const [showExpertiseTabs, setShowExpertiseTabs] = useState(false);

    useEffect(() => {
        if (expertiseReportUrl) {
            setShowExpertiseTabs(false);
        }
    }, [expertiseReportUrl]);

    const renderTabs = () => {
        const tabs: Tab[] = [];
        const today = new Date().toISOString().split('T')[0];

        switch (cardStatus) {
            case 'CADASTRO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                break;
            case 'AGENDAMENTO':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'scheduling', label: 'Agendamento' });
                break;
            case 'PERICIA':
                tabs.push({ key: 'register', label: 'Cadastro' });
                tabs.push({ key: 'scheduling', label: 'Agendamento' });
                tabs.push({ key: 'expertise', label: 'Perícia' });
                if (showExpertiseTabs && !expertiseReportUrl) {
                    tabs.push({ key: 'participants', label: 'Participants' });
                    tabs.push({ key: 'procedure', label: 'Procedure' });
                    tabs.push({ key: 'parameters', label: 'Parameters' });
                    tabs.push({ key: 'analysis', label: 'Analysis' });
                    tabs.push({ key: 'briefConclusion', label: 'Brief Conclusion' });
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
        <div className="tabs-container">
            <div className="tabs">
                {renderTabs().map(tab => (
                    <button
                        key={tab.key}
                        className={activeTab === tab.key ? 'active' : ''}
                        onClick={() => setActiveTab(tab.key as TabsProps['activeTab'])}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {activeTab === 'expertise' && (
                <div className="expertise-content">
                    {/* Checkbox to control the visibility of additional tabs */}
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={showExpertiseTabs}
                                onChange={handleExpertiseCheckboxChange}
                                disabled={!!expertiseReportUrl}
                            />
                            Dados Perícia
                        </label>
                    </div>
                </div>
            )}
            <style>{`
                .tabs-container {
                    overflow-x: auto;
                }
                .tabs {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    width: max-content;
                }
                .tabs button {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-bottom: 2px solid transparent;
                    background-color: #f4f4f4;
                    cursor: pointer;
                }
                .tabs button.active {
                    border-bottom: 2px solid #007bff;
                }
                .expertise-content {
                    margin-top: 20px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .form-group input[type="checkbox"] {
                    width: auto;
                    padding: 0;
                }
                .form-group .error {
                    color: red;
                    font-size: 12px;
                }
                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                .form-actions button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .form-actions button[type="button"] {
                    background-color: #ccc;
                }
                .form-actions button[type="submit"], .form-actions button[type="button"]:not([type="button"]) {
                    background-color: #007bff;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default Tabs;