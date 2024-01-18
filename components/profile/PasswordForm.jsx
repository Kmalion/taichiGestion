import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const PasswordForm = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const handleChangePassword = async () => {
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error cambiando la contraseña');
      }

      // Operación de cambio de contraseña exitosa
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="p-fluid mt-2 mb-2">
        <div className="p-field">
          <label htmlFor="password">Nueva Contraseña:</label>
          <InputText
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button label="Cambiar " onClick={handleChangePassword} className="p-button-success gap"/>
        <Button label="Cancelar" onClick={onClose} className="p-button-danger gap" />
      </div>
      </div>
  );
};

export default PasswordForm;
