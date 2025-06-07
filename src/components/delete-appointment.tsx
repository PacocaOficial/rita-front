import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertNotification } from './ui/alert-notification';

type DeleteAppointmentProps = {
  id: number; // ou string, dependendo do tipo do seu id
};

export default function DeleteAppointment({ id }: DeleteAppointmentProps) {
    const { post, processing, reset, clearErrors } = useForm<Required<{ id: number }>>({ id: id });
    const { props } = usePage();

    const deleteAppointment: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('appointments.delete'), {
            preserveScroll: true,
        });

        closeModal()
        
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Trash2/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AlertNotification error={props.error as string | undefined}/>
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

                        <Button variant="destructive" disabled={processing} asChild>
                            <button type="submit">Apagar</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
