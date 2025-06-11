/* eslint-disable react-hooks/exhaustive-deps */
import { UserPlan, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import RegisterLayout from '@/layouts/appointments/register';
import { AlertNotification } from '@/components/ui/alert-notification';
import {calculateEndDate, formatDateDDMMYYYY, formattMoneyBRL } from "@/utils/utils";
import { Clapperboard, CreditCard, LoaderCircle, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { RITA_API_URL } from '@/utils/vars';
import { useAuth } from '@/contexts/auth-context';
import { errorMessage } from '@/utils/text';
import { useParams } from 'react-router-dom';
import { LoadingThreeCircle } from '@/components/ui/loading';
import InputError from '@/components/input-error';
import { Helmet } from 'react-helmet-async';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Planos',
        href: '/appointments',
    }
];

export interface Plan {
    id?: number | null;
    name: string;
    description: string;
    value: number | null;
    quantty_appointments: number | null;
    icon: string;
    color: string;
    months?: string;
}

export default function PlansDetails() {
    const [oldValue, setOldValue] = useState<string>(sessionStorage.getItem("oldValue") || "");
    const [value, setValue] = useState<string>("");
    const savedPlan = sessionStorage.getItem("planQrCode");
    const initialPlan: Required<Plan> = savedPlan ? JSON.parse(savedPlan) : {};
    const [ planQrCode, setPlanQrCode ] = useState<Plan | null>(initialPlan);
    const { data, setData, recentlySuccessful } = useForm<Required<Plan>>();
    const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
    // const [ userPlan, setUserPlan ] = useState<Plan | null>(null);
    const [ isUserPlan, setIsUserPlan ] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loadingVerifyPayment, setLoadingVerifyPayment] = useState(false);
    const { token } = useAuth();
    const [errorData, setErrorData] = useState("");
    const [loadingData, setLoadingData] = useState(false);
    const { id } = useParams();
    const [errorsInput, setErrorsInput] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [copiado, setCopiado] = useState(false);
    const [qrCode, setQrCode] = useState<any>(() => {
        const savedQrCode = sessionStorage.getItem("qrCode");
        return savedQrCode ? JSON.parse(savedQrCode) : null;
    });
    const [pix, setPix] = useState<any>(() => {
        const savedPix = sessionStorage.getItem("pix");
        return savedPix ? JSON.parse(savedPix) : null;
    });

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(pix.pixCopiaECola);
            setCopiado(true);
            setTimeout(() => setSuccess("Código Copiado")); // Mensagem desaparece após 2 segundos
            setTimeout(() => setCopiado(false), 2000); // Mensagem desaparece após 2 segundos
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    };

    const cancel = () =>{
        setPlanQrCode(null);
        setOldValue("");
        setValue("");
        setLoading(false);
        setQrCode(null);
        setPix(null);

        sessionStorage.removeItem("qrCode")
        sessionStorage.removeItem("pix")
        sessionStorage.removeItem("oldValue")
    }

    useEffect(() => {
        if (qrCode) sessionStorage.setItem("qrCode", JSON.stringify(qrCode));
        if (pix) sessionStorage.setItem("pix", JSON.stringify(pix));
        if (value) sessionStorage.setItem("oldValue", value);
    }, [qrCode, pix, value]);


    useEffect(() => {
        const months = isNaN(Number(data.months)) ? 0 : Number(data.months);
        const monthsvalue = isNaN(Number(data.value)) ? 0 : Number(data.value);

        setTotal(months * monthsvalue)
    }, [data.months, data.value])

    useEffect(() => {
        const alreadyExists = breadcrumbs.some(item => item.title === data.name);
        if(!alreadyExists){
            breadcrumbs.push({
                title: data.name,
                href: `/planos/${id}`,
            });
        }

        if (id) {
            loadDataEdit();
            setError("");
            setErrorData("");
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
            setData(data.plan);
            setIsUserPlan(data.plan.id === data?.userPlan?.plan?.id)
            setUserPlan(data.userPlan);
        } catch (err: any) {
            const messageError = errorMessage(err);
            setErrorData(messageError);
            console.error("Erro ao carregar dados: ", messageError);
            console.error("Erro ao carregar dados: ", err);
        } finally {
            setLoadingData(false);
        }
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setErrorsInput({});
        setError("")
        setLoading(true)

        try {
            let errors: Record<string, string[]> = {};
            
            if (!data.months) {
                errors.months = ["O campo quantidade de meses é obrigatório."];
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

            
            const url = `${RITA_API_URL}/payments/plan`;
            const response = await axios.post(url, {
                months: data.months, 
                plan_id: data.id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            const responseData = response?.data;
            sessionStorage.setItem("planQrCode", JSON.stringify(data));
            setPlanQrCode(data);

            if(responseData?.success) {
                setSuccess(responseData?.message)
                setQrCode(responseData.qrcode)
                setPix(responseData.pix)
                setValue(responseData.total)
            }
            else setError(responseData?.message)

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

    const verifyPayment = async (manual = false) => {
        if(manual) setLoadingVerifyPayment(true)
        
        try {
            const response = await axios.post(`${RITA_API_URL}/payments/verify-payment/${pix.txid}`, {
                txid: pix.txid,
            },{
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}` // Adicione o token aqui
                }
            });

            if(response?.data?.success){
                setSuccess(response?.data?.message);
                // setTimeout(() => window.location.reload(), 1000)
            }

            if(manual && !response.data.success){
                setSuccess(`Pagamento não confirmado, espere mais alguns minutos`);
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
            setLoadingVerifyPayment(false)
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
                <Helmet>
                    {data?.name && (
                        <>
                            <title>{`Rita - Plano: ${data.name}`}</title>
                            <meta name="description" content={`Rita - Plano: ${data?.name}!`} />
                            <meta name="keywords" content={`Rita - agendamentos, notificação, teams, discord Paçoca, rede social brasileira, login, entrar, conta, entrar na conta}`} />
                            <meta name="author" content="Rita - Paçoca Inc." />
                            <meta property="og:title" content={`Rita - Plano: ${data?.name}`} />
                            <meta property="og:description" content={`Rita - Plano: ${data?.name}`} />
                            <meta property="og:image" content="/img/logo.png" />
                            <meta property="og:url" content={window.location.href} />
                            <meta property="og:type" content="website" />
                            <meta name="twitter:card" content="summary_large_image" />
                            <meta name="twitter:title" content={`Rita - Plano: ${data?.name}`} />
                            <meta name="twitter:description" content={`Rita - Plano: ${data?.name}`} />
                            <meta name="twitter:image" content="/img/logo.png" />
                            <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet"/>
                        </>
                    )}
                </Helmet>

            <AlertNotification success={success} error={error ? error : (errorData ? errorData : "")}/>

            <RegisterLayout title={`${isUserPlan ? "Renovar meu plano" : "Plano"}  ${data.name ? `: ${data.name}` : ""}`} description={isUserPlan ? "Renove o seu plano ": "Compre o plano e pague por pix"}>
                <div className="space-y-6">

                        {qrCode && planQrCode?.id && planQrCode?.id === data.id  ? (
                            <>
                                <p className="w-100">Pague pelo QRCode ou copie o código no seu banco favorito:</p>
                                <h3 className="w-100 text-center" style={{marginTop: ""}}>{`${formattMoneyBRL(Number(oldValue || total))}`}</h3>
                                
                                <div className="d-flex">
                                    <img src={qrCode.imagemQrcode} width="300" alt="QR Code PIX" style={{margin: "0 auto"}}/>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-4">
                                    <button
                                        onClick={copyLink}
                                        type="button"
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 transition"
                                    >
                                        <Clapperboard className="w-5 h-5" />
                                        {copiado ? "Copiado!" : "Copiar código"}
                                    </button>

                                    <button disabled={loadingVerifyPayment} onClick={() => verifyPayment(true)} type="button" className="cursor-pointer flex items-center gap-2 px-4 py-2 ml-2 bg-blue-600 text-white rounded-2xl shadow-md transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" style={{marginLeft: "10px"}}>
                                        {loadingVerifyPayment ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CreditCard style={{height: "20px", marginRight: "9px"}}/> } 
                                        Verificar Pagamento
                                    </button>


                                    <button
                                        onClick={cancel}
                                        type="button"
                                        className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-2xl shadow-md hover:bg-gray-300 transition"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={submit} className="space-y-6">
                                {loadingData ? (
                                    <div className='flex justify-center'>
                                        <LoadingThreeCircle color='blue'/>
                                    </div>
                                ) : (
                                    <>
                                        { !errorData ? (
                                            <>
                                                {userPlan ? (
                                                    <>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="name">Data de término:  {formatDateDDMMYYYY(userPlan.end_date)}</Label>
                                                        </div>
                                                    </>
                                                ) : null}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Valor do plano por mês:  {`${formattMoneyBRL(Number(data.value))}`}</Label>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Quantidade de agendamentos por mês:  {data.quantty_appointments}</Label>
                                                </div>


                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Tempo em meses</Label>

                                                    <Input
                                                        id="months"
                                                        type='number'
                                                        className={"mt-1 block w-full" + (errorsInput.months ? " border-red-500 focus:ring-red-500" : "")}
                                                        value={data.months}
                                                        onChange={(e) => setData('months', e.target.value)}
                                                        min={1}
                                                        autoComplete="months"
                                                        placeholder="Tempo em meses"
                                                    />
                                                    {errorsInput.months && (
                                                        <InputError message={errorsInput.months[0]} />
                                                    )}

                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Valor total:  {`${formattMoneyBRL(Number(total))}`}</Label>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        {isUserPlan? "Nova data " : "Data "}
                                                         de término:  {calculateEndDate(userPlan?.end_date ?? String(new Date()), isNaN(Number(data.months)) ? 0 : Number(data.months) )}</Label>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button disabled={loading || loadingData || !!errorData}>
                                                        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingCart/>}
                                                        { userPlan && isUserPlan ? "Renovar plano" : (userPlan ? "Mudar de plano" : "Gerar QR Code para pagamento") }
                                                    </Button>

                                                    <Transition
                                                            show={recentlySuccessful}
                                                            enter="transition ease-in-out"
                                                            enterFrom="opacity-0"
                                                            leave="transition ease-in-out"
                                                            leaveTo="opacity-0"
                                                    >
                                                            <p className="text-sm text-neutral-600">Salvo</p>
                                                    </Transition>
                                                </div>
                                            </>
                                        ) : null}
                                    </>
                                )}
                        </form>
                        )}
                    
                </div>
            </RegisterLayout>
        </AppLayout>
    );
}
