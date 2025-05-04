-- DDL para crear la tabla que almacena los posts de blog generados

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE, -- Asegura que los slugs sean únicos
    issue_ids BIGINT[] NOT NULL, -- Array de IDs de discovered_issue agrupados en este post
    content TEXT, -- Contenido Markdown generado por LLM (inicialmente NULL)
    meta_description TEXT, -- Meta descripción para SEO (extraída del contenido generado)
    status TEXT DEFAULT 'draft' NOT NULL, -- ej., draft, published, error
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts (created_at DESC);
-- Índice GIN para buscar dentro del array issue_ids si es necesario
CREATE INDEX IF NOT EXISTS idx_blog_posts_issue_ids ON public.blog_posts USING GIN (issue_ids);

-- Comentarios
COMMENT ON TABLE public.blog_posts IS 'Almacena borradores de posts de blog generados basados en issues agrupados y referencias.';
COMMENT ON COLUMN public.blog_posts.title IS 'El título atractivo generado para el post del blog.';
COMMENT ON COLUMN public.blog_posts.slug IS 'Slug amigable para URL generado a partir del título.';
COMMENT ON COLUMN public.blog_posts.issue_ids IS 'Array de IDs de la tabla discovered_issues que se agrupan en este post.';
COMMENT ON COLUMN public.blog_posts.content IS 'El contenido completo en Markdown del post del blog generado por el LLM.';
COMMENT ON COLUMN public.blog_posts.meta_description IS 'Meta descripción concisa para SEO, extraída de la generación del LLM.';
COMMENT ON COLUMN public.blog_posts.status IS 'Estado actual del post del blog (draft, published, error).';

-- RLS Policies (Example: Service role has full access)
CREATE POLICY "service role is admin"
ON "public"."blog_posts"
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY; 