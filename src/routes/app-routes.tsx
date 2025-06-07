import { Routes, Route } from "react-router-dom";
import Welcome from "@/pages/welcome";
import NotFound from "@/pages/errors/not-found/not-found";
import RoutesUnauthenticated from "./routes-unauthenticated";
import Login from "@/pages/login";
import Main from "@/pages/layout";

const AppRoutes: React.FC = () => {
	return (
                <Routes>
                        <Route path="/" element={<Main />}>
                                <Route path="/" element={<Welcome/>} />
                                <Route path="*" element={<NotFound />} />

                                {/* não pode estar logado */}
                                <Route path="login" element={<RoutesUnauthenticated> <Login /></RoutesUnauthenticated>} />
                                {/* <Route path="cadastro" element={<RoutesUnauthenticated><RegisterUser /></RoutesUnauthenticated>} /> */}
                        </Route>
                </Routes>
        );	
}

export default AppRoutes;