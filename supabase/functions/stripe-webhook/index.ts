
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? ""
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    console.log("Webhook event type:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed:", session.id);
        
        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
          
          const priceId = subscription.items.data[0].price.id;
          let subscriptionTier = "basic";
          
          if (priceId === "price_1RiLvhA9A1JeVB2Hp83Sq4z3") {
            subscriptionTier = "premium";
          } else if (priceId === "price_1RiLxSA9A1JeVB2H5g6cC4u7") {
            subscriptionTier = "premium_annual";
          }

          await supabaseClient.from("subscribers").upsert({
            email: customer.email!,
            user_id: session.metadata?.user_id,
            stripe_customer_id: customer.id,
            subscribed: true,
            subscription_tier: subscriptionTier,
            subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
            price_id: priceId,
            subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        
        const isActive = subscription.status === "active";
        const priceId = subscription.items.data[0]?.price.id;
        let subscriptionTier = "basic";
        
        if (isActive && priceId === "price_1RiLvhA9A1JeVB2Hp83Sq4z3") {
          subscriptionTier = "premium";
        } else if (isActive && priceId === "price_1RiLxSA9A1JeVB2H5g6cC4u7") {
          subscriptionTier = "premium_annual";
        }

        await supabaseClient.from("subscribers").upsert({
          email: customer.email!,
          stripe_customer_id: customer.id,
          subscribed: isActive,
          subscription_tier: subscriptionTier,
          subscription_end: isActive ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          price_id: isActive ? priceId : null,
          subscription_id: isActive ? subscription.id : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
