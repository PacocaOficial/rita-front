export const formattMoneyBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

export const formatDateDDMMYYYY = (value: string) => {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
}

export const calculateEndDate = (startDate: string, months: number): string => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // mês começa do 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};
