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
  issue_id: string; // Foreign key to discovered_issues
  is_relevant: boolean;
  extracts: string[];
  tags: string[];
  summary: string;
  // Add provider, model info if needed later
}

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key not found in environment variables.');
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
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
  // TODO: Refine this query based on how 'pending' is defined.
  // Example: Filter where a 'needs_research' flag is true,
  // or perform a left join with 'references' and filter where no match exists.
  const { data, error } = await client
    .from('discovered_issues')
    .select('id, issue_text') // Select only needed fields
    .order('priority_score', { ascending: false }) // Example ordering
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
 * @param issueId The ID of the issue.
 * @returns Promise resolving to true if the reference exists, false otherwise.
 */
export async function checkReferenceExistsForIssue(url: string, issueId: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { data, error, count } = await client
        .from('references')
        .select('id', { count: 'exact', head: true }) // Efficiently check existence
        .eq('url', url)
        .eq('issue_id', issueId);

    if (error) {
        console.error('Error checking reference existence:', error);
        // Decide if throwing or returning false is better
        throw error;
    }

    return (count ?? 0) > 0;
}


/**
 * Saves reference data to the 'references' table in Supabase.
 * Assumes the table 'references' exists with columns matching ReferenceData keys.
 * @param data The ReferenceData object to save.
 * @returns Promise resolving when the operation is complete.
 */
export async function saveReference(data: ReferenceData): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client
    .from('references')
    .insert([
      {
        url: data.url,
        issue_id: data.issue_id,
        is_relevant: data.is_relevant,
        extracts: data.extracts,
        tags: data.tags,
        summary: data.summary,
        // Ensure column names here match your Supabase table exactly
      },
    ]);

  if (error) {
    console.error('Error saving reference:', error);
    throw error;
  }

  console.log(`Reference saved for issue ${data.issue_id}: ${data.url}`);
} 