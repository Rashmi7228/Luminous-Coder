import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import PatientTypeSelect from "@/pages/patient-type-select";
import PatientForm from "@/pages/patient-form";
import PatientDetail from "@/pages/patient-detail";
import DoctorDashboard from "@/pages/dashboard-doctor";
import SupervisorDashboard from "@/pages/dashboard-supervisor";
import Education from "@/pages/education";
import Portal from "@/pages/portal";
import QRCodePage from "@/pages/qr";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/patients/new" component={PatientTypeSelect} />
        <Route path="/patients/new/:type" component={PatientForm} />
        <Route path="/patients/:id" component={PatientDetail} />
        <Route path="/patients/:id/edit" component={PatientForm} />
        
        <Route path="/dashboard/doctor" component={DoctorDashboard} />
        <Route path="/dashboard/supervisor" component={SupervisorDashboard} />
        
        <Route path="/education" component={Education} />
        <Route path="/portal" component={Portal} />
        <Route path="/qr" component={QRCodePage} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
      <SonnerToaster position="top-center" />
    </TooltipProvider>
  );
}

export default App;
