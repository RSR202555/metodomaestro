export interface CouponData {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at?: string | null;
}

export const IN_MEMORY_COUPONS: CouponData[] = [
  {
    id: "c1",
    code: "MAESTRO50",
    discount_type: "percentage",
    discount_value: 50.0,
    max_uses: null,
    used_count: 0,
    active: true,
    expires_at: null,
  },
  {
    id: "c2",
    code: "VIP20",
    discount_type: "percentage",
    discount_value: 20.0,
    max_uses: 100,
    used_count: 0,
    active: true,
    expires_at: null,
  },
  {
    id: "c3",
    code: "METODO50",
    discount_type: "fixed",
    discount_value: 50.0,
    max_uses: null,
    used_count: 0,
    active: true,
    expires_at: null,
  },
];
