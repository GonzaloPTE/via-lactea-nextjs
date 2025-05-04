// Type definition based on 20250504110002_create_discovered_issues_table.sql
export interface DiscoveredIssue {
    id: number;
    source_type: string | null;
    source_id: number | null; // Assuming BIGINT maps to number
    source_url: string | null;
    issue_text: string;
    sentiment: number | null; // Assuming SMALLINT maps to number
    issue_type: string | null;
    tags: string[] | null;
    priority_score: number | null; // Assuming SMALLINT maps to number
    extracted_at: string | null; // Assuming TIMESTAMPTZ maps to string
    status: string | null; // Existing status field, e.g., 'new', 'ref_analysis_done', 'ref_analysis_error'
}

// Add other relevant types/interfaces from Supabase schema as needed 