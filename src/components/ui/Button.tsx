import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'success' | 'danger' | 'secondary' | 'ghost' | 'dark';

export function Button({
  variant = 'primary',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={`${styles.btn} ${styles[variant]} ${className ?? ''}`} {...rest} />;
}
