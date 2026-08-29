import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '../ui/Icon';
import type { IconName } from '../../types';
import styles from './AuthField.module.css';

/**
 * Campo de los formularios de auth: etiqueta + caja de icono a la izquierda.
 * Si el tipo es `password` añade el botón de ver/ocultar, que alterna el
 * `type` del input — por eso el type se calcula aquí y no se pasa tal cual.
 */
export function AuthField({
  label,
  error,
  id,
  className,
  icon,
  type,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; icon?: IconName }) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && revealed ? 'text' : type;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={`${styles.shell} ${error ? styles.shellError : ''}`}>
        {icon && (
          <span className={styles.iconBox} aria-hidden="true">
            <Icon name={icon} size={17} color="#fff" />
          </span>
        )}
        <input
          id={id}
          type={effectiveType}
          className={`${styles.input} ${className ?? ''}`}
          aria-invalid={Boolean(error)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.reveal}
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={revealed}
          >
            <Icon name={revealed ? 'eyeOff' : 'eye'} size={18} color="currentColor" />
          </button>
        )}
      </div>
      {error && (
        <span className={`${styles.error} anim-shake`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
