import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm leading-none">
                <span className="font-semibold tracking-tight text-foreground">
                    Portal Akademik
                </span>
                <span className="mt-1 text-[11px] text-muted-foreground">
                    Layanan Pengajuan
                </span>
            </div>
        </>
    );
}
