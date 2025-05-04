import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Import the refined type
import type { DiscoveredIssue } from '../../types/supabase';

dotenv.config();

// Remove old Issue interface if no longer needed elsewhere, or keep if used
/*
export interface Issue {
  id: string; 
  issue_text: string;
}
*/

// Define the structure for Reference data to be saved
export interface ReferenceData {
  url: string;
  discovered_issue_id: number;
  is_relevant: boolean;
  extracts: string[];
  tags: string[];
  summary: string;
}

let supabase: SupabaseClient | null = null;

// Export the function for test access
export function getSupabaseClient(): SupabaseClient {
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
 * Fetches issues from the 'discovered_issues' table that need reference analysis.
 * Filters by status = 'new' (assuming 'new' means pending reference analysis).
 * @param limit Max number of issues to fetch.
 * @returns Promise resolving to an array of DiscoveredIssues.
 */
export async function getPendingIssues(limit: number = 10): Promise<DiscoveredIssue[]> {
  const client = getSupabaseClient();
  // Select all fields defined in the DiscoveredIssue type
  const selectFields = 'id, source_type, source_id, source_url, issue_text, sentiment, issue_type, tags, priority_score, extracted_at, status';

  console.log(`Querying Supabase for ${limit} issues with status = new...`);

  const { data, error } = await client
    .from('discovered_issues')
    .select(selectFields)
    .eq('status', 'new') // <-- Filter by status = 'new'
    .order('priority_score', { ascending: false, nullsFirst: false }) // Optional: Order by priority if desired
    .order('id', { ascending: true }) // Ensure deterministic order
    .limit(limit);

  if (error) {
    console.error('Error fetching pending issues (status=new):', error);
    throw error;
  }

  console.log(`Supabase query returned ${data?.length ?? 0} issues.`);
  // Cast the result to DiscoveredIssue[]
  return (data as DiscoveredIssue[]) || [];
}

/**
 * Checks if a reference URL already exists for a specific issue_id in the 'references' table.
 * @param url The URL of the reference.
 * @param discoveredIssueId The ID of the issue (should be number).
 * @returns Promise resolving to true if the reference exists, false otherwise.
 */
export async function checkReferenceExistsForIssue(url: string, discoveredIssueId: number): Promise<boolean> {
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