import React from 'react';
import { useForm } from 'react-hook-form';

const CadastroForm: React.FC<{ card: any; onClose: () => void }> = ({ card, onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: card || {
            autor: '',
            reu: '',
            identificadorPericia: '',
            processo: '',
            dataAudiencia: '',
            emailAdvogados: '',
            aceita: false,
            objeto: '',
            urlProcessoPdf: ''
        }
    });

    const onSubmit = (data) => {
        console.log(data);
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
                        {...register('autor', { required: 'Autor é obrigatório' })}
                    />
                    {errors.autor && <span className="error">{errors.autor.message}</span>}
                </div>
                <div className="form-group">
                    <label>Réu</label>
                    <input
                        type="text"
                        {...register('reu', { required: 'Réu é obrigatório' })}
                    />
                    {errors.reu && <span className="error">{errors.reu.message}</span>}
                </div>
                <div className="form-group">
                    <label>Identificador Perícia</label>
                    <input
                        type="text"
                        {...register('identificadorPericia')}
                    />
                </div>
                <div className="form-group">
                    <label>Processo</label>
                    <input
                        type="text"
                        {...register('processo', { required: 'Processo é obrigatório' })}
                    />
                    {errors.processo && <span className="error">{errors.processo.message}</span>}
                </div>
                <div className="form-group">
                    <label>Data da Audiência</label>
                    <input
                        type="date"
                        {...register('dataAudiencia')}
                    />
                </div>
                <div className="form-group">
                    <label>Email dos Advogados</label>
                    <input
                        type="email"
                        {...register('emailAdvogados')}
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            {...register('aceita')}
                        />
                        Aceita?
                    </label>
                </div>
                <div className="form-group">
                    <label>Objeto</label>
                    <input
                        type="text"
                        {...register('objeto')}
                    />
                </div>
                <div className="form-group">
                    <label>URL do Processo PDF</label>
                    <input
                        type="url"
                        {...register('urlProcessoPdf')}
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