import { Appointment, type BreadcrumbItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import IndexLayout from '@/layouts/appointments/index';
import { AlertNotification } from '@/components/ui/alert-notification';
import DeleteAppointment from '@/components/delete-appointment';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorAlert from '@/components/alerts/alert-error';
import { RITA_API_URL } from '@/utils/vars';
import axios from "axios"
import { errorMessage } from '@/utils/text';
import { useAuth } from '@/contexts/auth-context';
import { LoadingThreeCircle } from '@/components/ui/loading';
import { Link } from 'react-router-dom';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meus Agendamentos',
        href: '/appointments',
    },
];

type AppointmentPagination = {
    current_page: number;
    data: Appointment[];
    first_page_url: string;
    last_page_url: string;
    links: Array<{ url: string | null, label: string, active: boolean }>;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    per_page: number;
    id: number;
}

export default function AppointmentsIndex() {
    const [appointments, setAppointments] = useState<AppointmentPagination>({} as AppointmentPagination);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { token } = useAuth();

    useEffect(() => {
        load()
    }, [])

    const load = async() => {
        const url = `${RITA_API_URL}/appointments`;
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
            setAppointments(data);
            
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
        setAppointments((prev) => ({
            ...prev,
            data: prev.data.filter((appt) => appt.id !== deletedId), // remove localmente
            total: prev.total - 1,
        }));
    };


    return (
        
        <AppLayout breadcrumbs={breadcrumbs}>
                {/* {error && <ErrorAlert show={!!error} message={error} onClose={() => setError("")} />} */}
                <AlertNotification success={success} error={error}/>

                <IndexLayout title='Meus Agendamentos' description='Visualize seus agendamentos'>
                    {loading ? (
                        <div className='flex justify-center'>
                            <LoadingThreeCircle color='blue'/>
                        </div>
                    ) : null}
                    {!appointments || appointments?.data?.length === 0 ? (
                        <p className="text-neutral-600">Nenhum agendamento encontrado.</p>
                    ) : (
                        <ul className="flex flex-wrap gap-4 items-stretch">
                            {appointments?.data?.map((appointment) => (
                                <li
                                key={appointment.id}
                                className="border rounded-md p-4 shadow-sm flex flex-col justify-between w-full md:w-[calc(33.333%-1rem)]"
                                >
                                <div>
                                    <h3 className="text-lg font-semibold">{appointment.title}</h3>
                                    <p className="text-sm text-neutral-700">{appointment.description}</p>
                                    <p className="text-sm text-neutral-500">
                                    Data: {appointment.date_appointment}
                                    </p>
                                    <p className="text-sm">
                                    Notificação: {appointment.send_notification ? 'Sim' : 'Não'}
                                    </p>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Link to={`/agendamentos/${appointment.id}`}>
                                        <Button variant="outline">
                                            <Pencil/>
                                        </Button>
                                    </Link>

                                    <DeleteAppointment onDelete={handleDeleteAppointment} id={appointment.id} />
                                </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {appointments.per_page < appointments.total && (
                        <div className="flex gap-2 mt-4">
                            {appointments.links.map((link, index) => (
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
