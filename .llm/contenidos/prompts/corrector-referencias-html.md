Eres un asistente experto en HTML y corrección de contenido.
Tu tarea es analizar el siguiente fragmento de HTML (`CONTENT_HTML`) y una lista de referencias bibliográficas (`NUMBERED_REFERENCES`).
Debes identificar cualquier placeholder de referencia o enlace incorrecto dentro del `CONTENT_HTML` y reemplazarlo con una cita numerada y enlazada correctamente.

**Formato de Cita Requerido:**
La cita en el texto debe ser un número entre corchetes: `[1]`, `[2]`, etc.
Este número debe ser un hipervínculo a la URL de la referencia correspondiente de la lista `NUMBERED_REFERENCES`.
El formato HTML exacto del enlace debe ser: `<a href="URL_DE_LA_REFERENCIA" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[N]</a>`, donde `N` es el número de la referencia.

**Instrucciones Detalladas:**

1.  **Analiza el `CONTENT_HTML`:** Busca patrones comunes de placeholders o enlaces incorrectos. Algunos ejemplos (no exhaustivos) son:
    *   Texto entre corchetes simples o dobles: `[descripción de la referencia]`, `[[Fuente X]]`
    *   Texto entre paréntesis que indique una fuente o referencia pero sin enlace: `(Fuente: Artículo Y)`, `(ver estudio Z)`
    *   Enlaces con `href="#"` o `href="[placeholder]"` o `href` apuntando a URLs genéricas no específicas.
    *   Menciones directas a fuentes que claramente deberían estar enlazadas.

2.  **Consulta `NUMBERED_REFERENCES`:** Esta lista se proveerá con cada referencia numerada y contendrá `url`, `title`, `summary`, y `extracts`.
    ```
    NUMBERED_REFERENCES:
    {{#each numbered_references}}
    Ref {{this.number}}:
      URL: {{this.url}}
      Title: {{this.title}}
      Summary: {{this.summary}}
      Extracts: {{#if this.extracts}}{{#each this.extracts}}- {{this}}
      {{/each}}{{else}}N/A{{/if}}
    {{/each}}
    ```

3.  **Haz Coincidir y Reemplaza:**
    *   Para cada placeholder o enlace incorrecto identificado en el `CONTENT_HTML`, intenta encontrar la referencia más adecuada de la lista `NUMBERED_REFERENCES` basándote en el contexto del placeholder y la información de la referencia (título, resumen, extractos).
    *   Una vez encontrada la coincidencia (por ejemplo, el placeholder "[estudio sobre sueño infantil]" coincide con la "Ref 3" de la lista), reemplaza el placeholder completo (o el enlace incorrecto completo incluyendo su texto de anclaje original) con la cita formateada: `<a href="URL_DE_REF_3" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[3]</a>`.

4.  **Ejemplos de Transformación (usa estos como guía estricta para el formato):**
    *   **Original:** `...como indica el estudio sobre sueño infantil (ver estudio sobre microsiestas)...`
        **Si "estudio sobre microsiestas" coincide con la Ref 3 (URL: http://example.com/microsiestas de la lista `NUMBERED_REFERENCES`):**
        **Transformado:** `...como indica el estudio sobre sueño infantil<a href="http://example.com/microsiestas" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[3]</a>...`

    *   **Original:** `...según la OMS [enlace a OMS lactancia]...`
        **Si "enlace a OMS lactancia" coincide con la Ref 1 (URL: http://who.int/lactancia de la lista `NUMBERED_REFERENCES`):**
        **Transformado:** `...según la OMS<a href="http://who.int/lactancia" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[1]</a>...`

    *   **Original:** `... (Fuente: KidsHealth, siestas)...`
        **Si "KidsHealth, siestas" coincide con la Ref 5 (URL: http://kidshealth.org/siestas de la lista `NUMBERED_REFERENCES`):**
        **Transformado:** `... <a href="http://kidshealth.org/siestas" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[5]</a>...` (El texto original "Fuente: ..." se reemplaza por la cita enlazada).

    *   **Original:** `... <a href="#">un artículo reciente</a> mencionó...`
        **Si "un artículo reciente" coincide con la Ref 2 (URL: http://articulos.com/reciente de la lista `NUMBERED_REFERENCES`):**
        **Transformado:** `... <a href="http://articulos.com/reciente" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[2]</a> mencionó...` (Se reemplaza el enlace incorrecto y su texto de anclaje original por la cita enlazada).

5.  **Manejo de Casos Sin Coincidencia:**
    *   Si un placeholder es muy genérico y no puedes encontrar una referencia adecuada con alta confianza, déjalo como está en el HTML original.
    *   No inventes referencias ni enlaces.
    *   No elimines contenido original a menos que sea claramente un placeholder que no puedes resolver y que no aporta valor (ej. `[insertar enlace aquí]`). En caso de duda, déjalo.

6.  **Salida:**
    *   Devuelve ÚNICAMENTE el `CONTENT_HTML` completo con las correcciones aplicadas.
    *   Asegúrate de que el HTML resultante sea válido.
    *   No incluyas explicaciones adicionales, solo el HTML.
    *   Conserva toda la estructura HTML original y solo modifica los puntos de referencia.

**CONTENT_HTML A CORREGIR:**
```html
{{{htmlContent}}}
```

**LISTA DE REFERENCIAS DISPONIBLES (NUMBERED_REFERENCES):**
```
{{#each numberedReferencesForPrompt}}
Ref {{this.number}}:
  URL: {{this.url}}
  Title: {{this.title}}
  Summary: {{this.summary}}
  Extracts: {{#if this.extracts}}{{#each this.extracts}}
    - {{{this}}}
  {{/each}}{{else}}N/A{{/if}}

{{/each}}
```

**HTML CORREGIDO:**
(Aquí espero únicamente el HTML modificado) 