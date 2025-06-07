import { Appointment, type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import IndexLayout from '@/layouts/appointments/index';
import { AlertNotification } from '@/components/ui/alert-notification';
import DeleteAppointment from '@/components/delete-appointment';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import ErrorAlert from '@/components/alerts/alert-error';

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
    // const { appointments } = (usePage().props as unknown) as { appointments: AppointmentPagination };
    const [appointments, setAppointments] = useState<AppointmentPagination>({} as AppointmentPagination);
    const [errorsInput, setErrorsInput] = useState<Record<string, string[]>>({});
    const [error, setError] = useState<string>("");

    return (
        
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <Head title="Meus Agendamentos" /> */}
                {error && <ErrorAlert show={!!error} message={error} onClose={() => setError("")} />}

                <IndexLayout title='Meus Agendamentos' description='Visualize seus agendamentos'>
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
                                    <Link href={`/appointments/${appointment.id}`}>
                                        <Button variant="outline">
                                            <Pencil/>
                                        </Button>
                                    </Link>

                                    {/* <form onSubmit={(e) => deleteAppointment(e, appointment.id)}>
                                        <Button variant="outline">Excluir</Button>
                                    </form> */}
                                    <DeleteAppointment id={appointment.id} />
                                </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {appointments.per_page < appointments.total && (
                        <div className="flex gap-2 mt-4">
                            {appointments.links.map((link, index) => (
                                <Link key={index} href={link.url ?? ''} className={"..."}>
                                    {link.label.replace(/&laquo;|&raquo;/g, '').trim() || '...'}
                                </Link>
                            ))}
                        </div>
                    )}
            </IndexLayout>
        </AppLayout>
    );
}
