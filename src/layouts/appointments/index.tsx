import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { type PropsWithChildren } from 'react';

type RegisterLayoutProps = PropsWithChildren<{
    title: string;
    description: string;
}>;

export default function IndexLayout({ children, title, description }: RegisterLayoutProps) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <Heading title={title} description={description} />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <Separator className="my-6 md:hidden" />
            </div>

            {children}
        </div>
    );
}
