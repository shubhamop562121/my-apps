import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileFrame from "@/components/MobileFrame";
import SplashPage from "@/pages/splash";
import WelcomePage from "@/pages/welcome";
import LoginPage from "@/pages/login";
import OtpPage from "@/pages/otp";
import HomePage from "@/pages/home";
import SearchPage from "@/pages/search";
import CategoryPage from "@/pages/category";
import WorkerDetailPage from "@/pages/worker";
import SavedPage from "@/pages/saved";
import RequestsPage from "@/pages/requests";
import RequestDetailPage from "@/pages/request-detail";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile";
import FiltersPage from "@/pages/filters";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <MobileFrame>
      <Switch>
        <Route path="/">
          <Redirect to="/splash" />
        </Route>
        <Route path="/splash" component={SplashPage} />
        <Route path="/welcome" component={WelcomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/otp" component={OtpPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/worker/:id" component={WorkerDetailPage} />
        <Route path="/saved" component={SavedPage} />
        <Route path="/requests" component={RequestsPage} />
        <Route path="/requests/:id" component={RequestDetailPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/filters" component={FiltersPage} />
        <Route component={NotFound} />
      </Switch>
    </MobileFrame>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
