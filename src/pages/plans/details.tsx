import { Appointment, Plan, QRCode, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import RegisterLayout from '@/layouts/appointments/register';
import { AlertNotification } from '@/components/ui/alert-notification';
import { formattMoneyBRL } from '@/utils/utils';
import { ShoppingCart } from 'lucide-react';
// import { Dialog } from '@radix-ui/react-dialog';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Planos',
        href: '/appointments',
    },
];

type ProfileForm = {
    id?: number | null;
    title: string;
    months: string;
    send_notification: boolean;
    date_appointment: string;
    date_notification: string;
}

export default function PlansDetails() {
    const { props } = usePage();
    const { appointment } = usePage().props as unknown as { appointment: Appointment };
    const { plan } = usePage().props as unknown as { plan: Plan };
    const isEditing = Boolean(appointment);
    const qrCode = {} as QRCode;
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        id: appointment?.id || null,
        title: appointment?.title || '',
        months: '1',
        send_notification: appointment?.send_notification || false,
        date_appointment: appointment?.date_appointment || '',
        date_notification: appointment?.date_notification || '',
    });
    const total = Number(plan.value) * Number(data.months);

    const alreadyExists = breadcrumbs.some(item => item.title === plan.name);

    if(!alreadyExists){
        breadcrumbs.push({
                title: plan.name,
                href: route('plans.details', plan.id),
        });
}

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing) {
            post(route('appointments.update', appointment.id), {
                preserveScroll: true,
            });
            return;
        }

        post(route('appointments.register'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={plan.name} />

            <AlertNotification success={props.success as string | undefined} error={props.error as string | undefined}/>

            <RegisterLayout title={`Detalhes do Plano: ${plan.name}`} description="Compre o plano e pague por pix">
                <div className="space-y-6">

                        {!qrCode.image ? (
                            <form onSubmit={submit} className="space-y-6">
                                <Input
                                        id="id"
                                        type='text'
                                        className="mt-1 block w-full"
                                        value={data.id}
                                        required
                                        autoComplete="id"
                                        placeholder="Tempo em meses"
                                />
                        
                                <div className="grid gap-2">
                                        <Label htmlFor="name">Valor do plano por mês:  {`${formattMoneyBRL(Number(plan.value))}`}</Label>
                                </div>

                                <div className="grid gap-2">
                                <Label htmlFor="name">Quantidade de agendamentos por mês:  {plan.quantty_appointments}</Label>

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

                                <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                <Label htmlFor="name">Valor total:  {`${formattMoneyBRL(Number(total))}`}</Label>

                                <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                        <ShoppingCart/>
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
                        </form>
                        ) : (
                            <div className="flex justify-center">
                               
                                <p>QR Code gerado: {qrCode.copyAndPaste}</p>
                            </div>
                        )}
                    
                </div>
            </RegisterLayout>
        </AppLayout>
    );
}
