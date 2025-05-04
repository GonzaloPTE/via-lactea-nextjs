import { saveReference, ReferenceData } from '../lib/supabaseClient';
import { WrappedAnalysisResult } from './02-parallel-analysis'; // Import type from previous step

/**
 * Processes the results from LLM analysis and saves relevant references to the database.
 */
export async function processAndSaveResults(
    settledAnalysisResults: PromiseSettledResult<WrappedAnalysisResult>[]
) {
    if (settledAnalysisResults.length === 0) {
        console.log('\nStep 4: Skipping result processing and saving (no analysis results).');
        return;
    }
    console.log('\nStep 4: Processing analysis results and saving relevant references...');
    const referencesToSave: ReferenceData[] = [];

    settledAnalysisResults.forEach(result => {
        if (result.status === 'fulfilled') {
            const outcome = result.value;
            if (outcome.status === 'fulfilled' && outcome.value?.is_relevant === true) {
                console.log(`  - Relevant reference found: ${outcome.original.url}`);
                referencesToSave.push({
                    url: outcome.original.url,
                    discovered_issue_id: outcome.original.issue.id,
                    is_relevant: outcome.value.is_relevant,
                    extracts: outcome.value.extracts ?? [],
                    tags: outcome.value.tags ?? [],
                    summary: outcome.value.summary ?? '',
                });
            } else if (outcome.status === 'fulfilled' && outcome.value?.is_relevant === false) {
                 console.log(`  - Non-relevant reference processed: ${outcome.original.url}`);
            } else if (outcome.status === 'fulfilled' && outcome.value === null) {
                 console.warn(`  - Analysis returned null for: ${outcome.original.url}`);
            } else if (outcome.status === 'rejected') {
                console.error(`  - Analysis failed (internal error) for: ${outcome.original.url}`, outcome.reason);
            }
        } else {
            console.error(`  - Outer promise rejected for unknown URL:`, result.reason);
        }
    });

    if (referencesToSave.length > 0) {
        console.log(`  Saving ${referencesToSave.length} relevant reference(s) to database...`);
        try {
            await saveReference(referencesToSave);
            console.log('  References saved successfully.');
        } catch (error) {
            console.error('  Error saving references to database:', error);
        }
    } else {
        console.log('  No new relevant references found to save.');
    }
} 