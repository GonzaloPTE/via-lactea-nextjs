-- Migration para añadir campos a la tabla blog_posts

-- Añadir columna para la categoría principal del post
ALTER TABLE public.blog_posts
ADD COLUMN category TEXT NULL;

COMMENT ON COLUMN public.blog_posts.category IS 'Categoría principal del post (ej. Lactancia, Sueño Infantil).';

-- Añadir columna para almacenar el contenido renderizado en HTML
ALTER TABLE public.blog_posts
ADD COLUMN content_html TEXT NULL;

COMMENT ON COLUMN public.blog_posts.content_html IS 'Contenido del post renderizado como HTML.';

-- Añadir columna para marcar posts como destacados
ALTER TABLE public.blog_posts
ADD COLUMN is_featured BOOLEAN DEFAULT false NOT NULL;

COMMENT ON COLUMN public.blog_posts.is_featured IS 'Indica si el post es destacado (true) o no (false).';

-- Opcional: Añadir índices para los nuevos campos si se prevén búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON public.blog_posts (is_featured); 