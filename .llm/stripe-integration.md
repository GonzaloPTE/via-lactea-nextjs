# Stripe Integration Plan

## Goal
Create Stripe Products and Prices corresponding to the services and subscriptions defined in `src/data/service-data.ts` and `src/data/subscription-data.ts`.

## Decisions

*   **Method**: Use the Stripe API via the `stripe-node` library.
*   **Data Structure**: Separate data for one-time Services (`ServiceItem` in `service-data.ts`) and recurring Subscriptions (`SubscriptionItem` in `subscription-data.ts`).
*   **Data Model**: Added `currency` field to `ServiceItem`.
*   **Currency**: Assumed 'eur' for all current services/subscriptions.
*   **Price Unit**: Convert prices from main units (e.g., 500) to cents (e.g., 50000) for Stripe API.
*   **Metadata**: Store relevant IDs, slugs, and other useful fields (category, duration, interval, highlighted, etc.) in Stripe Product/Price metadata.
*   **Product Images**: Sync `heroImageUrl` to Stripe Product `images` field, using `SITE_BASE_URL` environment variable.
*   **Free Services**: Skip creating Stripe Product/Price entirely for services with price <= 0.
*   **Sync Script Location**: Place sync script inside `src/scripts/` for better path resolution.
*   **Sync Script Execution**: Use `tsx` executor via an `npm script` (`sync:stripe`) for robust execution.
*   **Refactoring**: Refactored product and price sync logic into generic functions (`syncStripeItemProduct`, `syncStripeItemPrice`) for better maintainability.

## Steps & Files

1.  **Modify Data Model (Services)**: Added `currency` to `ServiceItem` interface and service definitions. [COMPLETED]
    *   `src/data/service-data.ts`
2.  **Create Data Model (Subscriptions)**: Created `SubscriptionItem` interface and `subscriptionList`. [COMPLETED]
    *   `src/data/subscription-data.ts` (New)
3.  **Create Sync Script**: Developed Node.js script (`tsx`) to iterate through `serviceList` and `subscriptionList`, creating/updating Stripe Products and Prices (one-time and recurring) idempotently, including metadata and images. [COMPLETED]
    *   `src/scripts/sync-stripe-products.ts` (Moved)
4.  **Configure Stripe & Environment**: Obtained Stripe Test API key and site base URL, storing them securely as environment variables. Added `tsx` dependency. Created `npm script` for execution. [COMPLETED]
    *   `.env.local`
    *   `package.json`
    *   `tsconfig.json` (Briefly modified, then reverted)
5.  **Run Script**: Executed the script (`npm run sync:stripe`) to populate Stripe Test environment. [COMPLETED]
6.  **Integrate Checkout**: Update components/pages to use Stripe Product/Price IDs for checkout sessions (handling both one-time and subscription checkouts). (Pending)
    *   Relevant components using services/subscriptions (e.g., pricing tables, detail pages).
