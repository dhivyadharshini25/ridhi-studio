import { api } from './api';

// --- Services ---
export const getServices = (all = false) => api.get(`/services${all ? '?all=true' : ''}`);
export const getServiceBySlug = (slug: string) => api.get(`/services/${slug}`);
export const createService = (data: any) => api.post('/services', data);
export const updateService = (id: string, data: any) => api.put(`/services/${id}`, data);
export const deleteService = (id: string) => api.delete(`/services/${id}`);
export const getServiceCategories = () => api.get('/services/categories');

// --- Portfolio ---
export const getPortfolio = (category = 'all', all = false) =>
  api.get(`/portfolio?category=${category}${all ? '&all=true' : ''}`);
export const createPortfolioItem = (data: any) => api.post('/portfolio', data);
export const updatePortfolioItem = (id: string, data: any) => api.put(`/portfolio/${id}`, data);
export const deletePortfolioItem = (id: string) => api.delete(`/portfolio/${id}`);
export const getPortfolioCategories = () => api.get('/portfolio/categories');

// --- Enquiries ---
export const createEnquiry = (data: any) => api.post('/enquiries', data);
export const getEnquiries = (params = '') => api.get(`/enquiries${params}`);
export const getEnquiry = (id: string) => api.get(`/enquiries/${id}`);
export const updateEnquiry = (id: string, data: any) => api.put(`/enquiries/${id}`, data);
export const convertEnquiry = (id: string, data: any) => api.post(`/enquiries/${id}/convert`, data);

// --- Bookings ---
export const createBooking = (data: any) => api.post('/bookings', data);
export const getBookings = (params = '') => api.get(`/bookings${params}`);
export const updateBooking = (id: string, data: any) => api.put(`/bookings/${id}`, data);

// --- Projects ---
export const getProjects = () => api.get('/projects');
export const getProject = (id: string) => api.get(`/projects/${id}`);
export const updateProjectStatus = (id: string, data: any) => api.put(`/projects/${id}`, data);
export const addProjectUpdate = (id: string, data: any) => api.post(`/projects/${id}/updates`, data);

// --- Quotes ---
export const getQuotes = () => api.get('/quotes');
export const getQuote = (id: string) => api.get(`/quotes/${id}`);
export const createQuote = (data: any) => api.post('/quotes', data);
export const respondToQuote = (id: string, action: 'accept' | 'reject') =>
  api.post(`/quotes/${id}/respond`, { action });

// --- Notifications ---
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id: string) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');

// --- Contact ---
export const submitContact = (data: any) => api.post('/contact', data);
export const getContactMessages = () => api.get('/contact');
export const updateContactMessage = (id: string, data: any) => api.put(`/contact/${id}`, data);
export const deleteContactMessage = (id: string) => api.delete(`/contact/${id}`);

// --- Testimonials ---
export const getTestimonials = (all = false) => api.get(`/testimonials${all ? '?all=true' : ''}`);
export const createTestimonial = (data: any) => api.post('/testimonials', data);
export const updateTestimonial = (id: string, data: any) => api.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id: string) => api.delete(`/testimonials/${id}`);

// --- Files ---
export const uploadFile = (formData: FormData) =>
  api.post('/files', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyFiles = (params = '') => api.get(`/files${params}`);
export const deleteFile = (id: string) => api.delete(`/files/${id}`);
// export const fileDownloadUrl = (id: string) => `${api.defaults.baseURL}/files/${id}/download`;
export const downloadFile = async (id: string, fileName: string) => {
  const response = await api.get(`/files/${id}/download`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

// --- Admin: customers & dashboard ---
export const getDashboardStats = () => api.get('/admin/dashboard-stats');
export const getCustomers = (search = '') => api.get(`/admin/customers${search ? `?search=${search}` : ''}`);
export const getCustomer = (id: string) => api.get(`/admin/customers/${id}`);
export const setCustomerActive = (id: string, isActive: boolean) =>
  api.put(`/admin/customers/${id}/active`, { isActive });

// --- Payments ---
export const createPaymentOrder = (data: any) => api.post('/payments/create-order', data);
export const verifyPayment = (data: any) => api.post('/payments/verify', data);
export const getPayments = () => api.get('/payments');

// --- Settings ---
export const getPublicSettings = () => api.get('/settings');
