import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import type { Database } from '../../types/supabase'; // Import Database type

// Define types locally
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];
type Reference = Database['public']['Tables']['references']['Row'];
export type ReferenceData = Database['public']['Tables']['references']['Insert'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

dotenv.config();

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
 * @param limit Max number of issues to fetch, or null/undefined to fetch all.
 * @returns Promise resolving to an array of DiscoveredIssues.
 */
export async function getPendingIssues(limit: number | null = 10): Promise<DiscoveredIssue[]> {
  const client = getSupabaseClient();
  const selectFields = 'id, source_type, source_id, source_url, issue_text, sentiment, issue_type, tags, priority_score, extracted_at, status';

  // Log based on limit
  const limitLog = limit === null ? 'all' : limit;
  console.log(`Querying Supabase for ${limitLog} issues with status = new...`);

  let query = client
    .from('discovered_issues')
    .select(selectFields)
    .eq('status', 'new')
    .order('priority_score', { ascending: false, nullsFirst: false })
    .order('id', { ascending: true });

  // Conditionally apply limit
  if (limit !== null) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pending issues (status=new):', error);
    throw error;
  }

  console.log(`Supabase query returned ${data?.length ?? 0} issues.`);
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

/**
 * Fetches discovered issues based on their status.
 * @param status The status to filter by.
 * @param limit Optional limit on the number of issues to fetch.
 * @param sourceType Optional source type to filter by.
 * @returns An array of DiscoveredIssue objects or null if none found.
 */
export async function getIssuesByStatus(
    status: string,
    limit: number | null = null,
    sourceType: string | null = null // Add optional parameter
): Promise<DiscoveredIssue[] | null> {
    const client = getSupabaseClient();
    const limitLog = limit === null ? 'all available' : limit;
    const sourceLog = sourceType ? ` and source_type = ${sourceType}` : ''; // Log if filtering by source
    console.log(`  Querying Supabase for ${limitLog} issues with status = ${status}${sourceLog}...`);

    try {
        let query = client
            .from('discovered_issues')
            .select('*') // Select all columns for full issue data
            .eq('status', status);

        // Add source_type filter if provided
        if (sourceType) {
            query = query.eq('source_type', sourceType);
        }

        // Apply limit if provided (and not null)
        if (limit !== null) {
            query = query.limit(limit);
        }

        // Add ordering if needed, e.g., by priority or oldest first
        query = query.order('priority_score', { ascending: false, nullsFirst: false })
                     .order('extracted_at', { ascending: true });

        const { data, error } = await query;

        if (error) {
            console.error('  Error fetching issues by status from Supabase:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.log(`  Supabase query returned 0 issues with status = ${status}${sourceLog}.`);
            return null;
        }

        console.log(`  Supabase query returned ${data.length} issues.`);
        // Ensure the returned data matches the expected type
        return data as DiscoveredIssue[];
    } catch (error) {
        console.error('  Caught error during getIssuesByStatus:', error);
        throw new Error(`Failed to get issues by status: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Fetches references for a list of issue IDs.
 * If relevantOnly is true, only fetches references where is_relevant = true.
 * @param relevantOnly If true, only fetches references where is_relevant = true.
 * @returns An array of Reference objects or null if none found or on error.
 */
export async function getReferencesForIssues(
    issueIds: number[],
    relevantOnly: boolean = false
): Promise<Reference[] | null> {
    const client = getSupabaseClient();
    console.log(`  Querying Supabase for references for ${issueIds.length} issues${relevantOnly ? ' (relevant only)' : ''}...`);

    try {
        let query = client
            .from('references')
            .select('*')
            .in('discovered_issue_id', issueIds); // Use .in() for multiple IDs

        if (relevantOnly) {
            query = query.eq('is_relevant', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('  Error fetching references from Supabase:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.log(`  Supabase query returned 0 references for these issues${relevantOnly ? ' (relevant only)' : ''}.`);
            return null;
        }

        console.log(`  Supabase query returned ${data.length} references.`);
        return data as Reference[];
    } catch (error) {
        console.error('  Caught error during getReferencesForIssues:', error);
        throw new Error(`Failed to get references for issues: ${error instanceof Error ? error.message : String(error)}`);
    }
} 