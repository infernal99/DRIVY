import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

const baseStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)',
};

export function Card({ style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div style={{ ...baseStyle, ...style }} {...rest} />;
}

export function CardButton({ style, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      style={{
        ...baseStyle,
        border: 'none',
        textAlign: 'left',
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    />
  );
}
