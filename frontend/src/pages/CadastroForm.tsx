import React from 'react';
import { useForm } from 'react-hook-form';
import { ICase, IRegister } from '../models/ICase';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const CadastroForm: React.FC<{ card: ICase | null; onClose: () => void }> = ({ card, onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<IRegister>({
        defaultValues: card ? card.register : {
            plaintiff: '',
            defendant: '',
            expertiseIdentifier: '',
            caseNumber: '',
            hearingDate: '',
            defendantLawyerEmail: '',
            plaintiffLawyerEmail: '',
            acceptedPerformed: false,
            expertiseSubject: '',
            casePdfUrl: '',
            registerProgress: 0
        }
    });

    const onSubmit = async (data: IRegister) => {
        const newCase: Omit<ICase, 'id'> = {
            status: 'AGENDAMENTO', // Alterar status para AGENDAMENTO após o envio
            register: data,
            scheduling: {
                suggestedExpertiseDateAI: '',
                suggestedExpertiseDateExpert: '',
                contactsPerformed: false,
                expertiseDateConfirmedByPlaintiff: false,
                expertiseDateConfirmedByDefendant: false,
                finalExpertiseDate: ''
            },
            expertiseReport: {
                expertiseReportUrl: '',
                expertiseReportSentAt: '',
                expertiseReportProgress: 0
            },
            payment: {
                isPaid: false,
                feeAmount: 0
            }
        };

        try {
            if (card?.id) {
                // Update existing document
                const docRef = doc(db, 'cases', card.id);
                await updateDoc(docRef, newCase);
            } else {
                // Add new document
                await addDoc(collection(db, 'cases'), newCase);
            }
            console.log('Document written successfully');
        } catch (e) {
            console.error('Error adding document: ', e);
        }

        onClose();
    };

    return (
        <div className="form-container">
            <h2>{card ? 'Editar Cadastro' : 'Novo Cadastro'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Autor</label>
                    <input
                        type="text"
                        {...register('plaintiff', { required: 'Autor é obrigatório' })}
                    />
                    {errors.plaintiff && <span className="error">{errors.plaintiff.message}</span>}
                </div>
                <div className="form-group">
                    <label>Réu</label>
                    <input
                        type="text"
                        {...register('defendant', { required: 'Réu é obrigatório' })}
                    />
                    {errors.defendant && <span className="error">{errors.defendant.message}</span>}
                </div>
                <div className="form-group">
                    <label>Identificador Perícia</label>
                    <input
                        type="text"
                        {...register('expertiseIdentifier')}
                    />
                </div>
                <div className="form-group">
                    <label>Processo</label>
                    <input
                        type="text"
                        {...register('caseNumber', { required: 'Processo é obrigatório' })}
                    />
                    {errors.caseNumber && <span className="error">{errors.caseNumber.message}</span>}
                </div>
                <div className="form-group">
                    <label>Data da Audiência</label>
                    <input
                        type="date"
                        {...register('hearingDate')}
                    />
                </div>
                <div className="form-group">
                    <label>Email do Advogado do Réu</label>
                    <input
                        type="email"
                        {...register('defendantLawyerEmail')}
                    />
                </div>
                <div className="form-group">
                    <label>Email do Advogado do Autor</label>
                    <input
                        type="email"
                        {...register('plaintiffLawyerEmail')}
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            {...register('acceptedPerformed')}
                        />
                        Aceita?
                    </label>
                </div>
                <div className="form-group">
                    <label>Objeto</label>
                    <input
                        type="text"
                        {...register('expertiseSubject')}
                    />
                </div>
                <div className="form-group">
                    <label>URL do Processo PDF</label>
                    <input
                        type="url"
                        {...register('casePdfUrl')}
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onClose}>Cancelar</button>
                    <button type="submit">Salvar</button>
                </div>
            </form>
            <style>{`
                .form-container {
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #f4f4f4;
                    max-width: 600px;
                    margin: 20px auto;
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
                .form-actions button[type="submit"] {
                    background-color: #007bff;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default CadastroForm;