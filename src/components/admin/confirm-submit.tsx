'use client';

import { useFormStatus } from 'react-dom';

export function ConfirmSubmit({
  children,
  confirm,
  className = '',
}: {
  children: React.ReactNode;
  confirm?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={className}
    >
      {pending ? '…' : children}
    </button>
  );
}
