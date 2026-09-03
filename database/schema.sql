-- RiDhi Studio — PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============ USERS / ROLES ============
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  reset_token TEXT,
  reset_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ SERVICES ============
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  starting_price NUMERIC,
  delivery_estimate TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_services_active ON services(is_active);

-- ============ PORTFOLIO ============
CREATE TABLE portfolio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES portfolio_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_portfolio_published ON portfolio_projects(is_published);

-- ============ ENQUIRIES ============
CREATE TYPE enquiry_status AS ENUM ('NEW','REVIEWING','QUOTED','APPROVED','IN_PROGRESS','COMPLETED','CANCELLED');

CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  details TEXT,
  budget NUMERIC,
  preferred_deadline DATE,
  preferred_contact_method TEXT,
  status enquiry_status NOT NULL DEFAULT 'NEW',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_enquiries_customer ON enquiries(customer_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);

-- ============ BOOKINGS ============
CREATE TYPE booking_status AS ENUM ('PENDING','CONFIRMED','RESCHEDULED','COMPLETED','CANCELLED');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'PENDING',
  event_date DATE,
  saree_count INT,
  saree_type TEXT,
  pickup_delivery_option TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(appointment_date, appointment_time);

-- ============ PROJECTS ============
CREATE TYPE project_status AS ENUM ('NEW','PLANNING','IN_PROGRESS','REVIEW','COMPLETED','CANCELLED');

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enquiry_id UUID REFERENCES enquiries(id),
  service_id UUID REFERENCES services(id),
  title TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'NEW',
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_projects_customer ON projects(customer_id);

CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  is_deliverable BOOLEAN DEFAULT FALSE,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_project_updates_project ON project_updates(project_id);

-- ============ QUOTES ============
CREATE TYPE quote_status AS ENUM ('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED');

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enquiry_id UUID REFERENCES enquiries(id),
  discount NUMERIC DEFAULT 0,
  additional_charges NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  status quote_status NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_quotes_customer ON quotes(customer_id);

CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL
);

-- ============ PAYMENTS ============
CREATE TYPE payment_status AS ENUM ('CREATED','PAID','FAILED','REFUNDED');

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  booking_id UUID REFERENCES bookings(id),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  order_id TEXT,
  transaction_id TEXT,
  status payment_status NOT NULL DEFAULT 'CREATED',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ NOTIFICATIONS ============
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);

-- ============ FILES ============
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  enquiry_id UUID REFERENCES enquiries(id),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_files_owner ON files(owner_id);

-- ============ TESTIMONIALS ============
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ CONTACT MESSAGES ============
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ SETTINGS ============
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

INSERT INTO settings (key, value) VALUES
  ('contact', '{"whatsapp":"+91XXXXXXXXXX","instagram":"https://instagram.com/ridhistudio","email":"hello@ridhistudio.com"}');
