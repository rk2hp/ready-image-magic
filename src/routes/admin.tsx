import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { listOrders, updateOrderStatus, ORDER_STATUSES, statusLabels, type OrderStatus } from "@/lib/orders.functions";
import { claimOwnerIfNone } from "@/lib/owner.functions";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Owner dashboard — Twispp" },
      { name: "description", content: "Manage Twispp order requests." },
      { property: "og:title", content: "Owner dashboard — Twispp" },
      { property: "og:description", content: "Private dashboard for Twispp orders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const input = "w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary";

function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Shell><p className="text-muted-foreground">Loading…</p></Shell>;
  if (!session) return <Shell><SignIn /></Shell>;
  return <Shell><Dashboard email={session.user.email ?? ""} /></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link to="/" className="display text-2xl text-primary">Twispp</Link>
        <span className="eyebrow text-muted-foreground">Owner dashboard</span>
      </header>
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">{children}</div>
    </div>
  );
}

function SignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (mode === "up") toast("Check your email to confirm your account.");
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="display text-4xl text-primary">{mode === "in" ? "Welcome back" : "Create owner account"}</h1>
      <button
        type="button"
        onClick={async () => {
          const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/admin` });
          if (r.error) toast.error("Google sign-in failed");
        }}
        className="mt-8 w-full rounded-full border border-primary px-6 py-3 text-xs uppercase tracking-[0.16em] text-primary"
      >
        Continue with Google
      </button>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={busy} className="w-full rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60">
          {mode === "in" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-muted-foreground link-underline">
        {mode === "in" ? "First time? Create the owner account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

type Item = { name: string; quantity: number };

function Dashboard({ email }: { email: string }) {
  const qc = useQueryClient();
  const fetchOrders = useServerFn(listOrders);
  const claim = useServerFn(claimOwnerIfNone);
  const setStatus = useServerFn(updateOrderStatus);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const { data, error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      await claim();
      return fetchOrders();
    },
    retry: false,
  });

  const mut = useMutation({
    mutationFn: (v: { id: string; status: OrderStatus }) => setStatus({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); toast("Status updated"); },
    onError: () => toast.error("Couldn't update status"),
  });

  const orders = (data ?? []).filter((o) => filter === "all" || o.status === filter);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-primary">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <div className="flex gap-3">
          <select className="rounded-sm border border-input bg-background px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | "all")}>
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
          <button onClick={() => supabase.auth.signOut()} className="rounded-full border border-input px-4 py-2 text-xs uppercase tracking-[0.14em]">Sign out</button>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-10 text-muted-foreground">Loading orders…</p>
      ) : error ? (
        <p className="mt-10 text-destructive">{(error as Error).message}</p>
      ) : orders.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o) => {
            const wa = o.whatsapp.replace(/\D/g, "").replace(/^(?!91)(\d{10})$/, "91$1");
            return (
              <div key={o.id} className="rounded-sm border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-muted-foreground">{o.order_id} · {new Date(o.created_at).toLocaleString("en-IN")}</p>
                    <p className="display mt-1 text-2xl">{o.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{o.address}, {o.city}, {o.state} {o.pincode}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="rounded-full bg-botanical px-4 py-2 text-xs uppercase tracking-[0.14em] text-primary-foreground">WhatsApp</a>
                    <select
                      className="rounded-sm border border-input bg-background px-3 py-2 text-sm"
                      value={o.status}
                      onChange={(e) => mut.mutate({ id: o.id, status: e.target.value as OrderStatus })}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <p>{(o.items as Item[]).map((i) => `${i.name} × ${i.quantity}`).join(", ")}</p>
                  <p className="sm:text-right font-medium">{formatINR(Number(o.total))}</p>
                  {(o.preferred_delivery_date || o.preferred_delivery_time) && <p className="text-muted-foreground">Delivery: {o.preferred_delivery_date} {o.preferred_delivery_time}</p>}
                  {o.occasion && <p className="text-muted-foreground">Occasion: {o.occasion}</p>}
                  {o.gift_message && <p className="sm:col-span-2 italic">"{o.gift_message}"</p>}
                  {o.additional_notes && <p className="sm:col-span-2 text-muted-foreground">Notes: {o.additional_notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
