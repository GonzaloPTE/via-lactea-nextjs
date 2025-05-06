import type { PostGenerationData } from './03-step-04-fetch-data-for-generation';
import { generateBlogPostWithLLM } from '../components/llmClient';

export interface BlogContentOutput {
    markdownContent: string;
    metaDescription: string;
}

// --- Function ---
export async function generateBlogPostContent(postData: PostGenerationData | null): Promise<BlogContentOutput | null> {
    if (!postData) {
        console.log('  Skipping content generation as post data is null.');
        return null;
    }
    // Basic validation - ensuring essential parts of postData are present
    if (!postData.blogPostTitle || 
        !postData.slug || 
        // category can be null, tags can be null or empty
        !postData.issues || postData.issues.length === 0 
        // references can be empty, so not strictly required for this check
    ) {
        console.warn('  Skipping content generation due to missing critical data in postData object (title, slug, or issues).', postData);
        return null;
    }

    console.log(`  Generating content for post: "${postData.blogPostTitle}" (ID: ${postData.postId})`);

    try {
        // Pass the full postData object to the LLM client function
        const rawLLMResponse = await generateBlogPostWithLLM(postData);

        // Explicitly check for null or undefined, allow empty string to proceed
        if (rawLLMResponse === null || rawLLMResponse === undefined) {
            console.error(`  LLM returned null or undefined response for "${postData.blogPostTitle}".`);
            return null;
        }

        // Parse rawContent into markdownContent and metaDescription
        // Handle empty string case here as well
        if (rawLLMResponse.trim() === '') {
            console.warn(`  LLM returned an empty string for "${postData.blogPostTitle}". Returning empty content.`);
            return {
                markdownContent: '',
                metaDescription: ''
            };
        }

        const parts = rawLLMResponse.split(/\n---\n/);
        if (parts.length < 2) {
            console.warn(`  LLM response for "${postData.blogPostTitle}" did not contain the expected separator '---'. Treating entire response as markdown.`);
            // Fallback: treat entire response as markdown, empty meta description
            return {
                markdownContent: rawLLMResponse.trim(),
                metaDescription: '' 
            };
        }

        const markdownContent = parts.slice(0, -1).join('\n---\n').trim(); // Join back if separator was in content
        const metaDescription = parts[parts.length - 1].trim();

        if (!markdownContent) {
            console.warn(`  LLM response for "${postData.blogPostTitle}" resulted in empty markdown content after parsing.`);
             // Depending on strictness, could return null or empty content.
             // For now, returning with potentially empty markdown if meta is there.
        }
        if (!metaDescription && markdownContent) { // Log if meta is missing but markdown is present
             console.warn(`  LLM response for "${postData.blogPostTitle}" has markdown but is missing meta description after parsing.`);
        }

        return {
            markdownContent,
            metaDescription,
        };

    } catch (error: any) {
        console.error(`  Error during content generation step for "${postData.blogPostTitle}": ${error.message}`);
        return null;
    }
} 