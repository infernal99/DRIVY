import type { InputHTMLAttributes } from 'react';
import styles from './AuthField.module.css';

export function AuthField({
  label,
  error,
  id,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ''} ${className ?? ''}`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && (
        <span className={`${styles.error} anim-shake`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
