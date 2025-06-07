import { BACKEND_URL } from "./vars";

export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};

// export const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
// };

export const authId = () => {
    const userJson = localStorage.getItem("user");

    if (userJson) {
        // Analisa a string JSON para um objeto
        const user = JSON.parse(userJson);
        
        // Agora você pode acessar o ID do usuário
        return user.id; // Acesse o ID do usuário
    } else {
        return null;
    }
};

export const authUser = () => {
    const userJson = localStorage.getItem("user");

    if (userJson) {
        // Analisa a string JSON para um objeto
        const user = JSON.parse(userJson);
        
        // Agora você pode acessar o ID do usuário
        return user; // Acesse o ID do usuário
    } else {
        return null;
    }
};

export const getImageUser = (path?: string) =>{
    return path ? `${BACKEND_URL}/${path}` : "/img/img-account.png";
}