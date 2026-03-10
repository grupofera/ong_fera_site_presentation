import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Animais from "./pages/Animais";
import AnimaisIluminados from "./pages/AnimaisIluminados";
import Dashboard from "./pages/Dashboard";
import Adocoes from "./pages/Adocoes";
import Doacoes from "./pages/Doacoes";
import Voluntarios from "./pages/Voluntarios";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"}>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path={"/animais"}>
        <ProtectedRoute>
          <Animais />
        </ProtectedRoute>
      </Route>
      <Route path={"/animais-iluminados"}>
        <ProtectedRoute>
          <AnimaisIluminados />
        </ProtectedRoute>
      </Route>
      <Route path={"/adocoes"}>
        <ProtectedRoute>
          <Adocoes />
        </ProtectedRoute>
      </Route>
      <Route path={"/doacoes"}>
        <ProtectedRoute>
          <Doacoes />
        </ProtectedRoute>
      </Route>
      <Route path={"/voluntarios"}>
        <ProtectedRoute>
          <Voluntarios />
        </ProtectedRoute>
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Header />
          <Router />
          <Footer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
