// 1. Sub-interface: Register (CADASTRAR)
export interface IRegister {
  plaintiff: string;             // Autor
  defendant: string;             // Réu
  expertiseIdentifier: string;   // IdentificadorPericia
  caseNumber: string;            // Processo
  hearingDate: string | Date;    // DataAudiencia
  defendantLawyerEmail: string;  // EmailAdvogadoReu
  plaintiffLawyerEmail: string;  // EmailAdvogadoAutor
  acceptedPerformed: boolean;    // AceitaRealizado?
  expertiseSubject: string;      // ObjetoPericia
  casePdfUrl: string;            // UrlProcessoPdf
  registerProgress: number;      // ProgressoCadastro
}

// 2. Sub-interface: Scheduling (AGENDAMENTO)
export interface IScheduling {
  suggestedExpertiseDateAI?: string | Date;
  suggestedExpertiseDateExpert?: string | Date;
  contactsPerformed?: boolean;
  expertiseDateConfirmedByPlaintiff?: boolean;
  expertiseDateConfirmedByDefendant?: boolean;
  finalExpertiseDate?: string | Date;
}

// 3. Sub-interface: Expertise Report (LAUDO)
export interface IExpertiseReport {
  expertiseReportUrl?: string;       // LaudoUrl
  expertiseReportSentAt?: string | Date; 
  expertiseReportProgress?: number;  // ProgessoLaudo
}

// 4. Sub-interface: Payment (RECEBIMENTOS)
export interface IPayment {
  isPaid?: boolean;    // Recebido
  feeAmount?: number;  // ValorHonorario
}

// 5. Interface principal, unindo as sub-interfaces
export interface ICase {
  id?: string; // Document ID from Firestore
  status: 'CADASTRO' | 'AGENDAMENTO' | 'PERICIA' | 'LAUDO' | 'RECEBIMENTO'; // Status do processo
  register: IRegister;                 // Dados da coluna "CADASTRAR"
  scheduling?: IScheduling;            // Dados da coluna "AGENDAMENTO"
  expertiseReport?: IExpertiseReport;  // Dados da coluna "LAUDO"
  payment?: IPayment;                  // Dados da coluna "RECEBIMENTOS"
}