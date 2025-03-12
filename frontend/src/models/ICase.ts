import { z } from 'zod';
import { StatusEnum } from './Status';

// Modelo para relatórios de perícia (mantido separado)
export const ExpertiseSchema = z.object({
  participants: z.string().default(''),
  procedure: z.string().default(''),
  parameters: z.string().default(''),
  analysis: z.string().default(''),
  briefConclusion: z.string().default(''),
  location: z.string().default(''),
  caseId: z.string().default(''),
  plaintiff: z.string().default(''),
  defendant: z.string().default(''),
  dateTime: z.string().default('')
});

export type IExpertise = z.infer<typeof ExpertiseSchema>;

// Interface unificada para caso
export const CaseSchema = z.object({
  id: z.string().optional(),
  status: z.enum(StatusEnum).default('register'),

  // Dados básicos do caso
  plaintiff: z.string().default(''),
  defendant: z.string().default(''),
  expertiseIdentifier: z.string().default(''),
  caseNumber: z.string().default(''),
  defendantLawyerEmail: z.string().default(''),
  plaintiffLawyerEmail: z.string().default(''),
  acceptedPerformed: z.boolean().default(false),
  expertiseSubject: z.string().default(''),
  casePdfUrl: z.string().default(''),
  registerProgress: z.number().default(0),

  // Fase de agenda de perícia
  suggestedExpertiseDateAI: z.string().default(''),
  suggestedExpertiseDateExpert: z.string().default(''),
  contactsPerformed: z.boolean().default(false),
  finalExpertiseDate: z.string().default(''),
  schedulingPetitionSent: z.boolean().default(false),

  // Fase de relatório da perícia
  expertiseReportUrl: z.string().default(''),
  expertiseReportSentAt: z.string().default(''),
  expertiseReportProgress: z.number().default(0),

  // Fase de laudo complementar
  complementaryReportUrl: z.string().default(''),
  complementaryReportSentAt: z.string().default(''),


  // Fase de pagamento
  isPaid: z.boolean().default(false),
  feeAmount: z.number().default(0)
});

export type ICase = z.infer<typeof CaseSchema>;

// Valores padrão mesclados com o schema
export const defaultValues: ICase = CaseSchema.parse({});