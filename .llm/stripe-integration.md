# Stripe Integration Plan

## Goal
Create Stripe Products and Prices corresponding to the services defined in `src/data/service-data.ts`.

## Decisions

*   **Method**: Use the Stripe API via the `stripe-node` library instead of the Stripe CLI for better integration within the Node.js project.
*   **Data Model**: Added `currency` field to `ServiceItem` interface.
*   **Currency**: Assumed 'eur' for all current services.
*   **Price Unit**: Prices in `ServiceItem` are in main units (e.g., 500); they will be converted to cents (e.g., 50000) when creating Stripe Prices.
*   **Metadata**: Store `service_id` and `service_slug` in Stripe Product/Price metadata for mapping back to the application data.

## Steps & Files

1.  **Modify Data Model (Services)**: Added `currency` to `ServiceItem` interface and service definitions.
    *   `src/data/service-data.ts`
2.  **Create Data Model (Subscriptions)**: Created `SubscriptionItem` interface and `subscriptionList`.
    *   `src/data/subscription-data.ts` (New)
3.  **Create Sync Script**: Develop a Node.js script to iterate through `serviceList` and `subscriptionList`, creating/updating Stripe Products and Prices (one-time and recurring).
    *   `scripts/sync-stripe-products.ts`
4.  **Configure Stripe**: Obtain Stripe API keys (publishable and secret) and site base URL, storing them securely as environment variables.
    *   `.env.local`
5.  **Run Script**: Execute the script to populate Stripe. (Pending)
6.  **Integrate Checkout**: Update components/pages to use Stripe Product/Price IDs for checkout sessions (handling both one-time and subscription checkouts). (Pending)
    *   Relevant components using services/subscriptions (e.g., pricing tables, detail pages).
