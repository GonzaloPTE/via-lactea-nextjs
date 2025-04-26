import Stripe from 'stripe';
import { serviceList, ServiceItem } from '../src/data/service-data';
import { subscriptionList, SubscriptionItem } from '../src/data/subscription-data';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// --- Configuration ---
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_BASE_URL = process.env.SITE_BASE_URL;

if (!STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY environment variable not set.');
  process.exit(1);
}

if (!SITE_BASE_URL) {
  console.warn('Warning: SITE_BASE_URL environment variable not set. Product images will not be synced.');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil', // Use the API version expected by the installed library
  typescript: true,
});

// --- Helper Functions ---

/**
 * Converts a price in main currency units (e.g., euros) to the smallest unit (e.g., cents).
 */
const toCents = (amount: number): number => Math.round(amount * 100);

/**
 * Creates or updates a Stripe Product based on a ServiceItem or SubscriptionItem.
 */
const syncStripeItemProduct = async (
  item: ServiceItem | SubscriptionItem,
  type: 'service' | 'subscription'
): Promise<Stripe.Product> => {
  const productName = item.title;
  const heroImageUrl = 'heroImageUrl' in item ? item.heroImageUrl : undefined;

  // Construct absolute image URL
  const imageUrls = (SITE_BASE_URL && heroImageUrl)
    ? [new URL(heroImageUrl, SITE_BASE_URL).toString()]
    : [];

  // Determine metadata and search query based on type
  let metadata: Stripe.MetadataParam = {};
  let searchQuery = '';
  if (type === 'service') {
    metadata = {
      service_id: item.id.toString(),
      service_slug: item.slug,
      category: (item as ServiceItem).category,
      categoryLabel: (item as ServiceItem).categoryLabel,
      duration: (item as ServiceItem).duration,
      highlighted: (item as ServiceItem).highlighted?.toString() ?? 'false',
      requiresCalendly: (item as ServiceItem).requiresCalendly?.toString() ?? 'false',
    };
    searchQuery = `metadata['service_slug']:'${item.slug}'`;
  } else { // type === 'subscription'
    metadata = {
      subscription_id: item.id.toString(),
      subscription_slug: item.slug,
      interval: (item as SubscriptionItem).interval,
    };
    searchQuery = `metadata['subscription_slug']:'${item.slug}'`;
  }

  // Check if product with this slug already exists
  const existingProducts = await stripe.products.search({ query: searchQuery });

  const productPayload = {
    name: productName,
    description: item.description,
    metadata: metadata,
    images: imageUrls,
  };

  if (existingProducts.data.length > 0) {
    // Product exists, update it
    const productId = existingProducts.data[0].id;
    console.log(`Updating existing ${type} product: ${productName} (ID: ${productId})`);
    const updatedProduct = await stripe.products.update(productId, productPayload);
    return updatedProduct;
  } else {
    // Product doesn't exist, create it
    console.log(`Creating new ${type} product: ${productName}`);
    const newProduct = await stripe.products.create(productPayload);
    return newProduct;
  }
};

/**
 * Creates a Stripe Price for a given Product, handling both one-time and recurring.
 */
const syncStripeItemPrice = async (
  product: Stripe.Product,
  item: ServiceItem | SubscriptionItem,
  type: 'service' | 'subscription'
): Promise<Stripe.Price | null> => {
  const unitAmount = toCents(item.price);
  const currency = item.currency.toLowerCase();
  const isSubscription = type === 'subscription';

  // Skip price creation for free items (relevant for services)
  if (!isSubscription && unitAmount <= 0) {
    console.log(`Skipping price creation for free service: ${item.title}`);
    return null;
  }

  // Define recurring parameters if it's a subscription
  const recurringParams = isSubscription ? { recurring: { interval: (item as SubscriptionItem).interval } } : {};

  // Define metadata based on type
  let metadata: Stripe.MetadataParam = {};
  if (type === 'service') {
    metadata = {
      service_id: item.id.toString(),
      service_slug: item.slug,
    };
  } else { // type === 'subscription'
    metadata = {
      subscription_id: item.id.toString(),
      subscription_slug: item.slug,
    };
  }

  // Check if an active price already exists for this configuration
  const existingPrices = await stripe.prices.list({
    product: product.id,
    currency: currency,
    active: true,
    ...(isSubscription && recurringParams), // Only include recurring check for subscriptions
    limit: 1,
  });

  if (existingPrices.data.length > 0) {
    const existingPrice = existingPrices.data[0];
    if (existingPrice.unit_amount === unitAmount) {
      const intervalText = isSubscription ? `/${(item as SubscriptionItem).interval}` : '';
      console.log(`Active ${type} price for ${product.name} (${currency}${intervalText}) already exists and matches: ${existingPrice.id}`);
      return existingPrice;
    } else {
      console.log(`Archiving existing ${type} price ${existingPrice.id} for ${product.name} as amount differs.`);
      await stripe.prices.update(existingPrice.id, { active: false });
    }
  }

  // Create a new price
  const intervalText = isSubscription ? `/${(item as SubscriptionItem).interval}` : '';
  console.log(`Creating new ${type} price for ${product.name} (${currency}: ${unitAmount}${intervalText})`);

  const pricePayload: Stripe.PriceCreateParams = {
    product: product.id,
    unit_amount: unitAmount,
    currency: currency,
    active: true,
    ...(isSubscription && recurringParams), // Add recurring only for subscriptions
    metadata: metadata,
  };

  const newPrice = await stripe.prices.create(pricePayload);
  return newPrice;
};

// --- Main Synchronization Logic ---
const syncAllData = async () => {
  console.log('Starting Stripe data synchronization...');

  // --- Sync Services (One-Time Payments) ---
  console.log('\n--- Syncing Services ---');
  for (const service of serviceList) {
    console.log(`\nProcessing service: ${service.title} (ID: ${service.id})`);
    // Skip creating Stripe Product/Price entirely for free services
    if (service.price <= 0) {
      console.log(`Skipping Stripe sync for free service: ${service.title}`);
      continue;
    }
    try {
      const product = await syncStripeItemProduct(service, 'service');
      if (product) {
        await syncStripeItemPrice(product, service, 'service'); // Use generic price function
      }
    } catch (error) {
      console.error(`Error processing service ${service.title}:`, error);
    }
  }

  // --- Sync Subscriptions (Recurring Payments) ---
  console.log('\n--- Syncing Subscriptions ---');
  for (const subscription of subscriptionList) {
    console.log(`\nProcessing subscription: ${subscription.title} (ID: ${subscription.id})`);
    try {
      const product = await syncStripeItemProduct(subscription, 'subscription');
      if (product) {
        await syncStripeItemPrice(product, subscription, 'subscription'); // Use generic price function
      }
    } catch (error) {
      console.error(`Error processing subscription ${subscription.title}:`, error);
    }
  }

  console.log('\nSynchronization complete.');
};

// --- Run the script ---
syncAllData(); 