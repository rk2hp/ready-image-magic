import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/layout";
import { useCart } from "@/lib/cart";
import { createOrder, orderInputSchema } from "@/lib/orders.functions";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Twispp" },
      { name: "description", content: "Send your Twispp order request. We confirm every order personally on WhatsApp." },
      { property: "og:title", content: "Checkout — Twispp" },
      { property: "og:description", content: "Request your handmade Twispp flowers." },
    ],
  }),
  component: CheckoutPage,
});

const field =
  "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary";

function Field({ label, name, error, children }: { label: string; name: string; error?: string | undefined; children?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <div className="mt-2">{children ?? <input name={name} className={field} />}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(createOrder);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const payload = {
      ...fd,
      items: lines.map((l) => ({ slug: l.slug, name: l.name, price: l.price, quantity: l.quantity })),
    };
    const parsed = orderInputSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      toast.error("Please check the highlighted fields");
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const res = await submit({ data: parsed.data });
      clear();
      navigate({ to: "/order/$id", params: { id: res.id } });
    } catch {
      toast.error("We couldn't send your order. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <SiteLayout>
        <div className="py-32 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" search={{}} className="mt-6 inline-block rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground">
            Browse the collection
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-8">
        <h1 className="display text-[clamp(2.4rem,7vw,4.5rem)] text-primary">Almost yours</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          No payment now. Send your request and we'll confirm the details and delivery with you on WhatsApp.
        </p>
        <form onSubmit={onSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Full name *" name="customer_name" error={errors["customer_name"]} /></div>
            <Field label="WhatsApp number *" name="whatsapp" error={errors["whatsapp"]} />
            <Field label="Phone (optional)" name="phone" error={errors["phone"]} />
            <div className="sm:col-span-2"><Field label="Email (optional)" name="email" error={errors["email"]} /></div>
            <div className="sm:col-span-2">
              <Field label="Delivery address *" name="address" error={errors["address"]}>
                <textarea name="address" rows={3} className={field} />
              </Field>
            </div>
            <Field label="City *" name="city" error={errors["city"]} />
            <Field label="State *" name="state" error={errors["state"]} />
            <Field label="Pincode *" name="pincode" error={errors["pincode"]} />
            <Field label="Occasion" name="occasion" />
            <Field label="Preferred date" name="preferred_delivery_date">
              <input type="date" name="preferred_delivery_date" className={field} />
            </Field>
            <Field label="Preferred time" name="preferred_delivery_time">
              <select name="preferred_delivery_time" className={field} defaultValue="">
                <option value="">Any time</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Gift message" name="gift_message" error={errors["gift_message"]}>
                <textarea name="gift_message" rows={2} maxLength={400} className={field} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Anything else?" name="additional_notes" error={errors["additional_notes"]}>
                <textarea name="additional_notes" rows={2} maxLength={600} className={field} />
              </Field>
            </div>
          </div>

          <aside className="h-fit rounded-sm bg-secondary p-6">
            <h2 className="display text-2xl">Your order</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {lines.map((l) => (
                <li key={l.slug} className="flex justify-between gap-3">
                  <span>{l.name} × {l.quantity}</span>
                  <span>{formatINR(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>To be confirmed</span></div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send order request"}
            </button>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}
