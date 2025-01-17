export const StatusEnum = ['register', 'scheduling', 'expertise', 'report', 'payment'] as const;
export type Status = typeof StatusEnum[number];

export const statusLabels: { [key in Status]: string } = {
    register: 'Cadastro',
    scheduling: 'Agendamento',
    expertise: 'Perícia',
    report: 'Laudo',
    payment: 'Recebimento'
};