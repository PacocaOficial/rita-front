import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { getImageUser } from '@/utils/auth';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();
    const userImg = getImageUser();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-cover bg-no-repeat bg-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white" style={{ backgroundImage: `url("${userImg}")`, cursor: "pointer" }}  >
                    {!getImageUser() ? (
                        <>
                            {getInitials(user?.name ?? "")}
                        </>

                    ) : null}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                {showEmail && <span className="text-muted-foreground truncate text-xs">@{user?.user_name}</span>}
            </div>
        </>
    );
}
