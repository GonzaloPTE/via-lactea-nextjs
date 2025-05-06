-- Migration para añadir columna de tags a la tabla blog_posts

-- Añadir columna para almacenar un array de etiquetas (tags)
ALTER TABLE public.blog_posts
ADD COLUMN tags TEXT[] NULL;

COMMENT ON COLUMN public.blog_posts.tags IS 'Array de etiquetas asociadas al post.';

-- Opcional: Añadir un índice GIN para búsquedas eficientes dentro del array de tags
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN (tags); 