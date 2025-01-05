export interface IRegister {
    plaintiff: string;
    defendant: string;
    expertiseIdentifier: string;
    caseNumber: string;
    hearingDate: string;
    defendantLawyerEmail: string;
    plaintiffLawyerEmail: string;
    acceptedPerformed: boolean;
    expertiseSubject: string;
    casePdfUrl: string;
    registerProgress: number;
}

export interface IScheduling {
    suggestedExpertiseDateAI: string;
    suggestedExpertiseDateExpert: string;
    contactsPerformed: boolean;
    expertiseDateConfirmedByPlaintiff: boolean;
    expertiseDateConfirmedByDefendant: boolean;
    finalExpertiseDate: string;
}

export interface IExpertiseReport {
    expertiseReportUrl: string;
    expertiseReportSentAt: string;
    expertiseReportProgress: number;
}

export interface IPayment {
    isPaid: boolean;
    feeAmount: number;
}

export interface IExpertise {
    participants: string;
    procedure: string;
    parameters: string;
    analysis: string;
    briefConclusion: string;
}

export interface ICase {
    id?: string;
    status: 'CADASTRO' | 'AGENDAMENTO' | 'PERICIA' | 'LAUDO' | 'RECEBIMENTO';
    register: IRegister;
    scheduling: IScheduling;
    expertiseReport: IExpertiseReport;
    payment: IPayment;
    expertise?: IExpertise;
}