import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ScrollText,Clipboard, ShoppingCart, BookOpen, ContactRound, AmpersandIcon } from 'lucide-react';
import AppLogo from './app-logo';
import { isAdmin } from '@/utils/auths';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Home',
    //     href: '/dashboard',
    //     icon: LayoutGrid,
    // },
    {
        title: 'Meus agendamentos',
        href: route('appointments.index'),
        icon: Clipboard,
    },
    {
        title: 'Agendar',
        href: route('appointments.register'),
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
    const page = usePage<SharedData>();
    const { auth } = page.props;

    if (isAdmin(auth.user)) {
        const alreadyExists = mainNavItems.some(item => item.title === 'Gerenciar planos');

        if (!alreadyExists) {
            mainNavItems.push({
                title: 'Gerenciar planos',
                href: '/plans/manage',
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
                            <Link href="/" prefetch>
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
