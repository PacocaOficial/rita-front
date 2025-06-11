/* eslint-disable react-hooks/exhaustive-deps */
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import axios from "axios";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import RegisterLayout from '@/layouts/appointments/register';
import { AlertNotification } from '@/components/ui/alert-notification';
import { RITA_API_URL } from '@/utils/vars';
import { useNavigate, useParams } from 'react-router-dom';
import { errorMessage } from '@/utils/text';
import { useAuth } from '@/contexts/auth-context';
import { LoaderCircle } from 'lucide-react';
import { LoadingThreeCircle } from '@/components/ui/loading';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { LucideIcon } from '@/components/ui/lucide-icon';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gerenciar planos',
        href: '/plans',
    },
    {
        title: 'Cadastrar',
        href: '/planos/novo',
    },
];

export interface Plan {
    id?: number | null;
    name: string;
    description: string;
    value: number | null;
    quantty_appointments: number | null;
    icon: string;
    color: string;
}

export default function PlansRegister() {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, errors, recentlySuccessful } = useForm<Required<Plan>>();
    const [errorsInput, setErrorsInput] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [errorData, setErrorData] = useState("");
    const { id } = useParams();
    const { token } = useAuth();
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setLoadingData(true);
            loadDataEdit();
            breadcrumbs[1].title = 'Editar';
            breadcrumbs[1].href = `/planos/${id}`;
        } else {
            // Resetar estado para criação
            setIsEditing(false);
            setData({
                id: null,
                name: '',
                description: '',
                value: null,
                quantty_appointments: null,
                icon: '',
                color: '',
            });
            setErrorsInput({});
            setError("");
            setErrorData("");
            breadcrumbs[1].title = 'Agendar';
            breadcrumbs[1].href = `/planos/novo`;
        }
    }, [id]);

    const loadDataEdit = async () => {
        setLoadingData(true)

        try {
            const response = await axios.get(`${RITA_API_URL}/plans/${id}`, {
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


    if (isEditing) {
        breadcrumbs[1].title = 'Editar';
        breadcrumbs[1].href = `/plans/${data.id}`;
    }

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        setLoading(true)
        setErrorsInput({})
        setError("")
        e.preventDefault();
        console.log(`${RITA_API_URL}/plans`);
        

        try {
            let errors: Record<string, string[]> = {};
            
            if (!data.name) {
                errors.name = ["O campo nome é obrigatório."];
            }
            if (!data.description) {
                errors.description = ["O campo descrição é obrigatório."];
            }
            if (data.value == null) {
                errors.value = ["O campo value é obrigatório."];
            }
            if (!data.quantty_appointments) {
                errors.quantty_appointments = ["O campo quantidade de agendamentos é obrigatório."];
            }
            if (!data.icon) {
                errors.icon = ["O campo icone é obrigatório."];
            }
            if (!data.color) {
                errors.color = ["O campo cor é obrigatório."];
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
            const url = `${RITA_API_URL}/plans/manage`;
            const response = isEditing ? await axios.patch(url, data, config) : await axios.post(url, data, config);
            const responseData = response?.data;

            if(responseData?.success) setSuccess(responseData?.message)
            else setError(responseData?.message)

            if(!isEditing && responseData.plan){
                navigate(`/planos/gerenciar/${responseData.plan.id}`);
            }
        } catch (err: any) {
            if (err?.response?.data.errors) {
                setErrorsInput(err.response.data.errors); // Atualiza o estado com os erros
            } else {
                const messageError = errorMessage(err);
                setError(messageError);
                console.error("Erro ao salvar plano: ", messageError);
                console.error("Erro ao salvar plano: ", err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <AlertNotification success={success} error={error ? error : (errorData ? errorData : "")}/>

            <RegisterLayout title={isEditing ? "Editar Plano" : "Adicionar Plano"} description={isEditing ? "Edite esse plano" : "Cadastre um novo plano"}>
                {loadingData ? (
                    <div className='flex justify-center'>
                        <LoadingThreeCircle color='blue'/>
                    </div>
                ) : null}
                    
                <div className="space-y-6">

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>

                            <Input
                                disabled={loadingData || !!errorData}
                                id="name"
                                className={"mt-1 block w-full" + (errorsInput.name ? " border-red-500 focus:ring-red-500" : "")}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                placeholder="Titulo"
                            />

                            {errorsInput.name && (
                                <InputError message={errorsInput.name[0]} />
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

                        <div className="grid gap-2">
                            <Label htmlFor="value">Preço</Label>

                            <Input
                                disabled={loadingData || !!errorData}
                                id="value"
                                type="number"
                                className={"mt-1 block w-full" + (errorsInput.value ? " border-red-500 focus:ring-red-500" : "")}
                                value={data.value ?? ''}
                                onChange={(e) => setData('value', Number(e.target.value))}
                                autoComplete="value"
                                placeholder="R$ 0,00"
                            />

                            {errorsInput.value && (
                                <InputError message={errorsInput.value[0]} />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="value">Quantidade de agendamentos por mês</Label>

                            <Input
                                disabled={loadingData || !!errorData}
                                id="quantty_appointments"
                                type="number"
                                className={"mt-1 block w-full" + (errorsInput.quantty_appointments ? " border-red-500 focus:ring-red-500" : "")}
                                value={data.quantty_appointments ?? ''}
                                onChange={(e) => setData('quantty_appointments', Number(e.target.value))}
                                autoComplete="value"
                                placeholder="1"
                            />

                            {errorsInput.quantty_appointments && (
                                <InputError message={errorsInput.quantty_appointments[0]} />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="icon">Icone (lucide icon)</Label>

                            <Select
                                disabled={loadingData || !!errorData}
                                value={data.icon}
                                onValueChange={(value) => setData('icon', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="Gift">
                                        <LucideIcon name="Gift" /> Gift
                                    </SelectItem>
                                    <SelectItem value="Rocket">
                                        <LucideIcon name="Rocket" /> Rocket
                                    </SelectItem>
                                    <SelectItem value="BadgeDollarSign">
                                        <LucideIcon name="BadgeDollarSign" /> BadgeDollarSign
                                    </SelectItem>
                                </SelectContent>
                            </Select>


                            {errorsInput.icon && (
                                <InputError message={errorsInput.icon[0]} />
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="color">Cor (hexadecimal, rgb)</Label>

                            <Input
                                disabled={loadingData || !!errorData}
                                id="color"
                                type="text"
                                className={"mt-1 block w-full" + (errorsInput.title ? " border-red-500 focus:ring-red-500" : "")}
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                autoComplete="username"
                                placeholder="#000"
                            />

                            <InputError className="mt-2" message={errors.color} />
                        </div>
                       
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
