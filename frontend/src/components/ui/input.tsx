import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';
import './input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}


export default function Input({label, error, id, ...props}: InputProps) {
    const [IsFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="input-container">
            <label htmlFor={inputId} className="input-label">
                {label}
            </label>

            <input
                id={inputId}
                className={`input ${IsFocused ? 'input-focused' : ''} ${error ? 'input-error' : ''}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${inputId}-error` : undefined}
                {...props}
            />

            {error && (
                <span id={`${inputId}-error`} className="input-error-message" role='alert'>
                    {error}
                </span>
            )}
            </div>
    )
}