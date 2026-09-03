-- Seed data for RiDhi Studio
-- Run after schema.sql

INSERT INTO service_categories (name, slug, sort_order) VALUES
  ('Digital', 'digital', 1),
  ('Design', 'design', 2),
  ('Lifestyle', 'lifestyle', 3)
ON CONFLICT DO NOTHING;

INSERT INTO services (category_id, title, slug, description, short_description, starting_price, delivery_estimate, sort_order)
SELECT c.id, v.title, v.slug, v.description, v.short_description, v.starting_price, v.delivery_estimate, v.sort_order
FROM (VALUES
  ('digital', 'Website Development', 'website-development',
   'Custom-built, responsive websites designed and developed from scratch — from single-page brand sites to full web applications.',
   'Custom websites built for your brand.', 15000, '2-4 weeks', 1),
  ('design', 'Graphic & Poster Design', 'graphic-poster-design',
   'Eye-catching posters, flyers, and print-ready graphic design for events, campaigns, and brand promotions.',
   'Posters and graphics that get noticed.', 999, '2-4 days', 2),
  ('design', 'Social Media Design', 'social-media-design',
   'Cohesive, on-brand social media post templates, story designs, and content kits for consistent posting.',
   'On-brand content for every platform.', 1999, '3-5 days', 3),
  ('lifestyle', 'Saree Pre-Pleating', 'saree-pre-pleating',
   'Professional saree pre-pleating service for weddings and events, so you can drape with ease on the big day.',
   'Perfectly pleated sarees for your big day.', 499, 'Same day', 4),
  ('design', 'Custom Creative Services', 'custom-creative-services',
   'Have something else in mind? We take on bespoke creative projects tailored to your specific needs.',
   'Bespoke creative work, made to order.', NULL, 'Varies', 5)
) AS v(cat_slug, title, slug, description, short_description, starting_price, delivery_estimate, sort_order)
JOIN service_categories c ON c.slug = v.cat_slug
ON CONFLICT DO NOTHING;

INSERT INTO portfolio_categories (name, slug) VALUES
  ('Websites', 'websites'),
  ('Posters', 'posters'),
  ('Social Media', 'social-media'),
  ('Branding', 'branding'),
  ('Creative', 'creative')
ON CONFLICT DO NOTHING;
