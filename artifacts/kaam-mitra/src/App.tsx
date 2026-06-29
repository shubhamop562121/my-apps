import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileFrame from "@/components/MobileFrame";
import { SavedProvider } from "@/context/SavedContext";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { CityProvider } from "@/context/CityContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import SplashPage from "@/pages/splash";
import WelcomePage from "@/pages/welcome";
import LoginPage from "@/pages/login";
import OtpPage from "@/pages/otp";
import HomePage from "@/pages/home";
import SearchPage from "@/pages/search";
import CategoryPage from "@/pages/category";
import WorkerDetailPage from "@/pages/worker";
import BookAppointmentPage from "@/pages/book-appointment";
import SavedPage from "@/pages/saved";
import RequestsPage from "@/pages/requests";
import RequestDetailPage from "@/pages/request-detail";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile";
import FiltersPage from "@/pages/filters";
import AboutPage from "@/pages/about";
import HelpPage from "@/pages/help";
import EditAddressPage from "@/pages/edit-address";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  // Fall back to auth.currentUser to avoid a redirect flash in the brief window
  // after a successful OTP verify but before onAuthStateChanged updates state.
  if (!user && !auth.currentUser) {
    return <Redirect to="/welcome" />;
  }

  return <>{children}</>;
}

function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function Guarded(props: P) {
    return (
      <AuthGate>
        <Component {...props} />
      </AuthGate>
    );
  };
}

const GuardedHome = withAuth(HomePage);
const GuardedSearch = withAuth(SearchPage);
const GuardedCategory = withAuth(CategoryPage);
const GuardedWorker = withAuth(WorkerDetailPage);
const GuardedBook = withAuth(BookAppointmentPage);
const GuardedSaved = withAuth(SavedPage);
const GuardedRequests = withAuth(RequestsPage);
const GuardedRequestDetail = withAuth(RequestDetailPage);
const GuardedNotifications = withAuth(NotificationsPage);
const GuardedProfile = withAuth(ProfilePage);
const GuardedFilters = withAuth(FiltersPage);
const GuardedAbout = withAuth(AboutPage);
const GuardedHelp = withAuth(HelpPage);
const GuardedEditAddress = withAuth(EditAddressPage);

function Router() {
  return (
    <MobileFrame>
      <Switch>
        <Route path="/">
          <Redirect to="/splash" />
        </Route>
        {/* Public routes */}
        <Route path="/splash" component={SplashPage} />
        <Route path="/welcome" component={WelcomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/otp" component={OtpPage} />
        {/* Protected routes — require an authenticated user */}
        <Route path="/home" component={GuardedHome} />
        <Route path="/search" component={GuardedSearch} />
        <Route path="/category/:slug" component={GuardedCategory} />
        <Route path="/worker/:id" component={GuardedWorker} />
        <Route path="/book/:id" component={GuardedBook} />
        <Route path="/saved" component={GuardedSaved} />
        <Route path="/requests" component={GuardedRequests} />
        <Route path="/requests/:id" component={GuardedRequestDetail} />
        <Route path="/notifications" component={GuardedNotifications} />
        <Route path="/profile" component={GuardedProfile} />
        <Route path="/filters" component={GuardedFilters} />
        <Route path="/about" component={GuardedAbout} />
        <Route path="/help" component={GuardedHelp} />
        <Route path="/edit-address" component={GuardedEditAddress} />
        <Route component={NotFound} />
      </Switch>
    </MobileFrame>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CityProvider>
            <AppointmentsProvider>
              <SavedProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                </WouterRouter>
              </SavedProvider>
            </AppointmentsProvider>
          </CityProvider>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
