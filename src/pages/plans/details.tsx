import { Appointment, QRCode, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import RegisterLayout from '@/layouts/appointments/register';
import { AlertNotification } from '@/components/ui/alert-notification';
import { formattMoneyBRL } from '@/utils/utils';
import { Clapperboard, CreditCard, LoaderCircle, ShoppingCart } from 'lucide-react';
// import { Dialog } from '@radix-ui/react-dialog';
import axios from 'axios';
import { RITA_API_URL } from '@/utils/vars';
import { useAuth } from '@/contexts/auth-context';
import { errorMessage } from '@/utils/text';
import { useParams } from 'react-router-dom';
import { LoadingThreeCircle } from '@/components/ui/loading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Planos',
        href: '/appointments',
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
    months?: string;
}

export default function PlansDetails() {
    // const { appointment } = usePage().props as unknown as { appointment: Appointment };
    // const { plan } = usePage().props as unknown as { plan: Plan };
    const [oldValue, setOldValue] = useState<string>(sessionStorage.getItem("oldValue") || "");
    const [value, setValue] = useState<string>("");
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<Plan>>();
    const [plan, setPlan] = useState<Plan | null>(null);
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

    const alreadyExists = breadcrumbs.some(item => item.title === data.name);

    if(!alreadyExists){
        breadcrumbs.push({
                title: data.name,
                href: `/planos/${id}`,
        });
    }

    useEffect(() => {
        const months = isNaN(Number(data.months)) ? 0 : Number(data.months);
        const monthsvalue = isNaN(Number(data.value)) ? 0 : Number(data.value);

        setTotal(months * monthsvalue)
    }, [data.months, data.value])

    useEffect(() => {
        if (id) {
            loadDataEdit();
            breadcrumbs[1].title = 'Editar';
            breadcrumbs[1].href = `/planos/${id}`;
        } else {
            // Resetar estado para criação
            setPlan({
                id: null,
                name: '',
                description: '',
                value: null,
                quantty_appointments: null,
                icon: '',
                color: '',
            });
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

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        setError("")
        setLoading(true)
        e.preventDefault();

        try {
            let errors: Record<string, string[]> = {};
            
            if (!data.months) {
                errors.name = ["O campo quantidade de meses é obrigatório."];
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
            console.log(responseData);
            

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
                cancel()
                setTimeout(() => window.location.reload(), 1000)
            }

            if(manual && !response.data.sucess){
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

            <AlertNotification success={success} error={error}/>

            <RegisterLayout title={`Detalhes do Plano ${data.name ? `: ${data.name}` : ""}`} description="Compre o plano e pague por pix">
                <div className="space-y-6">

                        {!qrCode ? (
                            <form onSubmit={submit} className="space-y-6">
                                {loadingData ? (
                                    <div className='flex justify-center'>
                                        <LoadingThreeCircle color='blue'/>
                                    </div>
                                ) : (
                                    <>
                                
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
                                                className="mt-1 block w-full"
                                                value={data.months}
                                                onChange={(e) => setData('months', e.target.value)}
                                                required
                                                min={1}
                                                autoComplete="months"
                                                placeholder="Tempo em meses"
                                        />

                                        </div>

                                        <div className="grid gap-2">
                                        <Label htmlFor="name">Valor total:  {`${formattMoneyBRL(Number(total))}`}</Label>

                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button disabled={loading || loadingData || !!errorData}>
                                                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingCart/>}
                                                Gerar QR Code para pagamento
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
                                )}
                        </form>
                        ) : (
                            <>
                                {qrCode ? (
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
                                ) : null}
                            </>
                        )}
                    
                </div>
            </RegisterLayout>
        </AppLayout>
    );
}
