'use client'
import Head from 'next/head';
import Link from 'next/link';
import { Button } from 'primereact/button';

const Home = () => {
  return (
    <div className="home-container">
      <Head>
        <title>Tu Aplicación</title>
        <meta name="description" content="Descripción de tu aplicación" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Bienvenido a THC</h1>
            <Link href="/login">
              <Button label="Iniciar Sesión" icon="pi pi-sign-in" />
            </Link>
          </div>
        </section>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
          overflow: hidden; /* Deshabilita las barras de desplazamiento */
        }

        .home-container {
          height: 100vh;
        }

        .hero {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100vh;
          background-image: url('/img/tori_japon.jpg');
          background-size: cover;
          background-position: center;
          color: #000000;
        }

        .hero-content {
          text-align: center;
          max-width: 600px;
          padding: 20px;
          margin-bottom: 200px; /* Ajusta el margen inferior para subir el contenido */
        }
      `}</style>
    </div>
  );
};

export default Home;
