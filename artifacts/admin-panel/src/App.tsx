import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import WorkersPage from "@/pages/Workers";
import UsersPage from "@/pages/Users";
import CategoriesPage from "@/pages/Categories";
import CitiesPage from "@/pages/Cities";
import ReviewsPage from "@/pages/Reviews";
import AdsPage from "@/pages/Advertisements";
import MessagesPage from "@/pages/Messages";
import SettingsPage from "@/pages/Settings";

const queryClient = new QueryClient();
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
  const { admin } = useAuth();
  const [location] = useLocation();

  if (!admin && location !== "/login") {
    return <Redirect to="/login" />;
  }

  if (admin && location === "/login") {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={Dashboard} />
      <Route path="/workers" component={WorkersPage} />
      <Route path="/users" component={UsersPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/cities" component={CitiesPage} />
      <Route path="/reviews" component={ReviewsPage} />
      <Route path="/ads" component={AdsPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route><Redirect to="/" /></Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={base}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
