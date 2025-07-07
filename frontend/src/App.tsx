import { Toaster } from "@/components/UI/toaster";
import { Toaster as Sonner } from "@/components/UI/sonner";
import { TooltipProvider } from "@/components/UI/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useStore } from '@/store'; // ✅ Zustand store hook
import { useEffect, useState } from "react"; // ✅ Added to handle client-side auth check
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Unauthorized from './pages/Unauthorized';


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Servers from "./pages/Servers";
import VirtualMachines from "./pages/VirtualMachines";
import StorageBays from "./pages/StorageBays";
import DataCenters from "./pages/DataCenters";
import BackupPolicies from "./pages/BackupPolicies";
import Tags from "./pages/Tags";
import Alerts from "./pages/Alerts";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import MainLayout from "./components/MainLayout";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import UserView from "./pages/UserView";
import UserEdit from "./pages/UserEdit";

const queryClient = new QueryClient();

const App = () => {
  const user = useStore(state => state.user); // ✅ Zustand user state
  const [isClient, setIsClient] = useState(false); // ✅ SSR safety

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // ✅ Prevent hydration mismatch

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Protected layout and nested routes */}
    <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route path="dashboard" element={<Dashboard />} />

      {/* Admin-only routes */}
      <Route path="servers" element={
        <RoleProtectedRoute allowedRoles={['admin','user']}>
          <Servers />
        </RoleProtectedRoute>
      } />
      <Route path="datacenters" element={
        <RoleProtectedRoute allowedRoles={['admin','user']}>
          <DataCenters />
        </RoleProtectedRoute>
      } />
      <Route path="backup-policies" element={
        <RoleProtectedRoute allowedRoles={['admin','user']}>
          <BackupPolicies />
        </RoleProtectedRoute>
      } />
      <Route path="users" element={
        <RoleProtectedRoute allowedRoles={['admin']}>
          <Users />
        </RoleProtectedRoute>
      } />
      <Route path="users/:id/view" element={<RoleProtectedRoute allowedRoles={['admin']}><UserView /></RoleProtectedRoute>} />
      <Route path="users/:id/edit" element={<RoleProtectedRoute allowedRoles={['admin']}><UserEdit /></RoleProtectedRoute>} />

      {/* Authenticated (admin or user) */}
      <Route path="vms" element={
        <RoleProtectedRoute allowedRoles={['admin', 'user']}>
          <VirtualMachines />
        </RoleProtectedRoute>
      } />
      <Route path="storage" element={
        <RoleProtectedRoute allowedRoles={['admin', 'user']}>
          <StorageBays />
        </RoleProtectedRoute>
      } />
      <Route path="tags" element={
        <RoleProtectedRoute allowedRoles={['admin', 'user']}>
          <Tags />
        </RoleProtectedRoute>
      } />
      <Route path="alerts" element={
        <RoleProtectedRoute allowedRoles={['admin', 'user']}>
          <Alerts />
        </RoleProtectedRoute>
      } />
      <Route path="settings" element={
        <RoleProtectedRoute allowedRoles={['admin', 'user']}>
          <Settings />
        </RoleProtectedRoute>
      } />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
