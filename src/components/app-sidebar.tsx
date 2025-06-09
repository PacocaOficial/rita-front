import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
// import { Link } from '@inertiajs/react';
import { ScrollText,Clipboard, ShoppingCart, BookOpen, ContactRound, AmpersandIcon } from 'lucide-react';
import AppLogo from './app-logo';
import { isAdmin } from '@/utils/auth';
import { useAuth } from '@/contexts/auth-context';
import { Link } from 'react-router-dom';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Home',
    //     href: '/dashboard',
    //     icon: LayoutGrid,
    // },
    {
        title: 'Meus agendamentos',
        href: "/agendamentos",
        icon: Clipboard,
    },
    {
        title: 'Agendar',
        href: "agendamentos/novo",
        icon: ScrollText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Planos',
        href: '/plans',
        icon: ShoppingCart,
    },
    {
        title: 'Read Books',
        href: "https://readbooks.site",
        icon: BookOpen,
    },
    {
        title: 'Paçoca - Rede Social',
        href: "https://pacoca.site",
        icon: ContactRound,
    },
    // {
    //     title: 'Contribua no Github',
    //     href: 'https://github.com/JoaoEnrique/rita',
    //     icon: Github,
    // },
    // {
    //     title: 'Documentação',
    //     href: 'https://github.com/JoaoEnrique/rita/blob/main/README.md',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { user } = useAuth();

    // Gera os itens dinamicamente em vez de mutar um array fora do componente
    const mainItems: NavItem[] = [
        {
            title: 'Meus agendamentos',
            href: "/agendamentos",
            icon: Clipboard,
        },
        {
            title: 'Agendar',
            href: "agendamentos/novo",
            icon: ScrollText,
        },
    ];

    if (isAdmin(user)) {
        mainItems.push({
            title: 'Gerenciar planos',
            href: '/plans/manage',
            icon: AmpersandIcon,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/agendamentos">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
