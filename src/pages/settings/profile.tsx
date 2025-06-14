import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/auth-context';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configurações do Perfil',
        href: '/perfil',
    },
];

type ProfileForm = {
    name: string;
    user_name: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail?: boolean; status?: string }) {
    const { user } = useAuth();

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: user.name,
        user_name: user.user_name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Rita - Login</title>
                <meta name="description" content={`Rita - Configurações de Aparência!`} />
                <meta name="keywords" content={`Rita, tema, aparencia rede social brasileira, login, entrar, conta, entrar na conta}`} />
                <meta name="author" content="Rita Inc." />
                <meta property="og:title" content={`Rita - Configurações de Aparência`} />
                <meta property="og:description" content={`Rita - Configurações de Aparência`} />
                <meta property="og:image" content="/img/logo.png" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Rita - Configurações de Aparência`} />
                <meta name="twitter:description" content={`Rita - Faça login no paçoca`} />
                <meta name="twitter:image" content="/img/logo.png" />
            </Helmet>
            
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informações" description="" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled
                                autoComplete="name"
                                placeholder="Nome Completo"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome de Usuário</Label>

                            <Input
                                id="user_name"
                                className="mt-1 block w-full"
                                value={data.user_name}
                                onChange={(e) => setData('user_name', e.target.value)}
                                disabled
                                autoComplete="user_name"
                                placeholder="Nome de Usuário"
                            />

                            <InputError className="mt-2" message={errors.user_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled
                                autoComplete="username"
                                placeholder="Email"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>
                    </form>
                </div>

                {/* <DeleteUser /> */}
            </SettingsLayout>
        </AppLayout>
    );
}
