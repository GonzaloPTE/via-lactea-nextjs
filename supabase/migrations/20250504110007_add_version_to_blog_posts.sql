-- Migration: Add version column to blog_posts table
-- Timestamp: 20250504110007

ALTER TABLE public.blog_posts
ADD COLUMN "version" INTEGER;

COMMENT ON COLUMN public.blog_posts."version" IS 'Número de versión para el contenido del post del blog, típicamente incrementado después de correcciones automatizadas o actualizaciones significativas. Comienza en 1 después de la primera corrección si inicialmente es NULL.'; 