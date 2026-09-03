import { Routes, Route } from 'react-router-dom';

import PublicLayout from './components/layout/PublicLayout';
import DashboardShell from './components/layout/DashboardShell';
import AdminShell from './components/layout/AdminShell';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/public/Home';
import Services from './pages/public/Services';
import ServiceDetails from './pages/public/ServiceDetails';
import Portfolio from './pages/public/Portfolio';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import StartAProject from './pages/public/StartAProject';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Overview from './pages/customer/Overview';
import Enquiries from './pages/customer/Enquiries';
import Bookings from './pages/customer/Bookings';
import Projects from './pages/customer/Projects';
import ProjectDetails from './pages/customer/ProjectDetails';
import Quotes from './pages/customer/Quotes';
import Notifications from './pages/customer/Notifications';
import Profile from './pages/customer/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminCustomers from './pages/admin/Customers';
import AdminCustomerDetails from './pages/admin/CustomerDetails';
import AdminServices from './pages/admin/Services';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminBookings from './pages/admin/Bookings';
import AdminProjects from './pages/admin/Projects';
import AdminProjectDetails from './pages/admin/ProjectDetails';
import AdminQuotes from './pages/admin/Quotes';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminMessages from './pages/admin/Messages';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/start-a-project" element={<StartAProject />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Customer dashboard (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardShell />}>
            <Route index element={<Overview />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin panel (protected + role-gated) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<AdminCustomerDetails />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/:id" element={<AdminProjectDetails />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Route>
    </Routes>
  );
}
