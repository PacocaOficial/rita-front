import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Helmet } from 'react-helmet-async';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configurações de Aparência',
        href: '/perfil/tema',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <Head title="Configurações de Aparência'," /> */}
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
                    <HeadingSmall title="Configurações de Aparência" description="Atualize as suas preferências" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
