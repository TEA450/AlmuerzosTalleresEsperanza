export interface Person {
  id: string;
  name: string;
  photo: string;
  category: 'student' | 'teacher';
  created_at: string;
}

export interface Order {
  id: string;
  person_id: string;
  person_name: string;
  person_photo: string;
  fruit_or_soup: 'fruit' | 'soup' | null;
  juice_or_lemonade: 'juice' | 'lemonade' | null;
  main_dish: 'spaghetti' | 'beef' | 'chicken' | null;
  observations: string;
  payment_method: 'cash' | 'voucher';
  order_date: string;
  created_at: string;
}

export interface DailyReport {
  id: string;
  report_date: string;
  total_orders: number;
  cash_orders: number;
  voucher_orders: number;
  created_at: string;
}