import { AppointmentPagination, Plan, type BreadcrumbItem } from '@/types';
import axios from "axios";
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import IndexLayout from '@/layouts/appointments/index';
import { AlertNotification } from '@/components/ui/alert-notification';
import { BadgeDollarSign, Gift, Pencil, Rocket } from 'lucide-react';
import DeletePlan from '@/components/delete-plan';
import { useEffect, useState } from 'react';
import { LoadingThreeCircle } from '@/components/ui/loading';
import { RITA_API_URL } from '@/utils/vars';
import { useAuth } from '@/contexts/auth-context';
import { errorMessage } from '@/utils/text';
import { Link } from 'react-router-dom';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Planos',
        href: '/planos/gerenciar',
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

export default function PlansManage() {
    const [plans, setPlans] = useState<PlansPagination>({} as PlansPagination);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { token } = useAuth();
    const [success, setSuccess] = useState<string>("");

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
            setPlans(data);
            
        } catch (err: any) {
            const messageError = errorMessage(err);
            setError(messageError);
            console.error("Erro ao listar: ", messageError);
            console.error("Erro ao listar: ", err);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteAppointment = (deletedId: number) => {
        setSuccess("Agendamento excluido")
        setPlans((prev) => ({
            ...prev,
            data: prev.data.filter((appt) => appt.id !== deletedId), // remove localmente
            total: prev.total - 1,
        }));
    };
    

    return (
        
        <AppLayout breadcrumbs={breadcrumbs}>
            <AlertNotification success={success} error={error}/>

                <IndexLayout title='Planos' description='Visualize os planos'>
                    <Link to={"/planos/novo"}>
                        <Button className='text-sm mb-4'>
                            Adicionar Plano
                        </Button>
                    </Link>
                    {loading ? (
                        <div className='flex justify-center'>
                            <LoadingThreeCircle color='blue'/>
                        </div>
                    ) : null}
                    
                    {plans?.data?.length === 0 ? (
                        <p className="text-neutral-600">Nenhum plano encontrado.</p>
                    ) : (
                        <ul className="flex flex-wrap gap-4 items-stretch">
                            {plans?.data?.map((plan) => {
                                const IconComponent = iconMap[plan.icon as IconName];

                                return (
                                    <li
                                    key={plan.id}
                                    className="border rounded-md p-4 shadow-sm flex flex-col justify-between w-full md:w-[calc(33.333%-1rem)]"
                                    >
                                    <div>
                                        <div className={`flex items-center gap-2 mb-4 ${plan.color}`}>
                                            {IconComponent && <IconComponent className="w-5 h-5" />}
                                            <h3 className="text-xl font-bold">{plan.name}</h3>
                                        </div>
                                        <p className="text-sm text-neutral-700">{plan.description}</p>
                                        <p className="text-sm text-neutral-500">
                                            Preço: R$ {Number(plan.value).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Link to={`/planos/${plan.id}`}>
                                            <Button variant="outline">
                                                <Pencil/>
                                            </Button>
                                        </Link>

                                        <DeletePlan onDelete={handleDeleteAppointment} id={plan.id} />
                                    </div>
                                    </li>
                            )})}
                        </ul>
                    )}

                    {plans.per_page < plans.total && (
                        <div className="flex gap-2 mt-4">
                            {plans.links.map((link, index) => (
                                <Link key={index} to={link.url ?? ''} className={"..."}>
                                    {link.label.replace(/&laquo;|&raquo;/g, '').trim() || '...'}
                                </Link>
                            ))}
                        </div>
                    )}
            </IndexLayout>
        </AppLayout>
    );
}
