// import { Head, Link, usePage } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
// import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useInitials } from '@/hooks/use-initials';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';

export default function Welcome() {
  const { token, user: auth } = useAuth();
      const getInitials = useInitials();

  return (
    <>
    <Helmet>
      <title>Rita - Paçoca</title>
      <meta name="description" content={`Rita, seu lembrete de tarefas e agendamentos!`} />
      <meta name="keywords" content={`Rita, Paçoca, rede social brasileira, login, entrar, conta, entrar na conta}`} />
      <meta name="author" content="Rita, Paçoca Inc." />
      <meta property="og:title" content={`Rita, seu lembrete de tarefas e agendamentos`} />
      <meta property="og:description" content={`Rita, seu lembrete de tarefas e agendamentos`} />
      <meta property="og:image" content="/img/logo.png" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Rita, seu lembrete de tarefas e agendamentos`} />
      <meta name="twitter:description" content={`Rita, seu lembrete de tarefas e agendamentos`} />
      <meta name="twitter:image" content="/img/logo.png" />
      <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet"/>
    </Helmet>

      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] px-4 py-6 text-[#1b1b18] lg:justify-center dark:bg-[#0a0a0a]">
        {/* Navbar */}
        <header className="mb-8 w-full max-w-6xl">
          <nav className="flex justify-end gap-4 text-sm">
            {auth ? (
              <>
                <Link
                to={"/agendamentos"}
                className="flex items-center rounded-md border border-[#ccc] px-4 py-1.5 text-[#1b1b18] transition hover:border-[#999] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                Agendamentos
              </Link>
                <Link
                to={"/agendamentos"}
                className=""
              >
                <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="size-10 rounded-full p-1">
                              <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage src={auth?.avatar} alt={auth.name} />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={auth} />
                    </DropdownMenuContent>
                </DropdownMenu>
              </Link>

              

              {/* <Link
                to={"/agendamentos"}
                className="rounded-md px-4 py-1.5 text-[#1b1b18] transition hover:border-[#999] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                @{auth.user_name}
              </Link> */}
              </>
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
        <div className="flex items-center justify-center w-full transition-opacity opacity-100 duration-750 lg:grow starting:opacity-0">
            <main className="flex max-w-[335px] w-full flex-col-reverse lg:max-w-4xl lg:flex-row">
                <div className="text-[13px] leading-[20px] flex-1 p-6 pb-12 lg:p-20 bg-white dark:bg-[#161615] dark:text-[#EDEDEC] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] rounded-bl-lg rounded-br-lg lg:rounded-tl-lg lg:rounded-br-none">
                    <h1 className="mb-2 text-2xl font-semibold">RITA</h1>
                    <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                        Notificações automáticas de tarefas e compromissos pelo WhatsApp
                    </p>
                    <ul className="flex flex-col mb-4 lg:mb-6">
                        <li className="flex items-center gap-4 py-2 relative before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A] before:top-1/2 before:bottom-0 before:left-[0.4rem] before:absolute">
                            <span className="relative py-1 bg-white dark:bg-[#161615]">
                                <span className="flex items-center justify-center rounded-full bg-[#FDFDFC] dark:bg-[#161615] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] w-3.5 h-3.5 border dark:border-[#3E3E3A] border-[#e3e3e0]">
                                    <span className="rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A] w-1.5 h-1.5"></span>
                                </span>
                            </span>
                            <span>
                                Crie sua Tarefa
                                <a href="/agendamentos" className="inline-flex items-center space-x-1 font-medium underline underline-offset-4 text-[#5bb4ff] dark:text-[#5bb4ff] ml-1">
                                    <span>aqui</span>
                                    <svg
                                        width="10"
                                        height="11"
                                        viewBox="0 0 10 11"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-2.5 h-2.5"
                                    >
                                        <path
                                            d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                            stroke="currentColor"
                                            stroke-linecap="square"
                                        />
                                    </svg>
                                </a>
                            </span>
                        </li>
                        <li className="flex items-center gap-4 py-2 relative before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A] before:bottom-1/2 before:top-0 before:left-[0.4rem] before:absolute">
                            <span className="relative py-1 bg-white dark:bg-[#161615]">
                                <span className="flex items-center justify-center rounded-full bg-[#FDFDFC] dark:bg-[#161615] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] w-3.5 h-3.5 border dark:border-[#3E3E3A] border-[#e3e3e0]">
                                    <span className="rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A] w-1.5 h-1.5"></span>
                                </span>
                            </span>
                            <span>
                                Receba notificação por WhatsApp
                            </span>
                        </li>
                    </ul>
                    <ul className="flex gap-3 text-sm leading-normal">
                        <li>
                            <Link to="/agendamentos" className="inline-block dark:bg-[#eeeeec] dark:border-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white dark:hover:border-white hover:bg-black hover:border-black px-5 py-1.5 bg-[#1b1b18] rounded-sm border border-black text-white text-sm leading-normal">
                                Cadastrar Agendamentro
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="bg-[#fff2f2] dark:bg-[#1D0002] relative lg:-ml-px -mb-px lg:mb-0 rounded-t-lg lg:rounded-t-none lg:rounded-r-lg aspect-[335/376] lg:aspect-auto w-full lg:w-[438px] shrink-0 overflow-hidden">
                    <img src="/img/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 rounded-t-lg lg:rounded-t-none lg:rounded-r-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"></div>
                </div>
            </main>
        </div>
      </div>
    </>
  );
}
