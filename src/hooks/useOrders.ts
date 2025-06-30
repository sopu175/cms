import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';

interface UseOrdersOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { status, limit = 10, offset = 0 } = options;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('orders')
        .select(`
          *,
          user:profiles(username, email),
          order_items(
            id,
            quantity,
            unit_price,
            product:products(name, images),
            variation:product_variations(sku, options)
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // If no orders exist, create demo orders
      if (data && data.length === 0) {
        await createDemoOrders();
        return fetchOrders(); // Refetch after creating demo orders
      }

      setOrders(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createDemoOrders = async () => {
    try {
      // Get a user ID (admin user)
      const { data: adminUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .single();
      
      const userId = adminUser?.id;
      
      if (!userId) return;
      
      // Get some products
      const { data: products } = await supabase
        .from('products')
        .select('id, price, name')
        .limit(2);
      
      if (!products || products.length === 0) return;
      
      // Create demo orders
      const demoOrders = [
        {
          user_id: userId,
          order_number: `ORD-${Date.now()}-1`,
          status: 'delivered',
          items: [
            {
              product_id: products[0].id,
              quantity: 1,
              unit_price: products[0].price,
              product: { name: products[0].name }
            }
          ],
          shipping_info: {
            name: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            postal_code: '10001',
            country: 'USA',
            phone: '+1234567890'
          },
          total_amount: products[0].price,
          payment_status: 'paid'
        },
        {
          user_id: userId,
          order_number: `ORD-${Date.now()}-2`,
          status: 'pending',
          items: [
            {
              product_id: products[1].id,
              quantity: 2,
              unit_price: products[1].price,
              product: { name: products[1].name }
            }
          ],
          shipping_info: {
            name: 'Jane Smith',
            address: '456 Oak Ave',
            city: 'Los Angeles',
            postal_code: '90001',
            country: 'USA',
            phone: '+1987654321'
          },
          total_amount: products[1].price * 2,
          payment_status: 'pending'
        }
      ];
      
      // Insert demo orders
      for (const order of demoOrders) {
        await supabase.from('orders').insert([order]);
      }
      
      console.log('Demo orders created');
    } catch (error) {
      console.error('Error creating demo orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, limit, offset]);

  const updateOrderStatus = async (id: string, newStatus: string, newPaymentStatus?: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newPaymentStatus) {
        updates.payment_status = newPaymentStatus;
      }
      
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchOrders();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update order status' };
    }
  };

  return {
    orders,
    loading,
    error,
    total,
    updateOrderStatus,
    refetch: fetchOrders
  };
};