'use client'
import Head from 'next/head';
import ForgetPassword from '@/components/login/ForgetPassword';

const ForgetPasswordComponent = () => {
  return (
    <div className="login-container">
      <Head>
        <title>Iniciar sesión</title>
        <meta name="description" content="Descripción de la página de inicio de sesión" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="login-content">
        <div className="centered-container">
          <div className="login-page mt-5">
            <ForgetPassword></ForgetPassword>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          overflow: hidden; /* Deshabilita las barras de desplazamiento */
        }

        .login-container {
          background-image: url('/img/tori_japon.jpg');
          background-size: cover;
          background-position: center;
          color: #000000;
          height: 160vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-content {
          text-align: center;
          max-width: 600px;
          padding: 20px;
          margin: auto;
          margin-top: 50px; /* Ajusta este valor para bajar o subir el contenido */
        }

        .centered-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default ForgetPasswordComponent;

