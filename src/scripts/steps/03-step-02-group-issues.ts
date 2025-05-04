import type { FetchedIssueData } from './03-step-01-fetch-processed-issues';
import { groupIssuesWithLLM, PostGroupData } from '../components/llmClient';

// --- Types ---
export type { PostGroupData }; // Re-export the type from llmClient

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

    // 1. Prepare input for LLM (only id, text, tags)
    const llmInputIssues: PostGroupInputIssue[] = issues.map(issue => ({
        id: issue.id,
        issue_text: issue.issue_text,
        tags: issue.tags,
    }));

    // 2. Call LLM Client function directly
    try {
        const postGroups = await groupIssuesWithLLM(llmInputIssues);
        return postGroups;
    } catch (error: any) {
        // Error is already logged within groupIssuesWithLLM
        console.error(`  Error during issue grouping step: ${error.message}`);
        return [];
    }
} 