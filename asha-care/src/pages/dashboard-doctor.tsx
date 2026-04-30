import { useDB } from "@/hooks/use-db";
import { computeRisk } from "@/lib/risk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientCard } from "@/components/patient-card";
import { AlertPanel } from "@/components/alert-panel";
import { Activity, Users, AlertTriangle } from "lucide-react";

export default function DoctorDashboard() {
  const { patients } = useDB();

  const highRiskCount = patients.filter(p => computeRisk(p).level === 'HIGH').length;
  const mediumRiskCount = patients.filter(p => computeRisk(p).level === 'MEDIUM').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive overview of all community patients.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{patients.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Risk (Red)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highRiskCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/5 border-yellow-500/20 dark:bg-yellow-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk (Yellow)</CardTitle>
            <Activity className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{mediumRiskCount}</div>
          </CardContent>
        </Card>
      </div>

      <AlertPanel patients={patients} title="Urgent Referrals Needed" />

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold">All Patients Registry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map(patient => (
            <PatientCard key={patient.id} patient={patient} showRiskReasons />
          ))}
        </div>
      </div>
    </div>
  );
}
