import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { isWebView } from "@/utils/text";

const Main = () => {
    // console.clear();
    console.log('%cDesenvolvido pelo João Enrique', 'font-size: 30px; color: red;');
    console.log(`%chttps://github.com/JoaoEnrique`, 'font-size: 20px; color: #5bb4ff;');
    console.log(`%cRITA ${new Date().getFullYear()}`, 'font-size: 30px; color: #5bb4ff;');

    useEffect(() => {
        if (!isWebView()) {
          document.body.classList.add("not-webview");
        }
    }, []);
    

    return (
        <div>
            {/* Conteúdo das Páginas Filhas */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Main;
