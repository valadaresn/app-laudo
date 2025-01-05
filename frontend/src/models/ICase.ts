import { z } from 'zod';

export const RegisterSchema = z.object({
    plaintiff: z.string().default(''),
    defendant: z.string().default(''),
    expertiseIdentifier: z.string().default(''),
    caseNumber: z.string().default(''),
    hearingDate: z.string().default(''),
    defendantLawyerEmail: z.string().default(''),
    plaintiffLawyerEmail: z.string().default(''),
    acceptedPerformed: z.boolean().default(false),
    expertiseSubject: z.string().default(''),
    casePdfUrl: z.string().default(''),
    registerProgress: z.number().default(0)
});

export const SchedulingSchema = z.object({
    suggestedExpertiseDateAI: z.string().default(''),
    suggestedExpertiseDateExpert: z.string().default(''),
    contactsPerformed: z.boolean().default(false),
    expertiseDateConfirmedByPlaintiff: z.boolean().default(false),
    expertiseDateConfirmedByDefendant: z.boolean().default(false),
    finalExpertiseDate: z.string().default('')
});

export const ExpertiseReportSchema = z.object({
    expertiseReportUrl: z.string().default(''),
    expertiseReportSentAt: z.string().default(''),
    expertiseReportProgress: z.number().default(0)
});

export const PaymentSchema = z.object({
    isPaid: z.boolean().default(false),
    feeAmount: z.number().default(0)
});

export const ExpertiseSchema = z.object({
    participants: z.string().default(''),
    procedure: z.string().default(''),
    parameters: z.string().default(''),
    analysis: z.string().default(''),
    briefConclusion: z.string().default('')
});

export const CaseSchema = z.object({
    id: z.string().optional(),
    status: z.enum(['CADASTRO', 'AGENDAMENTO', 'PERICIA', 'LAUDO', 'RECEBIMENTO']).default('CADASTRO'),
    register: RegisterSchema,
    scheduling: SchedulingSchema,
    expertiseReport: ExpertiseReportSchema,
    payment: PaymentSchema,
    expertise: ExpertiseSchema.optional()
});

export type IRegister = z.infer<typeof RegisterSchema>;
export type IScheduling = z.infer<typeof SchedulingSchema>;
export type IExpertiseReport = z.infer<typeof ExpertiseReportSchema>;
export type IPayment = z.infer<typeof PaymentSchema>;
export type IExpertise = z.infer<typeof ExpertiseSchema>;
export type ICase = z.infer<typeof CaseSchema>;