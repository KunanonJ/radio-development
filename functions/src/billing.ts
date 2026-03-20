import Stripe from "stripe";
import type {
  BillingAccount,
  BillingPlan,
  BillingSubscription,
  BillingSubscriptionStatus,
  BillingSummary,
  Station
} from "@the-urban-radio/contracts";
import { ProvisioningError } from "./provisioning";

const getStripeSecretKey = () => {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new ProvisioningError("Stripe is not configured. Add STRIPE_SECRET_KEY.", 503);
  }

  return key;
};

export const getStripeClient = () => new Stripe(getStripeSecretKey());

export const getStripeWebhookSecret = () => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new ProvisioningError("Stripe webhook secret is not configured.", 503);
  }

  return secret;
};

const getEnvUrl = (key: string) => {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new ProvisioningError(`${key} is required for Stripe billing.`, 503);
  }

  return value;
};

export const getCheckoutUrls = (input: { successUrl?: string; cancelUrl?: string }) => ({
  successUrl: input.successUrl?.trim() || getEnvUrl("STRIPE_CHECKOUT_SUCCESS_URL"),
  cancelUrl: input.cancelUrl?.trim() || getEnvUrl("STRIPE_CHECKOUT_CANCEL_URL")
});

export const getBillingPortalReturnUrl = (returnUrl?: string) =>
  returnUrl?.trim() || getEnvUrl("STRIPE_BILLING_PORTAL_RETURN_URL");

export const getStripePriceIdForPlan = (plan: BillingPlan) => {
  const byPlan: Record<BillingPlan, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    growth: process.env.STRIPE_PRICE_GROWTH_MONTHLY,
    broadcast: process.env.STRIPE_PRICE_BROADCAST_MONTHLY
  };

  const priceId = byPlan[plan]?.trim();
  if (!priceId) {
    throw new ProvisioningError(`Stripe price is not configured for the ${plan} plan.`, 503);
  }

  return priceId;
};

export const getPlanFromPriceId = (priceId: string): BillingPlan => {
  const mapping: Array<[BillingPlan, string | undefined]> = [
    ["starter", process.env.STRIPE_PRICE_STARTER_MONTHLY],
    ["growth", process.env.STRIPE_PRICE_GROWTH_MONTHLY],
    ["broadcast", process.env.STRIPE_PRICE_BROADCAST_MONTHLY]
  ];

  const match = mapping.find(([, configuredPriceId]) => configuredPriceId?.trim() === priceId);
  if (!match) {
    throw new ProvisioningError("Unknown Stripe price ID received from webhook.", 400);
  }

  return match[0];
};

export const buildBillingAccount = (args: {
  tenantId: string;
  defaultStationId: string;
  createdBy: string;
  email: string;
  stripeCustomerId?: string;
  now: string;
}): BillingAccount => ({
  id: args.tenantId,
  tenantId: args.tenantId,
  defaultStationId: args.defaultStationId,
  createdBy: args.createdBy,
  email: args.email,
  stripeCustomerId: args.stripeCustomerId,
  createdAt: args.now,
  updatedAt: args.now
});

export const buildBillingSubscription = (args: {
  station: Station;
  now: string;
  status?: BillingSubscriptionStatus;
  stripeCustomerId?: string;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  stripeCheckoutSessionId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}): BillingSubscription => ({
  id: args.station.id,
  tenantId: args.station.tenantId,
  stationId: args.station.id,
  plan: args.station.plan,
  status: args.status ?? "none",
  stripeCustomerId: args.stripeCustomerId,
  stripePriceId: args.stripePriceId,
  stripeSubscriptionId: args.stripeSubscriptionId,
  stripeCheckoutSessionId: args.stripeCheckoutSessionId,
  currentPeriodEnd: args.currentPeriodEnd,
  cancelAtPeriodEnd: args.cancelAtPeriodEnd,
  createdAt: args.now,
  updatedAt: args.now
});

export const buildBillingSummary = (args: {
  station: Station;
  subscription: BillingSubscription | null;
}): BillingSummary => ({
  tenantId: args.station.tenantId,
  stationId: args.station.id,
  plan: args.subscription?.plan ?? args.station.plan,
  status: args.subscription?.status ?? "none",
  stripeCustomerId: args.subscription?.stripeCustomerId,
  stripeSubscriptionId: args.subscription?.stripeSubscriptionId,
  currentPeriodEnd: args.subscription?.currentPeriodEnd,
  cancelAtPeriodEnd: args.subscription?.cancelAtPeriodEnd,
  checkoutReady: true,
  billingPortalReady: Boolean(args.subscription?.stripeCustomerId)
});

export const mapStripeSubscriptionStatus = (
  status: Stripe.Subscription.Status | null | undefined
): BillingSubscriptionStatus => {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "unpaid":
      return "unpaid";
    case "paused":
      return "paused";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    default:
      return "none";
  }
};
