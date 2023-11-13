// components/ActionButton.tsx
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, label }) => (
  <button onClick={onClick} disabled={disabled}>
    {label}
  </button>
);
export default ActionButton;