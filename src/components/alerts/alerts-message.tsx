import React, { useEffect, useRef, useState } from 'react';
import { useMessage } from '@/contexts/message-context';
// import "./style.css"

const AlertMessage: React.FC = () => {
    const { message, messageType, clearMessage, title } = useMessage();
    const [className, setClassName ] = useState("");

    useEffect(() => {
        let timer: NodeJS.Timeout;

        // Inicia o temporizador para fechar o alerta após 5 segundos
        if (message) {
            timer = setTimeout(() => {
                clearMessage();
            }, 5000); // 5000 ms = 5 segundos
        }

        // Limpa o timer se o componente for desmontado ou `message` mudar
        return () => {
            clearTimeout(timer);
        };
    }, [message, clearMessage]);

    useEffect(() => {
        if(messageType === 'error')
            setClassName('alert-danger')
        if(messageType === 'success')
            setClassName('alert-success')
        if(messageType === 'warning')
            setClassName('alert-warning')
    }, [messageType]);

    if (!message) return null; // Retorna null apenas após o useEffect

    return (
        <div className={`alert alert-message alert-dismissible fade show ${className}`} role="alert">
            {title ? (
                <b>{title} <br /></b>
            ) : null}
            {message}
            <button type="button" className="btn-close" aria-label="Close" onClick={clearMessage}></button>
        </div>
    );
};

export default AlertMessage;
