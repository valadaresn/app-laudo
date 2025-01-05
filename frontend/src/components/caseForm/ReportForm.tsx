import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICase } from '../../models/ICase';

interface ReportFormProps {
    register: UseFormRegister<ICase>;
    errors: FieldErrors<ICase>;
}

const ReportForm: React.FC<ReportFormProps> = ({ register, errors }) => (
    <>
        <div className="form-group">
            <label>URL do Laudo</label>
            <input
                type="url"
                {...register('expertiseReport.expertiseReportUrl')}
            />
        </div>
        <div className="form-group">
            <label>Data de Envio do Laudo</label>
            <input
                type="date"
                {...register('expertiseReport.expertiseReportSentAt')}
            />
        </div>
        <div className="form-group">
            <label>Progresso do Laudo</label>
            <input
                type="number"
                {...register('expertiseReport.expertiseReportProgress')}
            />
        </div>
    </>
);

export default ReportForm;