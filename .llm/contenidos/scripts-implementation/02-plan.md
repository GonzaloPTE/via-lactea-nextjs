1.  **Fetch Pending Issues:** Get a batch of issues from the `discovered_issues` table where `status = 'PENDING'` and `reference_analysis_status = 'PENDING'`.
2.  **Generate Search Queries:** For *each* issue, use the LLM (with the `generador-queries.md` template) to generate a list of specific search queries based on the issue's topic/description.
3.  **Execute Google Search:** For *each* generated search query, execute a search using the Google Custom Search API.
4.  **Filter Search Results:** Consolidate search results, removing duplicates (based on URL) and potentially filtering out low-quality domains or results already present in the `references` table for the *same* `discovered_issue_id`.
5.  **Scrape Web Content:** For each unique, relevant URL from the filtered search results, scrape the HTML content of the page.
6.  **Analyze Content Relevance (LLM):** For *each* scraped page, use the LLM (with the `investigacion-referencias.md` template) to analyze its relevance to the original `discovered_issue` topic. The LLM should determine `is_relevant` and provide `extracts`, `tags`, and a `summary`.
7.  **Save Relevant References:** For results marked as `is_relevant` by the LLM, save the analysis (URL, issue ID, extracts, tags, summary) to the `references` table in Supabase.
8.  **Update Issue Status:** Update the `reference_analysis_status` for the processed `discovered_issues` in Supabase (e.g., to 'COMPLETED' or 'ERROR').
