# N8N Workflow Design Rules for Experts

## 1. Clarity and Organization

*   **Meaningful Node Names:** Use descriptive names for all nodes reflecting their specific function (e.g., "Get Customer Data from DB", "Filter Inactive Users"). Avoid default names like "HTTP Request1".
*   **Utilize Sticky Notes:** Add Sticky Notes (`n8n-nodes-base.stickyNote`) to explain complex sections, logic choices, or provide context for future reference. Group related nodes visually using large sticky notes behind them.
*   **Logical Flow & Spacing:** Arrange nodes logically (typically left-to-right, top-to-bottom). Ensure adequate spacing between nodes to prevent them from overlapping visually. Use straight connection lines where possible and avoid excessive crossing. Break down very long workflows into smaller, executable sub-workflows using `Execute Workflow` nodes if complexity warrants it.
*   **Color-Coding (Optional):** Use node coloring consistently to denote different stages or types of operations (e.g., green for data sources, blue for transformations, red for outputs/actions).

## 2. Data Handling and Efficiency

*   **Filter Early, Filter Often:** Use `Filter` or `IF` nodes early in the workflow to remove unnecessary items and reduce data processing downstream.
*   **Select Specific Fields:** In nodes that retrieve data (e.g., databases, APIs), explicitly select only the necessary fields instead of fetching everything. Use `Set` or `Code` nodes with "Keep Only Set" mode to prune data objects.
*   **Understand Item Structure:** Be precise about data paths in expressions (`{{ $json.some.nested.value }}`). Use the Expression Editor's preview feature and the node's output view extensively.
*   **Batch Processing:** Use `SplitInBatches` for operations that need to run iteratively but can be grouped (e.g., API calls with rate limits, database inserts). Configure batch size appropriately based on performance and API constraints.
*   **Code Node Judiciously:** Use the `Code` node (`n8n-nodes-base.code`) for complex transformations or logic not easily achievable with standard nodes. Keep the code focused and readable. Prefer built-in nodes when available for maintainability and clarity.
*   **Merge Data Carefully:** Understand the different modes of the `Merge` node (`Append`, `Combine`, `Pass-through`, `Wait`) and choose the appropriate one for the desired data merging behavior. Ensure data structure alignment before merging.

## 3. Expressions

*   **Prefer JSON Notation:** Use dot notation (`$json.field`) or bracket notation (`$json['field-with-hyphens']`) for accessing data.
*   **Leverage Built-in Variables:** Utilize `$now`, `$today`, `$timestamp`, `$workflow.id`, `$execution.id`, etc., where appropriate.
*   **Use Expression Editor:** Take advantage of the built-in expression editor for syntax highlighting, autocompletion, and previewing results.
*   **Keep Expressions Readable:** For very complex logic, consider breaking it down using intermediate `Set` or `Code` nodes instead of creating overly long and unmanageable single expressions.

## 4. Error Handling and Reliability

*   **Configure Node Settings:** Utilize "Settings" > "Continue on Fail" or "Retry on Fail" for nodes prone to intermittent issues (e.g., API calls, external services). Set appropriate retry counts and intervals.
*   **Use `IF` for Conditional Logic:** Branch workflow execution based on expected conditions or potential failure points using `IF` nodes.
*   **Dedicated Error Paths:** For critical workflows, implement specific error paths using the error output (`onError`) of nodes. Log errors to a file, database, or notification service. The `Execute Workflow` node can also be used to trigger a dedicated error-handling workflow.
*   **Test Edge Cases:** Explicitly test scenarios with empty data, invalid inputs, or potential API errors.

## 5. Node Selection and Configuration

*   **Prefer Specific Nodes:** Use dedicated service nodes (e.g., `Supabase`, `Reddit`, `Google Gemini`) over the generic `HTTP Request` node whenever available. They handle authentication and data structure more easily.
*   **Configure Timeouts:** Set reasonable timeout values in nodes involving external requests (HTTP, databases) to prevent workflows from hanging indefinitely.
*   **Understand Operation Modes:** Be familiar with the different operations available within a node (e.g., `getAll`, `create`, `update`, `delete` in database nodes) and select the correct one.

## 6. Credentials

*   **Use Credential Manager:** Always store API keys, passwords, and other secrets using n8n's built-in credential manager. Never hardcode credentials directly in nodes or expressions.
*   **Scope Credentials:** Use specific credentials for specific purposes rather than overly broad ones.

## 7. Enabling User Testing and Debugging

*   **Design for Testability:** Build workflows incrementally, ensuring each section can be tested independently if possible. Consider adding temporary `Set` nodes or disabling downstream nodes to isolate sections for testing.
*   **Provide Clear Test Instructions:** Use Sticky Notes within the workflow canvas to guide the user on how to test specific parts, what input data to use (if applicable), and what output to expect.
*   **Prepare Realistic Test Data:** If the workflow requires specific input, provide example data using a disabled `Set` node or in documentation. This data should cover common scenarios and potential edge cases.
*   **Utilize Manual Triggers:** For workflows not triggered by webhooks or schedules, ensure a `Manual Trigger` (`n8n-nodes-base.manualTrigger`) is present and clearly configured for easy user execution during testing.
*   **Guide User on Execution Log:** Add a Sticky Note explaining the importance of the Execution Log for debugging, advising the user to check node inputs/outputs and error messages there if the workflow doesn't behave as expected.
*   **Simplify Debugging Views:** Where complex data structures are involved, consider adding intermediate `Set` nodes (potentially disabled by default) that simplify or extract key information, making it easier for the user to verify data flow in the execution log.

## 8. Versioning (External)

*   **Export Workflows:** Regularly export workflow JSON definitions.
*   **Use Version Control:** Store exported workflow JSON files in a version control system like Git to track changes, collaborate, and revert if necessary.
