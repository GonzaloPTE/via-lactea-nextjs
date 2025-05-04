-- DDL para crear la tabla que almacena referencias web descubiertas

CREATE TABLE IF NOT EXISTS public.references (
    id BIGSERIAL PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    related_issues TEXT[], -- Array de temas/issues originales asociados a esta referencia
    is_relevant BOOLEAN DEFAULT false NOT NULL,
    extracts TEXT[], -- Almacena los fragmentos de texto clave extraídos (Array de strings)
    tags TEXT[],      -- Almacena las etiquetas de clasificación (Array de strings)
    summary TEXT,     -- Resumen generado por LLM sobre la relación con los related_issues
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL -- Timestamp de cuándo se obtuvo la URL (ej: resultado de búsqueda)
);

-- Opcional: Añadir índices para columnas consultadas frecuentemente
CREATE INDEX IF NOT EXISTS idx_references_url ON public.references (url);
-- Índice GIN es útil para buscar dentro de arrays TEXT[]
CREATE INDEX IF NOT EXISTS idx_references_related_issues ON public.references USING GIN (related_issues);
CREATE INDEX IF NOT EXISTS idx_references_tags ON public.references USING GIN (tags);
-- Índice GIN es bueno para buscar dentro de JSONB
CREATE INDEX IF NOT EXISTS idx_references_extracts ON public.references USING GIN (extracts);
-- Índice estándar para summary, considerar índice FTS (Full-Text Search) si se requiere búsqueda avanzada en el texto
CREATE INDEX IF NOT EXISTS idx_references_summary ON public.references (summary);
CREATE INDEX IF NOT EXISTS idx_references_created_at ON public.references (created_at DESC);

-- Añadir comentarios para explicar la tabla y las columnas
COMMENT ON TABLE public.references IS 'Almacena referencias web encontradas durante la investigación, junto con información relevante extraída.';
COMMENT ON COLUMN public.references.url IS 'URL única de la fuente web.';
COMMENT ON COLUMN public.references.title IS 'Título de la página web.';
COMMENT ON COLUMN public.references.related_issues IS 'Array de textos que representan los temas o issues de investigación originales asociados con esta referencia.';
COMMENT ON COLUMN public.references.is_relevant IS 'Indica si la fuente es relevante para los temas asociados (determinado por LLM).';
COMMENT ON COLUMN public.references.extracts IS 'Fragmentos clave extraídos del contenido (formato JSONB, usualmente array de strings).';
COMMENT ON COLUMN public.references.tags IS 'Etiquetas de clasificación del contenido (formato TEXT[], array de strings).';
COMMENT ON COLUMN public.references.summary IS 'Resumen generado por el LLM explicando los puntos clave de la referencia en relación a los issues asociados.';
COMMENT ON COLUMN public.references.created_at IS 'Timestamp de cuándo se obtuvo inicialmente la URL de referencia.';


-- Policy para dar acceso completo al rol de servicio (común en Supabase)
CREATE POLICY "service role is admin"
ON "public"."references"
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
