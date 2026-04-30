import { Patient } from "@/lib/db";
import { computeRisk } from "@/lib/risk";
import { useT } from "@/hooks/use-t";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface AlertPanelProps {
  patients: Patient[];
  title?: string;
}

export function AlertPanel({ patients, title }: AlertPanelProps) {
  const { t } = useT();
  const alerts = patients.filter(p => computeRisk(p).level === 'HIGH');

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-destructive/20 bg-red-50 dark:bg-red-950/10 overflow-hidden mb-8">
      <div className="bg-destructive/10 px-4 py-3 flex items-center gap-2 border-b border-destructive/10">
        <AlertCircle className="text-destructive h-5 w-5" />
        <h2 className="font-semibold text-destructive">{title || t('alerts')} ({alerts.length})</h2>
      </div>

      <div className="divide-y divide-destructive/10">
        {alerts.map(patient => {
          const risk = computeRisk(patient);
          return (
            <Link key={patient.id} href={`/patients/${patient.id}`} className="block px-4 py-3 hover:bg-destructive/5 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">{patient.name}</div>
                  <div className="text-xs text-muted-foreground">{patient.village} • {patient.age} {t('years')}</div>
                  <div className="text-xs text-destructive font-medium mt-1">
                    {risk.reasons.join(', ')}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
