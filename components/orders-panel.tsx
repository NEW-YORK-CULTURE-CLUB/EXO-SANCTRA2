'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Package, Truck, CheckCircle2, Clock, XCircle, ChevronDown } from 'lucide-react';

type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  title: string;
  type: 'original' | 'print';
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string | null;
  stripeSessionId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATUS_CONFIG: Record<FulfillmentStatus, { label: string; color: string; Icon: any }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',   Icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-400   bg-blue-400/10   border-blue-400/30',     Icon: Package },
  shipped:    { label: 'Shipped',    color: 'text-purple-400 bg-purple-400/10 border-purple-400/30',   Icon: Truck },
  delivered:  { label: 'Delivered',  color: 'text-green-400  bg-green-400/10  border-green-400/30',    Icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  color: 'text-red-400    bg-red-400/10    border-red-400/30',      Icon: XCircle },
};

const ALL_STATUSES: FulfillmentStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FulfillmentStatus | 'all'>('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, fulfillmentStatus: FulfillmentStatus) => {
    setUpdatingId(orderId);
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, fulfillmentStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.fulfillmentStatus === filter);

  const counts = orders.reduce(
    (acc, o) => {
      acc[o.fulfillmentStatus] = (acc[o.fulfillmentStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-xs text-muted-foreground">{orders.length} total orders</p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            filter === 'all'
              ? 'bg-foreground text-background border-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          All ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => {
          const { label, color, Icon } = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filter === s ? color : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label} {counts[s] ? `(${counts[s]})` : ''}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {filter === 'all' ? 'No orders yet.' : `No ${filter} orders.`}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const cfg = STATUS_CONFIG[order.fulfillmentStatus] ?? STATUS_CONFIG.pending;
            const StatusIcon = cfg.Icon;
            return (
              <motion.div
                key={order.id}
                className="rounded-xl border bg-card p-4 space-y-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{order.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.type} · ${((order.amount ?? 0) / 100).toLocaleString()}</p>
                    {order.customerName && (
                      <p className="text-xs text-muted-foreground mt-0.5">{order.customerName} · {order.customerEmail}</p>
                    )}
                    {order.shippingAddress && (
                      <p className="text-xs text-muted-foreground">
                        {[order.shippingAddress.line1, order.shippingAddress.city, order.shippingAddress.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {order.createdAt && (
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>

                  {/* Status badge + dropdown */}
                  <div className="relative flex-shrink-0">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </div>
                  </div>
                </div>

                {/* Move to dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Move to:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STATUSES.filter((s) => s !== order.fulfillmentStatus).map((s) => {
                      const sc = STATUS_CONFIG[s];
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => updateStatus(order.id, s)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors hover:opacity-80 disabled:opacity-40 ${sc.color}`}
                        >
                          <sc.Icon className="w-3 h-3" />
                          {sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
