// import { Head, Link, usePage } from '@inertiajs/react';
import { useAuth } from '@/contexts/auth-context';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Welcome() {
  const { token, user: auth } = useAuth();

  return (
    <>
      <Helmet title="Home">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Helmet>

      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] px-4 py-6 text-[#1b1b18] lg:justify-center dark:bg-[#0a0a0a]">
        {/* Navbar */}
        <header className="mb-8 w-full max-w-6xl">
          <nav className="flex justify-end gap-4 text-sm">
            {auth ? (
              <Link
                to={"/agendamentos"}
                className="rounded-md border border-[#ccc] px-4 py-1.5 text-[#1b1b18] transition hover:border-[#999] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                Agendamentos
              </Link>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="px-4 py-1.5 text-[#1b1b18] hover:underline dark:text-[#EDEDEC]"
                >
                  Login
                </Link>
                <Link
                  to={"/cadastro"}
                  className="rounded-md border border-[#ccc] px-4 py-1.5 transition hover:border-[#999] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                  Registrar
                </Link>
              </>
            )}
          </nav>
        </header>

        {/* Main content */}
        <main className="flex w-full max-w-6xl flex-col-reverse items-center justify-between gap-6 lg:flex-row">
          {/* Text section */}
          <section className="w-full max-w-lg rounded-lg bg-white p-6 shadow dark:bg-[#161615] dark:text-[#EDEDEC]">
            <h1 className="mb-2 text-2xl font-semibold">404 - Não encontrado</h1>
            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                Essa página não existe ou foi removida. Verifique o endereço ou volte para a página inicial.
            </p>


            <div className="mt-6">
              <Link
                to={"/"}
                className="inline-block rounded-md border border-black bg-black px-5 py-2 text-white transition hover:bg-[#222] dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
              >
                Voltar para o home
              </Link>
              </div>
          </section>

          {/* Image section */}
          <section className="relative w-full max-w-md rounded-lg overflow-hidden bg-[#fff2f2] dark:bg-[#1D0002]">
            <img src="/img/errors/page-not-found.jpg" alt="Logo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_0_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0_0_0_1px_#fffaed2d]" />
          </section>
        </main>
      </div>
    </>
  );
}
