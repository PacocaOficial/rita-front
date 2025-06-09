import { LoaderCircle, Trash } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { PACOCA_API_URL, RITA_API_URL } from '@/utils/vars';
import ErrorAlert from '@/components/alerts/alert-error';
import { errorMessage } from '@/utils/text';
import { User } from '@/types';

type LoginForm = {
    login: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData } = useForm<Required<LoginForm>>({
        login: '',
        password: '',
        remember: false,
    });
    const [loading, setLoading] = useState(false);
    const [errorsInput, setErrorsInput] = useState<Record<string, string[]>>({});
    const [error, setError] = useState<string>("");
    const { loginContext, changeUser, removeUserFromSession } = useAuth();
    const [usersSessions, setUsersSessions] = useState<User[]>([]);
    const location = useLocation();
    const getQueryParam = (param: string) => {
        const urlParams = new URLSearchParams(location.search);
        return urlParams.get(param);
    };
    const [forceNewLogin, setForceNewLogin] = useState(getQueryParam("forceNewLogin") === "true");
    
    const removeUserSession = (id_user: number) => {
        removeUserFromSession(id_user)
        const users = JSON.parse(localStorage.getItem("saved_users") ?? "[]");
        setUsersSessions(users); // Remove o return, pois `setState` não pode ser retornado
    }

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("saved_users") ?? "[]");
        setUsersSessions(users); // Remove o return, pois `setState` não pode ser retornado
    }, []);

    useEffect(() => {
        setForceNewLogin(usersSessions.length <= 0 || getQueryParam("forceNewLogin") === "true");
    }, [usersSessions]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
       
        setLoading(true)
        setErrorsInput({})
        setError("")
        e.preventDefault();

        try {
            let errors: Record<string, string[]> = {};
            
            if (!data.login) {
                errors.login = ["O campo login é obrigatório."];
            }
            if (!data.password) {
                errors.password = ["O campo senha é obrigatório."];
            }

            if (Object.keys(errors).length > 0) {
                
                // eslint-disable-next-line no-throw-literal
                throw {
                    response: {
                        data: {
                            errors
                        }
                    }
                };
            }

            const response = await axios.post(`${PACOCA_API_URL}/login`, {
                login: data.login,
                password: data.password,
                system: "rita",
            });

            loginContext(response.data.access_token || response.data.token, response.data.user, data.remember);
        } catch (err: any) {
            if (err?.response?.data.errors) {
                setErrorsInput(err.response.data.errors); // Atualiza o estado com os erros
            } else {
                if (err?.response?.data?.message === "Usuário e/ou senha incorretos") {
                    let errors: Record<string, string[]> = {};
                    errors.password = ["Usuário e/ou senha incorretos"];

                    setErrorsInput(errors);
                } else {
                    const messageError = errorMessage(err);
                    setError(messageError);
                    console.error("Erro ao logar: ", messageError);
                    console.error("Erro ao logar: ", err);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
            <>
            {error && <ErrorAlert show={!!error} message={error} onClose={() => setError("")} />}
            <AuthLayout title="Acesse sua conta" description="Entre com sua conta do Paçoca">
                <Helmet title="Rita - Login">
                
                </Helmet>

                {usersSessions.length >= 1 && !forceNewLogin ? (
                    <>
                        {usersSessions.map((userSession) => (
                            <>
                            {userSession.id && (
                                <div
                                key={String(userSession.user_id)}
                                className="dark:bg-[#161615] select-none cursor-pointer flex items-center p-2 rounded-lg relative bg-white shadow-sm hover:bg-gray-50 transition"
                                >
                                <div onClick={() => changeUser(userSession.id)} className="mr-3">
                                    <img
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={
                                        userSession.img_account
                                        ? `${PACOCA_API_URL}/${userSession.img_account.replace(/^(\.\.\/)+/, '')}`
                                        : "/img/img-account.png"
                                    }
                                    alt={userSession.name}
                                    onError={(e) => {
                                        e.currentTarget.src = "/img/img-account.png";
                                    }}
                                    />
                                </div>

                                <div onClick={() => changeUser(userSession.id)} className="flex-1">
                                    <h5 className="text-sm font-semibold">{userSession?.name?.split(" ")[0]}</h5>
                                    <p className="text-xs">@{userSession.user_name}</p>
                                </div>

                                <button
                                    onClick={() => removeUserSession(userSession.id)}
                                    type="button"
                                    className="ml-3 text-red-500 hover:text-red-600 p-1"
                                    aria-label="Remove user session"
                                >
                                    <Trash />
                                </button>
                                </div>
                            )}
                            </>
                        ))}

                        <div className="text-muted-foreground text-center text-sm">
                            <TextLink onClick={() => setForceNewLogin(true)} href={"/#"} tabIndex={5}>
                                Login com outra conta
                            </TextLink>
                        </div>
                    </>
                ) : (

                    
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="login">Email ou nome de usuário</Label>
                                <Input
                                    id="login"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="login"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="Email ou nome de usuário"
                                    className={errorsInput.login ? 'border-red-500 focus:ring-red-500' : ""}
                                />

                                {errorsInput.login && (
                                    <InputError message={errorsInput.login[0]} />
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                    <TextLink href={"a"} className="ml-auto text-sm" tabIndex={5}>
                                        Esqueci minha senha
                                    </TextLink>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Senha"
                                    className={errorsInput.password ? 'border-red-500 focus:ring-red-500' : ""}
                                />

                                {errorsInput.password && (
                                    <InputError message={errorsInput?.password[0]} />
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Lembrar Conta</Label>
                            </div>

                            <Button type="submit" className="bg-[#5bb4ff] hover:bg-[#5bb4ffab] text-[#fff] dark:text-[#FDFDFC] mt-4 w-full" tabIndex={4} disabled={loading}>
                                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Faça login com Paçoca
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Não tem uma conta no Paçoca?{' '}
                            <TextLink href={"/cadastro"} tabIndex={5}>
                                Cadastre-se
                            </TextLink>
                        </div>

                        {usersSessions.length >= 1 ? (
                            <div className="text-muted-foreground text-center text-sm">
                                <TextLink href={"/cadastro"} tabIndex={5}>
                                    Contas salvas
                                </TextLink>
                            </div>
                        ) : null}
                    </form>
                ) }

                {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
            </AuthLayout>
        </>
    );
}