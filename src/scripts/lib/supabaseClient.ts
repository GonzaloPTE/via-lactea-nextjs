import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Define the structure for an Issue retrieved from Supabase
export interface Issue {
  id: string; // Assuming UUID
  issue_text: string;
  // Add other relevant fields from discovered_issues if needed
}

// Define the structure for Reference data to be saved
export interface ReferenceData {
  url: string;
  discovered_issue_id: string | number; // Match the type of discovered_issues.id (assuming BIGINT -> string or number)
  is_relevant: boolean;
  extracts: string[];
  tags: string[];
  summary: string;
  // related_issues?: string[]; -- REMOVED
}

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  // Determine key based on environment (prefer service role if available)
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const keyType = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role' : 'Anon';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Supabase URL or Key (${keyType}) not found in environment variables.`);
  }

  console.log(`Initializing Supabase client with ${keyType} key.`); // Log which key is used

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

/**
 * Fetches issues from the 'discovered_issues' table that need research.
 * TODO: Define the exact criteria for 'pending' (e.g., needs_research=true, or check if issue_id exists in references table).
 * For now, it fetches issues sorted by priority, limiting the result.
 * @param limit Max number of issues to fetch.
 * @returns Promise resolving to an array of Issues.
 */
export async function getPendingIssues(limit: number = 10): Promise<Issue[]> {
  const client = getSupabaseClient();
  // --- Applying status filter and deterministic sort ---
  const { data, error } = await client
    .from('discovered_issues')
    .select('id, issue_text') // Select only needed fields
    .eq('status', 'new') // <-- Filter for pending status
    .order('priority_score', { ascending: false }) // Primary order
    .order('id', { ascending: true }) // <-- Add secondary sort by ID for determinism
    .limit(limit);

  if (error) {
    console.error('Error fetching pending issues:', error);
    throw error;
  }

  return data || [];
}

/**
 * Checks if a reference URL already exists for a specific issue_id in the 'references' table.
 * @param url The URL of the reference.
 * @param discoveredIssueId The ID of the issue.
 * @returns Promise resolving to true if the reference exists, false otherwise.
 */
export async function checkReferenceExistsForIssue(url: string, discoveredIssueId: string | number): Promise<boolean> {
    const client = getSupabaseClient();
    const { error, count } = await client
        .from('references')
        .select('id', { count: 'exact', head: true }) // Efficiently check existence
        .eq('url', url)
        .eq('discovered_issue_id', discoveredIssueId);

    if (error) {
        console.error('Error checking reference existence:', error);
        // Decide if throwing or returning false is better
        throw error;
    }

    return (count ?? 0) > 0;
}

/**
 * Saves one or more reference data objects to the 'references' table in Supabase.
 * @param data A single ReferenceData object or an array of ReferenceData objects.
 * @returns Promise resolving when the operation is complete.
 */
export async function saveReference(data: ReferenceData | ReferenceData[]): Promise<void> {
  const client = getSupabaseClient();
  const referencesToInsert = Array.isArray(data) ? data : [data];

  if (referencesToInsert.length === 0) {
    console.log('No references to save.');
    return;
  }

  // Map data to ensure structure matches table columns exactly
  const insertPayload = referencesToInsert.map(ref => ({
    url: ref.url,
    discovered_issue_id: ref.discovered_issue_id,
    is_relevant: ref.is_relevant,
    extracts: ref.extracts,
    tags: ref.tags,
    summary: ref.summary,
    // created_at defaults in DB
  }));

  const { error } = await client
    .from('references')
    .insert(insertPayload);

  if (error) {
    console.error('Error saving references:', error);
    // Consider more granular error handling for batch inserts if needed
    throw error;
  }

  console.log(`Successfully saved ${insertPayload.length} reference(s). First URL: ${insertPayload[0].url}`);
} 