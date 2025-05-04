-- DDL para crear la tabla que almacena referencias web descubiertas

CREATE TABLE IF NOT EXISTS public.references (
    id BIGSERIAL PRIMARY KEY,
    discovered_issue_id BIGINT NOT NULL REFERENCES public.discovered_issues(id) ON DELETE CASCADE, -- Foreign key to the specific issue
    url TEXT NOT NULL, -- URL should be unique per issue_id, not globally
    title TEXT,
    is_relevant BOOLEAN DEFAULT false NOT NULL,
    extracts TEXT[], -- Almacena los fragmentos de texto clave extraídos (Array de strings)
    tags TEXT[],      -- Almacena las etiquetas de clasificación (Array de strings)
    summary TEXT,     -- Resumen generado por LLM sobre la relación con los related_issues
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Timestamp de cuándo se obtuvo la URL

    -- Constraint to ensure URL is unique per discovered_issue_id
    CONSTRAINT references_discovered_issue_id_url_key UNIQUE (discovered_issue_id, url)
);

-- Opcional: Añadir índices para columnas consultadas frecuentemente
CREATE INDEX IF NOT EXISTS idx_references_discovered_issue_id ON public.references (discovered_issue_id);
-- URL index might not be needed if the primary lookup is via issue_id + url constraint
-- CREATE INDEX IF NOT EXISTS idx_references_url ON public.references (url);
-- Índice GIN es útil para buscar dentro de arrays TEXT[]
-- CREATE INDEX IF NOT EXISTS idx_references_related_issues ON public.references USING GIN (related_issues);
CREATE INDEX IF NOT EXISTS idx_references_tags ON public.references USING GIN (tags);
-- Índice GIN es bueno para buscar dentro de JSONB o TEXT[]
CREATE INDEX IF NOT EXISTS idx_references_extracts ON public.references USING GIN (extracts);
-- Índice estándar para summary, considerar índice FTS (Full-Text Search) si se requiere búsqueda avanzada en el texto
CREATE INDEX IF NOT EXISTS idx_references_summary ON public.references (summary);
CREATE INDEX IF NOT EXISTS idx_references_created_at ON public.references (created_at DESC);

-- Añadir comentarios para explicar la tabla y las columnas
COMMENT ON TABLE public.references IS 'Almacena referencias web encontradas durante la investigación, vinculadas a un issue específico.';
COMMENT ON COLUMN public.references.discovered_issue_id IS 'Referencia al ID del issue específico en la tabla discovered_issues.';
COMMENT ON COLUMN public.references.url IS 'URL de la fuente web. Debe ser única para cada issue_id.';
COMMENT ON COLUMN public.references.title IS 'Título de la página web.';
-- COMMENT ON COLUMN public.references.related_issues IS 'Array de textos que representan los temas o términos de búsqueda originales asociados con esta referencia.';
COMMENT ON COLUMN public.references.is_relevant IS 'Indica si la fuente es relevante para el issue asociado (determinado por LLM).';
COMMENT ON COLUMN public.references.extracts IS 'Fragmentos clave extraídos del contenido (formato TEXT[], array de strings).';
COMMENT ON COLUMN public.references.tags IS 'Etiquetas de clasificación del contenido (formato TEXT[], array de strings).';
COMMENT ON COLUMN public.references.summary IS 'Resumen generado por el LLM explicando los puntos clave de la referencia en relación al issue asociado.';
COMMENT ON COLUMN public.references.created_at IS 'Timestamp de cuándo se obtuvo inicialmente la URL de referencia.';


-- Policy para dar acceso completo al rol de servicio (común en Supabase)
CREATE POLICY "service role is admin"
ON "public"."references"
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Enable RLS for references table
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;
