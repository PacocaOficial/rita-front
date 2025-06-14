import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    user_name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    user_name: string;
    img_account: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    plan: Plan
    [key: string]: unknown; // This allows for additional properties...
}

export interface Appointment {
    id: number;
    title: string;
    description: string;
    date_appointment: string;
    date_notification: string;
    send_notification: boolean;
}

export interface Plan {
    id: number;
    name: string;
    description: string;
    value: number | null;
    quantty_appointments: number | null;
    icon: string;
    color: string;
}

export interface UserPlan {
    id: number;
    plan: Plan
    payment_id: number;
    user_id: number;
    plan_id: number | null;
    start_date: Date;
    end_date: string;
}

type AppointmentPagination = {
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

type QRCode = {
    image: string;
    copyAndPaste: string;
}