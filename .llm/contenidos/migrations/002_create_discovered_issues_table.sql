-- DDL para crear la tabla que almacena issues individuales descubiertos

CREATE TABLE IF NOT EXISTS public.discovered_issues (
    id BIGSERIAL PRIMARY KEY,
    source_type TEXT NOT NULL, -- Ej: 'reddit', 'forum_xyz', 'web_search'
    source_id BIGINT, -- ID del hilo/post/entidad padre de la fuente original (ej: ID de reddit_discovered_threads si source_type es 'reddit')
    source_url TEXT, -- URL del hilo/página original donde se encontró
    issue_text TEXT NOT NULL, -- Texto del issue (EN ESPAÑOL)
    sentiment SMALLINT, -- Sentimiento predominante (-100 a 100)
    issue_type TEXT, -- Tipo de issue (ej: 'Pregunta Directa', 'Descripción Problema')
    tags TEXT[], -- Array de tags en español para categorización
    priority_score SMALLINT, -- Puntuación 0-100 para priorización de contenido
    extracted_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Fecha/hora de extracción del issue
    status TEXT DEFAULT 'new' NOT NULL -- Ej: new, theme_assigned, discarded

    -- No hay FK directa para permitir IDs de diversas fuentes
);

-- Opcional: Añadir índices
CREATE INDEX IF NOT EXISTS idx_discovered_issues_source_type ON public.discovered_issues (source_type);
CREATE INDEX IF NOT EXISTS idx_discovered_issues_status ON public.discovered_issues (status);
CREATE INDEX IF NOT EXISTS idx_discovered_issues_source_id ON public.discovered_issues (source_id);
CREATE INDEX IF NOT EXISTS idx_discovered_issues_sentiment ON public.discovered_issues (sentiment);
-- Considerar índice GIN para tags si las búsquedas por tags son frecuentes:
CREATE INDEX IF NOT EXISTS idx_discovered_issues_tags ON public.discovered_issues USING GIN (tags);

-- Añadir comentarios
COMMENT ON TABLE public.discovered_issues IS 'Almacena problemas o preguntas individuales identificadas de diversas fuentes (Reddit, foros, etc.) para análisis y creación de contenido.';
COMMENT ON COLUMN public.discovered_issues.source_type IS 'Indica la fuente original del issue (ej: reddit, forum_xyz).';
COMMENT ON COLUMN public.discovered_issues.source_id IS 'Referencia al ID del hilo/post/entidad padre en la fuente original.';
COMMENT ON COLUMN public.discovered_issues.source_url IS 'URL específica del post/comentario original, si es diferente de la URL del hilo.';
COMMENT ON COLUMN public.discovered_issues.issue_text IS 'Texto del issue, ya traducido al español.';
COMMENT ON COLUMN public.discovered_issues.sentiment IS 'Puntuación de sentimiento detectado en el issue_text (-100=muy negativo, 0=neutro, 100=muy positivo).';
COMMENT ON COLUMN public.discovered_issues.issue_type IS 'Clasificación del tipo de issue (ej: Pregunta Directa).';
COMMENT ON COLUMN public.discovered_issues.tags IS 'Array de tags en español para categorizar el issue.';
COMMENT ON COLUMN public.discovered_issues.priority_score IS 'Puntuación (0-100) asignada por el agente para priorizar la creación de contenido sobre este issue.';
COMMENT ON COLUMN public.discovered_issues.extracted_at IS 'Timestamp de cuándo se extrajo este issue específico.';
COMMENT ON COLUMN public.discovered_issues.status IS 'Estado del procesamiento de este issue (ej: asignado a un tema, descartado).';

-- Policy to grant full access to service_role on discovered_issues table
CREATE POLICY "service role is admin"
ON "public"."discovered_issues"
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);