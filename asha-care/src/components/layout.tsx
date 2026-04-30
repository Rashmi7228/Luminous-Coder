import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useDB } from "@/hooks/use-db";
import { useOnline } from "@/hooks/use-online";
import { useT } from "@/hooks/use-t";
import { LANGUAGES } from "@/i18n/translations";
import { Home, Users, BookOpen, LayoutDashboard, QrCode, Wifi, WifiOff, RefreshCw, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { settings, updateSettings, patients, syncData } = useDB();
  const isOnline = useOnline();
  const { t } = useT();
  const [isSyncing, setIsSyncing] = useState(false);

  if (!settings) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const role = settings.currentRole;
  const pendingSync = patients.filter(p => !p.syncedAt).length;

  const navItems = [
    ...(role === 'asha' ? [
      { path: "/", label: t('navHome'), icon: Home },
      { path: "/patients/new", label: t('navAdd'), icon: Users },
    ] : []),
    ...(role === 'doctor' ? [
      { path: "/dashboard/doctor", label: t('navDashboard'), icon: LayoutDashboard },
    ] : []),
    ...(role === 'supervisor' ? [
      { path: "/dashboard/supervisor", label: t('navDashboard'), icon: LayoutDashboard },
    ] : []),
    ...(role === 'portal' ? [
      { path: "/portal", label: t('navPortal'), icon: Activity },
    ] : []),
    { path: "/education", label: t('navEducation'), icon: BookOpen },
    { path: "/qr", label: t('navShareApp'), icon: QrCode },
  ];

  const handleSync = async () => {
    if (!isOnline) {
      toast.error(t('offlineSyncQueued'));
      return;
    }

    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await syncData();
    setIsSyncing(false);
    toast.success(`${pendingSync} ${t('syncedToast')}`);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background md:flex-row">
      {/* Header */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b bg-card px-4 py-3 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Activity size={18} />
          </div>
          <span className="font-semibold text-foreground">{t('appName')}</span>
        </div>

        <div className="flex items-center gap-3">
          {pendingSync > 0 && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {pendingSync} {t('unsynced')}
            </span>
          )}
          <div className={cn("flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider", isOnline ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            {isOnline ? t('online') : t('offline')}
          </div>
        </div>
      </header>

      {/* Side Nav (Desktop) */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">{t('appName')}</span>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">{t('appControls')}</p>
            <div className="space-y-3">
              <Select value={role} onValueChange={(v: any) => updateSettings({ currentRole: v })}>
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder={t('role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asha">{t('roleAsha')}</SelectItem>
                  <SelectItem value="doctor">{t('roleDoctor')}</SelectItem>
                  <SelectItem value="supervisor">{t('roleSupervisor')}</SelectItem>
                  <SelectItem value="portal">{t('rolePortal')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={settings.language} onValueChange={(v) => updateSettings({ language: v })}>
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue placeholder={t('language')} />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(l => (
                    <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between pt-1">
                <div className={cn("flex items-center gap-1.5 text-xs font-medium", isOnline ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                  {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {isOnline ? t('online') : t('offline')}
                </div>
                {role !== 'portal' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleSync}
                    disabled={isSyncing || pendingSync === 0}
                  >
                    <RefreshCw size={12} className={cn("mr-1", isSyncing && "animate-spin")} />
                    {t('sync')} {pendingSync > 0 && `(${pendingSync})`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                location === item.path || (item.path !== '/' && location.startsWith(item.path))
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="mx-auto w-full max-w-4xl p-4 md:p-6 lg:p-8">
          {/* Mobile Role Switcher (Visible only on mobile inside main content top) */}
          <div className="mb-6 rounded-lg border bg-card p-3 shadow-sm md:hidden">
            <div className="flex items-center gap-2">
              <Select value={role} onValueChange={(v: any) => updateSettings({ currentRole: v })}>
                <SelectTrigger className="h-9 flex-1">
                  <SelectValue placeholder={t('role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asha">{t('roleAsha')}</SelectItem>
                  <SelectItem value="doctor">{t('roleDoctor')}</SelectItem>
                  <SelectItem value="supervisor">{t('roleSupervisor')}</SelectItem>
                  <SelectItem value="portal">{t('rolePortal')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={settings.language} onValueChange={(v) => updateSettings({ language: v })}>
                <SelectTrigger className="h-9 w-[110px]">
                  <SelectValue placeholder={t('language')} />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(l => (
                    <SelectItem key={l.code} value={l.code}>{l.short}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role !== 'portal' && (
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  {pendingSync} {t('unsyncedRecords')}
                </span>
                <Button
                  variant={pendingSync > 0 ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={handleSync}
                  disabled={isSyncing || pendingSync === 0}
                >
                  <RefreshCw size={14} className={cn("mr-1.5", isSyncing && "animate-spin")} />
                  {t('syncNow')}
                </Button>
              </div>
            )}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t bg-card pb-safe pt-1 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] md:hidden">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 text-center transition-colors min-w-[64px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn("mb-1 flex h-8 w-8 items-center justify-center rounded-full transition-all", isActive && "bg-primary/15")}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
