import { BadgeDollarSign, Gift, Rocket } from 'lucide-react';

interface LucideIconProps{
        name: string
        className?: string
}

const iconMap = {
  Gift,
  Rocket,
  BadgeDollarSign,
} as const;

type IconName = keyof typeof iconMap;

export function LucideIcon({ name, className } : LucideIconProps){
        const IconComponent = iconMap[name as IconName];

        return <IconComponent className={className}/>
}