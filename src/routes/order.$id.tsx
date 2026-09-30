import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout } from "@/components/site/layout";
import { getOrder, statusLabels, type OrderStatus } from "@/lib/orders.functions";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Your order request — Twispp" },
      { name: "description", content: "Your Twispp order request has been received." },
      { property: "og:title", content: "Your order request — Twispp" },
      { property: "og:description", content: "We'll confirm your handmade order on WhatsApp." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

type Item = { name: string; price: number; quantity: number };

function OrderPage() {
  const { id } = Route.useParams();
  const fetchOrder = useServerFn(getOrder);
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder({ data: { id } }),
  });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[760px] px-4 py-16 sm:px-8">
        {isLoading ? (
          <p className="text-muted-foreground">Loading your order…</p>
        ) : !order ? (
          <p className="text-muted-foreground">We couldn't find this order.</p>
        ) : (
          <>
            <p className="eyebrow text-muted-foreground">Order {order.order_id}</p>
            <h1 className="display mt-3 text-[clamp(2.4rem,7vw,4rem)] text-primary">Thank you, {order.customer_name.split(" ")[0]} ♡</h1>
            <p className="mt-4 text-muted-foreground">
              We've received your request. We'll message you on WhatsApp at {order.whatsapp} to confirm the details and delivery.
            </p>
            <div className="mt-8 inline-block rounded-full bg-butter px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-plum">
              {statusLabels[order.status as OrderStatus] ?? order.status}
            </div>
            <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
              {(order.items as Item[]).map((i, n) => (
                <li key={n} className="flex justify-between"><span>{i.name} × {i.quantity}</span><span>{formatINR(i.price * i.quantity)}</span></li>
              ))}
              <li className="flex justify-between border-t border-border pt-3 font-medium"><span>Estimated total</span><span>{formatINR(Number(order.total))}</span></li>
            </ul>
            <Link to="/shop" search={{}} className="mt-10 inline-block rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-primary-foreground">
              Keep browsing
            </Link>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
