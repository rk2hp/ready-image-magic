import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ORDER_STATUSES = [
  "pending_confirmation",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const statusLabels: Record<OrderStatus, string> = {
  pending_confirmation: "Order Request Received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const itemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1),
});

export const orderInputSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your full name"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid Indian mobile number")
    .or(z.literal(""))
    .optional(),
  address: z.string().trim().min(6, "Please enter the full delivery address"),
  city: z.string().trim().min(2, "Please enter the city"),
  state: z.string().trim().min(2, "Please enter the state"),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode"),
  preferred_delivery_date: z.string().optional(),
  preferred_delivery_time: z.string().optional(),
  occasion: z.string().optional(),
  gift_message: z.string().max(400).optional(),
  additional_notes: z.string().max(600).optional(),
  items: z.array(itemSchema).min(1, "Your cart is empty"),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const subtotal = data.items.reduce((n, i) => n + i.price * i.quantity, 0);
    const deliveryFee = 0;
    const orderId = "TW-" + Math.floor(1000 + Math.random() * 9000);

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_id: orderId,
        customer_name: data.customer_name,
        email: data.email || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        preferred_delivery_date: data.preferred_delivery_date || null,
        preferred_delivery_time: data.preferred_delivery_time || null,
        occasion: data.occasion || null,
        gift_message: data.gift_message || null,
        additional_notes: data.additional_notes || null,
        items: data.items,
        subtotal,
        delivery_fee: deliveryFee,
        total: subtotal + deliveryFee,
        status: "pending_confirmation",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id as string, order_id: row.order_id as string };
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("You don't have access to the Twispp dashboard.");
}

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(ORDER_STATUSES) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
