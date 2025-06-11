import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import RegisterLayout from '@/layouts/appointments/register';
import { AlertNotification } from '@/components/ui/alert-notification';
import axios from "axios"
import { RITA_API_URL } from '@/utils/vars';
import { errorMessage } from '@/utils/text';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { LoadingThreeCircle } from '@/components/ui/loading';
import { LoaderCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meus Agendamentos',
        href: '/appointments',
    },
    {
        title: 'Agendar',
        href: '/appointments/new',
    },
];

type ProfileForm = {
    id?: number | null;
    title: string;
    description: string;
    send_notification: boolean;
    date_appointment: string;
    date_notification: string;
}

export default function AppointmentsRegister() {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, recentlySuccessful } = useForm<Required<ProfileForm>>();
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [errorsInput, setErrorsInput] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [errorData, setErrorData] = useState("");
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        setLoading(true)
        setErrorsInput({})
        setError("")
        e.preventDefault();

        try {
            let errors: Record<string, string[]> = {};
            
            if (!data.title) {
                errors.title = ["O campo titulo é obrigatório."];
            }
            if (!data.description) {
                errors.description = ["O campo descrição é obrigatório."];
            }
            if (!data.date_appointment) {
                errors.date_appointment = ["O campo data é obrigatório."];
            }
            if (data.send_notification && !data.date_notification) {
                errors.date_notification = ["O campo data é obrigatório."];
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

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            };
            const url = `${RITA_API_URL}/appointments`;
            const response = isEditing ? await axios.patch(url, data, config) : await axios.post(url, data, config);
            const responseData = response?.data;

            if(responseData?.success) setSuccess(responseData?.message)
            else setError(responseData?.message)

            if(!isEditing && responseData.appointment){
                navigate(`/agendamentos/${responseData.appointment.id}`);
            }
        } catch (err: any) {
            if (err?.response?.data.errors) {
                setErrorsInput(err.response.data.errors); // Atualiza o estado com os erros
            } else {
                const messageError = errorMessage(err);
                setError(messageError);
                console.error("Erro ao logar: ", messageError);
                console.error("Erro ao logar: ", err);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadDataEdit = async () => {
        setLoadingData(true)

        try {
            const response = await axios.get(`${RITA_API_URL}/appointments/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = response.data
            setData(data);

        } catch (err: any) {
            const messageError = errorMessage(err);
            setErrorData(messageError);
            console.error("Erro ao logar: ", messageError);
            console.error("Erro ao logar: ", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setLoadingData(true);
            loadDataEdit();
            breadcrumbs[1].title = 'Editar';
            breadcrumbs[1].href = `/appointments/${id}`;
        } else {
            // Resetar estado para criação
            setIsEditing(false);
            setData({
                id: null,
                title: '',
                description: '',
                send_notification: false,
                date_appointment: '',
                date_notification: '',
            });
            setErrorsInput({});
            setError("");
            setErrorData("");
            breadcrumbs[1].title = 'Agendar';
            breadcrumbs[1].href = `/appointments/new`;
        }
    }, [id])
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Rita - Novo agendamento</title>
                <meta name="description" content={`Rita, cadastre um novo agendamento!`} />
                <meta name="keywords" content={`Rita, agendamentos, notificação, teams, discord Paçoca, rede social brasileira, login, entrar, conta, entrar na conta}`} />
                <meta name="author" content="Rita, Paçoca Inc." />
                <meta property="og:title" content={`Rita, cadastre um novo agendamento`} />
                <meta property="og:description" content={`Rita, cadastre um novo agendamento`} />
                <meta property="og:image" content="/img/logo.png" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Rita, cadastre um novo agendamento`} />
                <meta name="twitter:description" content={`Rita, cadastre um novo agendamento`} />
                <meta name="twitter:image" content="/img/logo.png" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet"/>
            </Helmet>

            <AlertNotification success={success} error={error ? error : (errorData ? errorData : "")}/>

            <RegisterLayout title={isEditing ? "Editar" : "Agendar"} description={isEditing ? "Edite seu agendamento" : "Cadastre um novo agendamento"}>
                <div className="space-y-6">
                    {loadingData ? (
                        <div className='flex justify-center'>
                            <LoadingThreeCircle color='blue'/>
                        </div>
                    ) : null}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Título</Label>

                            <Input
                                disabled={loadingData || !!errorData}
                                id="title"
                                className={"mt-1 block w-full" + (errorsInput.title ? " border-red-500 focus:ring-red-500" : "")}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                autoComplete="title"
                                placeholder="Titulo"
                            />

                            {errorsInput.title && (
                                <InputError message={errorsInput.title[0]} />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição</Label>

                            <Input
                                disabled={loadingData || !!errorData}
                                id="description"
                                type="text"
                                className={"mt-1 block w-full" + (errorsInput.description ? " border-red-500 focus:ring-red-500" : "")}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                autoComplete="username"
                                placeholder="Descrição"
                            />

                            {errorsInput.description && (
                                <InputError message={errorsInput.description[0]} />
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Checkbox
                                disabled={loadingData || !!errorData}
                                id="send_notification"
                                checked={data.send_notification}
                                onCheckedChange={(e) => setData("send_notification", Boolean(e))}
                            />
                            <Label htmlFor="send_notification">Enviar por WhatsApp</Label>
                            {errorsInput.send_notification && (
                                <InputError message={errorsInput.send_notification[0]} />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Data do evento</Label>

                            <Input
                                disabled={loadingData || !!errorData}
                                id="date_appointment"
                                type="date"
                                className={"mt-1 block w-full" + (errorsInput.date_appointment ? " border-red-500 focus:ring-red-500" : "")}
                                value={data.date_appointment}
                                onChange={(e) => setData('date_appointment', e.target.value)}
                            />

                            {errorsInput.date_appointment && (
                                <InputError message={errorsInput.date_appointment[0]} />
                            )}
                        </div>

                        {data.send_notification ? (
                            <div className="grid gap-2">
                                <Label htmlFor="description">Data para notificação</Label>

                                <Input
                                    disabled={loadingData || !!errorData}
                                    id="date_notification"
                                    type="date"
                                    className={"mt-1 block w-full" + (errorsInput.date_notification ? " border-red-500 focus:ring-red-500" : "")}
                                    value={data.date_notification}
                                    onChange={(e) => setData('date_notification', e.target.value)}
                                />

                                {errorsInput.date_notification && (
                                    <InputError message={errorsInput.date_notification[0]} />
                                )}
                            </div>
                        ) : null}
                       
                        <div className="flex items-center gap-4">
                            <Button disabled={loading || loadingData || !!errorData}>
                                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {isEditing ? 'Atualizar' : 'Salvar'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </RegisterLayout>
        </AppLayout>
    );
}
