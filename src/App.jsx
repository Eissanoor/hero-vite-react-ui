import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Dashboard/Products";
import Menu from "./pages/Dashboard/Menu";
import Orders from "./pages/Dashboard/Orders";
import History from "./pages/Dashboard/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout><Dashboard /></DashboardLayout>} />} />
            <Route path="/dashboard/products" element={<ProtectedRoute element={<DashboardLayout><Products /></DashboardLayout>} />} />
            <Route path="/dashboard/menu" element={<ProtectedRoute element={<DashboardLayout><Menu /></DashboardLayout>} />} />
            <Route path="/dashboard/orders" element={<ProtectedRoute element={<DashboardLayout><Orders /></DashboardLayout>} />} />
            <Route path="/dashboard/history" element={<ProtectedRoute element={<DashboardLayout><History /></DashboardLayout>} />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
