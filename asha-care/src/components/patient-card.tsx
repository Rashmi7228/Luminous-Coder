import { Patient } from "@/lib/db";
import { computeRisk } from "@/lib/risk";
import { useT } from "@/hooks/use-t";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Baby, ActivitySquare, MapPin, Calendar, Syringe } from "lucide-react";
import { Link } from "wouter";

interface PatientCardProps {
  patient: Patient;
  showRiskReasons?: boolean;
}

export function PatientCard({ patient, showRiskReasons = false }: PatientCardProps) {
  const risk = computeRisk(patient);
  const { t } = useT();

  const typeIcons = {
    pregnancy: User,
    child: Baby,
    general: ActivitySquare
  };

  const typeLabels: Record<string, string> = {
    pregnancy: t('pregnancy'),
    child: t('child'),
    general: t('general'),
  };

  const Icon = typeIcons[patient.type];

  const riskLabel =
    risk.level === 'HIGH' ? t('riskHigh') :
    risk.level === 'MEDIUM' ? t('riskMedium') :
    t('riskLow');

  return (
    <Link href={`/patients/${patient.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover-elevate border-l-4 cursor-pointer" style={{
        borderLeftColor: risk.level === 'HIGH' ? 'var(--color-destructive)' :
                         risk.level === 'MEDIUM' ? '#eab308' :
                         'var(--color-secondary)'
      }}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-none">{patient.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>{patient.age} {t('years')}</span>
                  <span>•</span>
                  <span className="flex items-center"><MapPin size={12} className="mr-0.5" /> {patient.village}</span>
                </div>
              </div>
            </div>

            <Badge variant={risk.level === 'HIGH' ? 'destructive' : risk.level === 'MEDIUM' ? 'outline' : 'secondary'}
                   className={risk.level === 'MEDIUM' ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400" : ""}>
              {riskLabel}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-y-2 mt-4 pt-4 border-t border-border/50 text-sm">
            <div className="flex items-center text-muted-foreground">
              <span className="font-medium mr-1 text-foreground">{t('category')}:</span> {typeLabels[patient.type]}
            </div>

            {patient.type === 'pregnancy' && patient.pregnancyWeek !== null && (
              <div className="flex items-center text-muted-foreground">
                <Calendar size={14} className="mr-1" />
                <span className="font-medium mr-1 text-foreground">{t('weekN')}:</span> {patient.pregnancyWeek}
              </div>
            )}

            {patient.type === 'child' && patient.vaccinationStatus && (
              <div className="flex items-center text-muted-foreground">
                <Syringe size={14} className="mr-1" />
                <span className="font-medium mr-1 text-foreground">Vax:</span>
                {patient.vaccinationStatus.filter(v => v.given).length}/{patient.vaccinationStatus.length}
              </div>
            )}

            {patient.bp && (
              <div className="flex items-center text-muted-foreground">
                <ActivitySquare size={14} className="mr-1" />
                <span className="font-medium mr-1 text-foreground">{t('bloodPressure')}:</span>
                {patient.bp.systolic}/{patient.bp.diastolic}
              </div>
            )}
          </div>

          {showRiskReasons && risk.reasons.length > 0 && (
            <div className="mt-3 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 p-2 rounded text-xs font-medium space-y-1">
              {risk.reasons.map((r, i) => (
                <div key={i} className="flex items-start">
                  <span className="mr-1.5">•</span> {r}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
