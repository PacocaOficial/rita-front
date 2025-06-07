import { useEffect, useState } from 'react';

interface AlertNotificationProps {
    success?: string;
    error?: string;
}

export function AlertNotification({ success, error }: AlertNotificationProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (success || error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    if (!visible || (!success && !error)) return null;

    return (
        <div
            className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 transition-all duration-300
                ${success ? 'bg-green-500' : 'bg-red-500'}`}
        >
            {success ?? error}
        </div>
    );
}
