import type { PostGenerationData } from './03-step-04-fetch-data-for-generation';
import { generateBlogPostWithLLM } from '../components/llmClient';

// --- Function ---
export async function generateBlogPostContent(postData: PostGenerationData | null): Promise<string | null> {
    if (!postData) {
        console.log('  Skipping content generation as post data is null.');
        return null;
    }
    // Basic validation
    if (!postData.blogPostTitle || !postData.issues || !postData.references) {
        console.warn('  Skipping content generation due to missing data in postData object.', postData);
        return null;
    }

    console.log(`  Generating content for post: "${postData.blogPostTitle}"`);

    // 1. Call LLM Client function directly
    try {
        // Pass necessary fields. llmClient function now handles prompt loading/formatting.
        const rawContent = await generateBlogPostWithLLM(
            postData.blogPostTitle,
            postData.issues, // Assumes llmClient function accepts full DiscoveredIssue[]
            postData.references // Assumes llmClient function accepts ReferenceForPrompt[]
        );
        return rawContent;
    } catch (error: any) {
        // Error should be logged within generateBlogPostWithLLM
        console.error(`  Error during content generation step for "${postData.blogPostTitle}": ${error.message}`);
        return null;
    }
} 