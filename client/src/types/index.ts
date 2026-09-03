export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  starting_price?: number;
  delivery_estimate?: string;
  is_active: boolean;
  category_name?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  gallery_urls?: string[];
  is_published: boolean;
  category_name?: string;
  category_slug?: string;
}

export type EnquiryStatus = 'NEW' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type ProjectStatus = 'NEW' | 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
