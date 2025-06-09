import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RITA_API_URL } from '@/utils/vars';
import { useAuth } from '@/contexts/auth-context';
import { errorMessage } from '@/utils/text';
import { AlertNotification } from './ui/alert-notification';

type DeleteAppointmentProps = {
  id: number; // ou string, dependendo do tipo do seu id
  onDelete?: (id: number) => void; // ✅ novo
};

export default function DeleteAppointment({ id, onDelete }: DeleteAppointmentProps) {
    const { processing, reset, clearErrors } = useForm<Required<{ id: number }>>({ id: id });
    const { token } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // ← controle do modal

    const deleteAppointment: FormEventHandler = (e) => {
        e.preventDefault();
        remove()
        closeModal()
        
    };

    const remove = async() => {
        setError("")
        setLoading(true)
        try {
            const response = await axios.delete(`${RITA_API_URL}/appointments`, {
                data: { id },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if(response?.data?.success) {
                setOpen(false);
                if (onDelete) onDelete(id);
            }
            else setError(response?.data?.message)
        } catch (err: any) {
            const messageError = errorMessage(err);
            setError(messageError);
            console.error("Erro ao apagar: ", messageError);
            console.error("Erro ao apagar: ", err);
        } finally {
            setLoading(false)
        }
    }

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Trash2/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AlertNotification success={""} error={error}/>
                <DialogTitle>Tem certeza que deseja apagar esse agendamento?</DialogTitle>
                <DialogDescription>
                    Não é possível recuperar essa ação
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteAppointment}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={loading} asChild>
                            <button type="submit">
                                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}Apagar
                            </button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
