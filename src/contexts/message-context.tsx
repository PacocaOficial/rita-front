import React, { createContext, useContext, useState } from 'react';

type MessageType = 'success' | 'error' | "warning" | null;

interface MessageContextType {
    message: string;
    title?: string | null;
    messageType: MessageType;
    setMessage: (message: string, type: MessageType, title?: string, onCloseClick?: () => void) => void;
    clearMessage: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string>("");
    const [title, setTitle] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>(null);
    const [onCloseClickButton, setOnCloseClickButton] = useState<(() => void) | null>(null);

    const handleSetMessage = (msg: string, type: MessageType, title?: string, onCloseClick?: () => void) => {
        setMessage(msg);
        setTitle(title || null);
        setMessageType(type);
        setOnCloseClickButton(() => onCloseClick || null); // Armazena a função opcional
    };

    const clearMessage = () => {
        setMessage("");
        setMessageType(null);
        setTitle(null);
        
        if (onCloseClickButton) {
            onCloseClickButton(); // Executa a função se existir
            setOnCloseClickButton(null); // Reseta a função para evitar reuso inesperado
        }
    };

    return (
        <MessageContext.Provider value={{ message, messageType, setMessage: handleSetMessage, clearMessage, title }}>
            {children}
        </MessageContext.Provider>
    );
};
        