import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
// import { Link } from '@inertiajs/react';
import { ScrollText,Clipboard, ShoppingCart, BookOpen, ContactRound, AmpersandIcon, MessageCircle } from 'lucide-react';
import AppLogo from './app-logo';
import { isAdmin } from '@/utils/auth';
import { useAuth } from '@/contexts/auth-context';
import { Link } from 'react-router-dom';

const mainNavItems: NavItem[] = [

    {
        title: 'Meus agendamentos',
        href: "/agendamentos",
        icon: Clipboard,
    },
    {
        title: 'Agendar',
        href: "/agendamentos/novo",
        icon: ScrollText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Planos',
        href: '/planos',
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
    {
        title: 'Cronos - Chat',
        href: "https://cronos.pacoca.site",
        icon: MessageCircle,
    },
];

export function AppSidebar() {
    const { user } = useAuth();
    
    if (isAdmin(user)) {
        const alreadyExists = mainNavItems.some(item => item.title === 'Gerenciar planos');

        if (!alreadyExists) {
            mainNavItems.push({
                title: 'Gerenciar planos',
                href: '/planos/gerenciar',
                icon: AmpersandIcon,
            });
        }
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
