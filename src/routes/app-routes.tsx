import { Routes, Route } from "react-router-dom";
import Welcome from "@/pages/welcome";
import NotFound from "@/pages/errors/not-found/not-found";
import RoutesUnauthenticated from "./routes-unauthenticated";
import Login from "@/pages/login";
import Main from "@/pages/layout";
import RoutesAuthenticated from "./routes-authenticated";
import AppointmentsIndex from "@/pages/appointments";
import AppointmentsRegister from "@/pages/appointments/register";
import PlansIndex from "@/pages/plans";
import PlansManage from "@/pages/plans/manage";
import PlansRegister from "@/pages/plans/register";
import PlansDetails from "@/pages/plans/details";

const AppRoutes: React.FC = () => {
	return (
                <Routes>
                        <Route path="/" element={<Main />}>
                                <Route path="/" element={<Welcome/>} />
                                <Route path="*" element={<NotFound />} />

                                {/* rotas autenticadas */}
                                <Route path="agendamentos" element={<RoutesAuthenticated><AppointmentsIndex /></RoutesAuthenticated>} />
                                <Route path="agendamentos/novo" element={<RoutesAuthenticated><AppointmentsRegister /></RoutesAuthenticated>} />
                                <Route path="agendamentos/:id" element={<RoutesAuthenticated><AppointmentsRegister /></RoutesAuthenticated>} />
                                <Route path="agendamentos" element={<RoutesAuthenticated><AppointmentsIndex /></RoutesAuthenticated>} />
                                
                                <Route path="planos" element={<RoutesAuthenticated><PlansIndex /></RoutesAuthenticated>} />
                                <Route path="planos/gerenciar/:id" element={<RoutesAuthenticated><PlansRegister /></RoutesAuthenticated>} />
                                
                                <Route path="planos/gerenciar" element={<RoutesAuthenticated><PlansManage /></RoutesAuthenticated>} />
                                <Route path="planos/novo" element={<RoutesAuthenticated><PlansRegister /></RoutesAuthenticated>} />
                                <Route path="planos/:id" element={<RoutesAuthenticated><PlansDetails /></RoutesAuthenticated>} />


                                {/* não pode estar logado */}
                                <Route path="login" element={<RoutesUnauthenticated> <Login /></RoutesUnauthenticated>} />
                                {/* <Route path="cadastro" element={<RoutesUnauthenticated><RegisterUser /></RoutesUnauthenticated>} /> */}
                        </Route>
                </Routes>
        );	
}

export default AppRoutes;