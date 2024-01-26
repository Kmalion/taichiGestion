'use client'
import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast'; 
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ResetPassword = ({params}) => {
 
  const router = useRouter();
  const toast = useRef(null);
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);
  const { data: sesision, status: sessionStatus } = useSession;
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logoSrc, setLogoSrc] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    // Lógica del tema solo en el lado del cliente
    const getLogoSrc = () => {
      return theme === 'lara-dark-teal'
        ? '/img/Taichi_logo_blanco.png'
        : '/img/Taichi_logo_negro.png';
    };

    setLogoSrc(getLogoSrc());
  }, [theme]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: params.token,
          }),
        });

        if (res.status === 400) {
          showError("Token inválido o expiró");
        } else if (res.status === 200) {
          showSuccess("");
          setVerified(true);
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        showError("Error, vuelva a intentarlo");
        console.error(error);
      }
    };
    verifyToken();
  }, [params.token]);

  const showSuccess = (message) => {
    setError(''); // Limpiar el estado de error
    
  };

  const showError = (message) => {
    setVerified(true); // Marcar como verificado para evitar la llamada continua a showSuccess
    setError(message); // Establecer el mensaje de error
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 5000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar reglas de contraseñas
    if (password.length < 8) {
      showError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      showError('La contraseña debe contener al menos un símbolo');
      return;
    }

    if (password !== confirmPassword) {
      showError('Las contraseñas no coinciden');
      return;
    }


    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email
        }),
      });

      if (res.status === 400) {
        showError("El usuario con este email no está registrado");
      } else if (res.status === 200) {
        showSuccess("Éxito, revise su correo para cambiar su contraseña");
        router.push("/login");
      }
    } catch (error) {
      showError("Error, vuelva a intentarlo");
      console.error(error);
    }

  }; return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <Card className="p-col-12" style={{ width: '400px', padding: '30px' }}>
    <Image
          src={logoSrc} // Utiliza la variable logoSrc que se establece dinámicamente según el tema
          alt="Logo"
          width={300}
          height={100}
          style={{ display: 'block', margin: 'auto', marginBottom: '20px' }}
        />
      <form onSubmit={handleSubmit}>
        <div className="p-grid p-fluid mt-0">
          <div className="p-col-12">
            <h2 className="text-center mt-0">Reset Password</h2>
          </div>
          <div className="p-col-12">
            <div className="p-field mt-2">
              <label style={{ textAlign: 'left', display: 'block' }} htmlFor="password">
                Contraseña:
              </label>
              <InputText
                id="password"
                name="password"
                type="password"
                placeholder="Introduzca su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-inputtext"
              />
            </div>
            <div className="p-field mt-2">
              <label style={{ textAlign: 'left', display: 'block' }} htmlFor="confirmPassword">
                Confirmar Contraseña:
              </label>
              <InputText
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-inputtext"
              />
            </div>
          </div>
          <div className="p-col-12 mt-2">
            <Button
              label="Reset Password"
              type="submit"
              disabled={error.length > 0}
              className="p-d-block p-mx-auto p-mt-2 mt-2"
            />
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </Card>
  </div>
  
  );
};

export default ResetPassword;