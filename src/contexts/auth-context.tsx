import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { errorMessage } from "@/utils/text";
import { useMessage } from "@/contexts/message-context";
import { User } from "@/types";
import { PACOCA_API_URL } from "@/utils/vars";

interface AuthContextType {
    user: User;
    loginContext: (token: string, user: User, remember: boolean) => void;
    logout: (redirect?: boolean, logoutApi?: boolean, removeFromSession?: boolean) => void;
    setUser: (user: User) => void;
    fetchUser: () => Promise<void>;
    addOtherAccount: () => void;
    isSuper: () => boolean;
    removeUserFromSession: (id_user: number) => void;
    changeUser: (id_user: number) => void;
    isAuthenticated: boolean;
    token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation(); // Obtém a rota atual
    const [token, setToken] = useState<string>(() => sessionStorage.getItem("token") || localStorage.getItem("token") || "");
    const navigate = useNavigate();
    const { setMessage } = useMessage();

    // Inicializa os estados corretamente
    const [user, setUser] = useState<User>(() => {
        const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!sessionStorage.getItem("token") || !!localStorage.getItem("token")
    );

    const addOtherAccount = () => {
        if (user)
            saveUserToLocalStorage(user, token);
        logout()
        navigate(`/login?forceNewLogin=true`);
    }

    const fetchUser = async () => {
        if (!token) return; // Evita chamadas desnecessárias
        try {
            const response = await axios.post(`${PACOCA_API_URL}/user`, null, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setUser(response.data.user);
            saveUserToLocalStorage(response.data.user, token)
            if (response.data.warn) {
                setMessage(`${response.data.warn.text}`, "warning", response.data.warn.title, async () => {
                    try {
                        await axios.post(`${PACOCA_API_URL}/users/warn/mark-as-open/${response.data.warn.id}`, null, {
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    } catch (err: any) {
                        const messageError = errorMessage(err)
                        setMessage(messageError, "error", "Erro ao marcar como lido: ")
                        console.error("Erro ao marcar como lido: ", err);
                        console.error(messageError);
                    }
                })
            }
        } catch (err: any) {
            const status = err?.response?.status;
            const messageError = errorMessage(err)
            setMessage(messageError, "error")
            console.error("Erro ao buscar usuário:", err);

            if ([401, 403].includes(status)) {
                logout(false, true, true); // Desloga o usuário
            } 
        }
    };

    const loginContext = (token: string, user: User, remember: boolean) => {
        if (remember)
            saveUserToLocalStorage(user, token)

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setIsAuthenticated(true);
        setUser(user);
        setToken(token);
    };

    const saveUserToLocalStorage = (newUser: User, token: string) => {
        newUser.token = token;
        // // Obtém os usuários salvos no localStorage
        let savedUsers: User[] = JSON.parse(localStorage.getItem("saved_users") ?? "[]");
        // // Verifica se o usuário já existe na lista
        const existingUserIndex = savedUsers.findIndex((user: User) => user.id === newUser.id);

        if (existingUserIndex !== -1) {
            // Se o usuário já existir, atualize suas informações
            savedUsers[existingUserIndex] = newUser;
        } else {
            // Se não existir e já houver 3 usuários, remove o primeiro
            if (savedUsers.length >= 4) {
                savedUsers.shift();
            }

            // Adiciona o novo usuário à lista
            savedUsers.push(newUser);
        }

        // Salva a lista atualizada no localStorage
        localStorage.setItem("saved_users", JSON.stringify(savedUsers));
    };

    const changeUser = (id_user: number) => {
        // Obtém todos os usuários do localStorage
        const savedUsers: any[] = JSON.parse(localStorage.getItem("saved_users") ?? "[]");

        // Busca o usuário pelo ID
        const selectedUser = savedUsers.find((u) => u.id === id_user);

        // Se encontrar, atualiza o estado
        if (selectedUser) {
            localStorage.setItem("token", selectedUser.token);
            localStorage.setItem("user", JSON.stringify(selectedUser));
            setIsAuthenticated(true);
            setUser(selectedUser);
            setToken(selectedUser.token);
        }

        window.location.reload()
    };

    const removeUserFromSession = async (id_user: number) => {
        // Obtém a lista de usuários salvos no localStorage
        let savedUsers: User[] = JSON.parse(localStorage.getItem("saved_users") ?? "[]");

        // Encontra o índice do usuário a ser removido
        const userIndex = savedUsers.findIndex((user: User) => user.id === id_user);

        // Se o usuário for encontrado, removemos da lista
        if (userIndex !== -1) {
            savedUsers.splice(userIndex, 1); // Remove o usuário da lista
        }

        // Salva a lista atualizada no localStorage
        localStorage.setItem("saved_users", JSON.stringify(savedUsers));

        await axios.post(`${PACOCA_API_URL}/logout`, {
            token: user?.token
        }, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const logout = async (redirect: boolean = false, logoutApi: boolean = false, removeFromSession: boolean = false) => {
        if (removeFromSession) {
            removeUserFromSession(Number(user?.id))
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setIsAuthenticated(false); // Corrigido aqui
        setUser({} as User); // Limpa o usuário
        setToken("");


        if (logoutApi) {
            try {
                await axios.post(`${PACOCA_API_URL}/logout`, {
                    token: user?.token
                }, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

            } catch (err) {
                console.error("erro ao sair da conta", err);

            }
        }

        if (redirect) {
            return navigate("/login")
        }
    };

    const isSuper = (): boolean => {
        return isAuthenticated && user && user.id <= 5 || false;
    };

    useEffect(() => {
        if (token) {
            fetchUser(); // Apenas busca usuário se o token estiver definido
        }
    }, [token]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUser(); // Revalida ao mudar de página
        }
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ user, token, setUser, isSuper, fetchUser, isAuthenticated, loginContext, logout, changeUser, addOtherAccount, removeUserFromSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
