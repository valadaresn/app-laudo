import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ICase } from '../../models/ICase';

const ExpertiseParticipants: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <div className="form-group">
            <label>Participants</label>
            <textarea
                placeholder="Enter participants details..."
                {...register('expertise.participants')}
                rows={10}
                style={{ width: '100%', height: 'calc(100% - 20px)', padding: '10px' }}
            />
            {errors.expertise && errors.expertise.participants && <span className="error">{errors.expertise.participants.message}</span>}
        </div>
    );
};

const ExpertiseProcedure: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <div className="form-group">
            <label>Procedure</label>
            <textarea
                placeholder="Enter procedure details..."
                {...register('expertise.procedure')}
                rows={10}
                style={{ width: '100%', height: 'calc(100% - 20px)', padding: '10px' }}
            />
            {errors.expertise && errors.expertise.procedure && <span className="error">{errors.expertise.procedure.message}</span>}
        </div>
    );
};

const ExpertiseParameters: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <div className="form-group">
            <label>Parameters</label>
            <textarea
                placeholder="Enter parameters details..."
                {...register('expertise.parameters')}
                rows={10}
                style={{ width: '100%', height: 'calc(100% - 20px)', padding: '10px' }}
            />
            {errors.expertise && errors.expertise.parameters && <span className="error">{errors.expertise.parameters.message}</span>}
        </div>
    );
};

const ExpertiseAnalysis: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <div className="form-group">
            <label>Analysis</label>
            <textarea
                placeholder="Enter analysis details..."
                {...register('expertise.analysis')}
                rows={10}
                style={{ width: '100%', height: 'calc(100% - 20px)', padding: '10px' }}
            />
            {errors.expertise && errors.expertise.analysis && <span className="error">{errors.expertise.analysis.message}</span>}
        </div>
    );
};

const ExpertiseBriefConclusion: React.FC = () => {
    const { register, formState: { errors } } = useFormContext<ICase>();

    return (
        <div className="form-group">
            <label>Brief Conclusion</label>
            <textarea
                placeholder="Enter brief conclusion..."
                {...register('expertise.briefConclusion')}
                rows={10}
                style={{ width: '100%', height: 'calc(100% - 20px)', padding: '10px' }}
            />
            {errors.expertise && errors.expertise.briefConclusion && <span className="error">{errors.expertise.briefConclusion.message}</span>}
        </div>
    );
};

export { ExpertiseParticipants, ExpertiseProcedure, ExpertiseParameters, ExpertiseAnalysis, ExpertiseBriefConclusion };