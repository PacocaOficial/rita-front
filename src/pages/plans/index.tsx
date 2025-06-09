import { AppointmentPagination, Plan, type BreadcrumbItem } from '@/types';
import axios  from "axios";
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import IndexLayout from '@/layouts/appointments/index';
import { BadgeDollarSign, Gift, Rocket } from 'lucide-react';
import { formattMoneyBRL } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { RITA_API_URL } from '@/utils/vars';
import { useAuth } from '@/contexts/auth-context';
import { errorMessage } from '@/utils/text';
import { AlertNotification } from '@/components/ui/alert-notification';
import { LoadingThreeCircle } from '@/components/ui/loading';
import { Link } from 'react-router-dom';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Planos',
        href: '/plans',
    },
];

const iconMap = {
  Gift,
  Rocket,
  BadgeDollarSign,
} as const;

type IconName = keyof typeof iconMap;

type PlansPagination = {
    current_page: number;
    data: Plan[];
    first_page_url: string;
    last_page_url: string;
    links: Array<{ url: string | null, label: string, active: boolean }>;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    per_page: number;
    id: number;
}

export default function PlansIndex() {
    const [oldValue, setOldValue] = useState<string>(sessionStorage.getItem("oldValue") || "");
    const [value, setValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { token, user } = useAuth();
    const [plans, setPlans] = useState<PlansPagination>({} as PlansPagination);
    const [userPlan, setUserPlan] = useState<Plan | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSucess] = useState<string>("");
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
            setTimeout(() => setSucess("Código Copiado")); // Mensagem desaparece após 2 segundos
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

    useEffect(() => {
        load()
    }, [])

    const load = async() => {
        const url = `${RITA_API_URL}/plans`;
            setLoading(true);

        try {
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = response.data;
            setPlans(data.plans);
            setUserPlan(data?.user_plan)
            setOldValue(data?.total)
            setQrCode(data?.qrcode)
            setPix(data?.pix)

            console.log(data?.user_plan);
            console.log(data.plans);
            
            
        } catch (err: any) {
            const messageError = errorMessage(err);
            setError(messageError);
            console.error("Erro ao listar: ", messageError);
            console.error("Erro ao listar: ", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <AlertNotification success={""} error={error}/>

            <IndexLayout title='Planos' description='Escolha o plano que melhor se adapta às suas necessidades'>
                {loading ? (
                    <div className='flex justify-center'>
                        <LoadingThreeCircle color='blue'/>
                    </div>
                ) : null}
                {plans?.data?.length === 0 ? (
                    <p className="text-neutral-600">Nenhum plano encontrado.</p>
                ) : (
                    <ul className="flex flex-wrap gap-4 items-stretch mt-4 ">
                        {plans?.data?.map((plan) => {
                            const IconComponent = iconMap[plan.icon as IconName];

                            return (
                                <li key={plan.id} className="mb=4 flex flex-col justify-between border rounded-lg p-6 shadow-md w-full md:w-[calc(33.333%-1rem)] bg-zinc-900">
                                    <div>
                                        <div className={`flex items-center gap-2 mb-4 ${plan.color}`}>
                                            {IconComponent && <IconComponent className="w-5 h-5" />}
                                            <h3 className="text-xl font-bold">{plan.name}</h3>
                                        </div>
                                        <p className="text-sm text-neutral-300">
                                            {plan.description}
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        {(!userPlan && plan.value === 0) ||  (userPlan?.id === plan.id) ? (
                                            <div className="mt-6">
                                                <Button
                                                    variant="outline"
                                                    className="w-full cursor-default pointer-events-none text-muted-foreground border-muted"
                                                >
                                                    Seu plano atual
                                                </Button>
                                            </div>
                                        ) : (
                                            <Link to={`/planos/${plan.id}`}>
                                                <Button variant="default" className="w-full">
                                                    {`${formattMoneyBRL(Number(plan.value))}`}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </IndexLayout>
        </AppLayout>
    );
}
