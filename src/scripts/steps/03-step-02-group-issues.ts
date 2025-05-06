import type { FetchedIssueData } from './03-step-01-fetch-processed-issues';
import { groupIssuesWithLLM } from '../components/llmClient';
import fs from 'fs';
import path from 'path';

// --- Types ---
export interface PostGroupData {
    title: string;
    slug: string;
    issue_ids: number[];
    category: string;
    tags: string[];
}

interface PostGroupInputIssue {
    id: number;
    issue_text: string;
    tags: string[] | null;
}

// --- Function ---
export async function groupIssuesIntoPosts(issues: FetchedIssueData[]): Promise<PostGroupData[]> {
    if (!issues || issues.length === 0) {
        return [];
    }
    console.log(`  Preparing ${issues.length} issues for LLM grouping...`);

    // 1. Load valid categories
    const categoriesFilePath = path.resolve(__dirname, '../../../.llm/contenidos/scripts-implementation/categorias-blog-posts.md');
    let validCategories: string[] = [];
    try {
        const categoriesFileContent = fs.readFileSync(categoriesFilePath, 'utf-8');
        validCategories = categoriesFileContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                const match = line.match(/^\d+\.\s*\*\*(.*)\*\*$/);
                return match ? match[1].trim() : null;
            })
            .filter((category): category is string => category !== null);

        if (validCategories.length === 0) {
            console.warn("Warning: Could not parse categories from file.");
        }
    } catch (error) {
        console.error("Error reading categories file:", categoriesFilePath, error);
        throw new Error("Failed to load blog post categories for grouping prompt.");
    }

    // 2. Prepare input issues for the prompt formatter
    const llmInputIssues: PostGroupInputIssue[] = issues.map(issue => ({
        id: issue.id,
        issue_text: issue.issue_text,
        tags: issue.tags,
    }));

    // NOTE: Category reading logic is here but commented out as groupIssuesWithLLM 
    // needs internal modification to accept/use categories for its prompt.
    // --> This is now implemented. Uncommenting the call with categories.

    // 4. Call LLM
    try {
        console.log("  Sending request to LLM for grouping...");
        // Assuming groupIssuesWithLLM takes issues and categories, formats internally, and returns parsed data
        // Passing issues and validCategories as per updated function signature
        const llmResponseGroups: any[] = await groupIssuesWithLLM(llmInputIssues, validCategories);

        // 5. Parse LLM response (assuming JSON output as planned)
        if (!llmResponseGroups || !Array.isArray(llmResponseGroups)) {
            console.error("  LLM returned invalid or non-array response.");
            return [];
        }

        // 6. Validate and Map the LLM response to PostGroupData interface
        const validatedAndMappedGroups: PostGroupData[] = llmResponseGroups.map((group: any) => {
            // Basic validation
            if (!group || !group.titulo || !group.slug || !Array.isArray(group.issuesIds) || !group.category || !Array.isArray(group.tags)) {
                console.warn("Skipping invalid group structure from LLM:", group);
                return null; // Skip this group
            }
            // Category validation
            if (!validCategories.includes(group.category)) {
                console.warn(`Skipping group with invalid category '${group.category}' from LLM:`, group);
                return null; // Skip this group
            }
            // Map to the correct interface
            return {
                title: group.titulo, // Map from titulo
                slug: group.slug,
                issue_ids: group.issuesIds, // Map from issuesIds
                category: group.category,
                tags: group.tags
            };
        }).filter((group): group is PostGroupData => group !== null); // Filter out nulls and ensure type

        console.log(`  LLM response processed. Found ${validatedAndMappedGroups.length} valid groups.`);
        return validatedAndMappedGroups;

    } catch (error: any) {
        console.error(`  Error calling LLM for issue grouping: ${error.message}`);
        return [];
    }
} 