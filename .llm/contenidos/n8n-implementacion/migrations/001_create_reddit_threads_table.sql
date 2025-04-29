-- DDL para crear la tabla que almacena hilos descubiertos de Reddit y sus issues

CREATE TABLE IF NOT EXISTS public.reddit_discovered_threads (
    id BIGSERIAL PRIMARY KEY,
    subreddit TEXT NOT NULL,
    thread_title TEXT NOT NULL,
    thread_title_es TEXT, -- Traducción opcional al español
    thread_url TEXT NOT NULL UNIQUE,
    thread_score INTEGER,
    thread_num_comments INTEGER,
    thread_created_utc TIMESTAMPTZ,
    -- Almacena el array de issues encontrados dentro del hilo
    issues JSONB,
    processed_at TIMESTAMPTZ DEFAULT now() NOT NULL, -- Fecha/hora de inserción/procesamiento
    status TEXT DEFAULT 'pending_analysis' NOT NULL -- Ej: pending_analysis, analysis_complete, error
);

-- Opcional: Añadir índices para columnas consultadas frecuentemente
CREATE INDEX IF NOT EXISTS idx_reddit_threads_subreddit ON public.reddit_discovered_threads (subreddit);
CREATE INDEX IF NOT EXISTS idx_reddit_threads_created_utc ON public.reddit_discovered_threads (thread_created_utc DESC);
CREATE INDEX IF NOT EXISTS idx_reddit_threads_status ON public.reddit_discovered_threads (status);

-- Añadir comentarios para explicar la tabla y las columnas
COMMENT ON TABLE public.reddit_discovered_threads IS 'Almacena hilos de Reddit identificados por el workflow de n8n como potencialmente relevantes para la creación de contenido.';
COMMENT ON COLUMN public.reddit_discovered_threads.thread_title_es IS 'Traducción al español del título original del hilo.';
COMMENT ON COLUMN public.reddit_discovered_threads.issues IS 'Array JSONB de objetos, cada uno representando un issue/pregunta identificado en el hilo. Objeto de ejemplo: { "issue_text": "...", "type": "Pregunta Directa" }';
COMMENT ON COLUMN public.reddit_discovered_threads.processed_at IS 'Timestamp de cuándo el registro fue insertado/procesado por el workflow de n8n.';
COMMENT ON COLUMN public.reddit_discovered_threads.status IS 'Estado de procesamiento de este hilo por workflows posteriores (ej. Analista de Temas).';

-- Policy to grant full access to service_role on reddit_discovered_threads table
CREATE POLICY "service role is admin"
ON "public"."reddit_discovered_threads"
AS PERMISSIVE
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);