export interface Transaction {
  id: string;
  age: number;
  gender: string;
  itemPurchased: string;
  category: string;
  revenue: number; // Purchase Amount (USD)
  expenses: number; // Calculated
  profit: number; // Calculated
  location: string;
  size: string;
  color: string;
  season: string;
  reviewRating: number;
  subscriptionStatus: string;
  shippingType: string;
  discountApplied: string;
  promoCodeUsed: string;
  previousPurchases: number;
  paymentMethod: string;
  frequencyOfPurchases: string;
  date: string; // Synthesized for time-series charts
  customerCount: number; // Always 1 for individual transactions
}

// Helper to generate a random date in 2025
const getRandomDate = () => {
  const start = new Date('2025-01-01').getTime();
  const end = new Date('2025-12-31').getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.toISOString().split('T')[0];
};

const rawData = [
  { id: "1", age: 55, gender: "Male", item: "Blouse", category: "Clothing", amount: 53, location: "Kentucky", size: "L", color: "Gray", season: "Winter", rating: 3.1, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 14, payment: "Venmo", frequency: "Fortnightly" },
  { id: "2", age: 19, gender: "Male", item: "Sweater", category: "Clothing", amount: 64, location: "Maine", size: "L", color: "Maroon", season: "Winter", rating: 3.1, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 2, payment: "Cash", frequency: "Fortnightly" },
  { id: "3", age: 50, gender: "Male", item: "Jeans", category: "Clothing", amount: 73, location: "Massachusetts", size: "S", color: "Maroon", season: "Spring", rating: 3.1, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 23, payment: "Credit Card", frequency: "Weekly" },
  { id: "4", age: 21, gender: "Male", item: "Sandals", category: "Footwear", amount: 90, location: "Rhode Island", size: "M", color: "Maroon", season: "Spring", rating: 3.5, subscription: "Yes", shipping: "Next Day Air", discount: "Yes", promo: "Yes", prevPurchases: 49, payment: "PayPal", frequency: "Weekly" },
  { id: "5", age: 45, gender: "Male", item: "Blouse", category: "Clothing", amount: 49, location: "Oregon", size: "M", color: "Turquoise", season: "Spring", rating: 2.7, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 31, payment: "PayPal", frequency: "Annually" },
  { id: "6", age: 46, gender: "Male", item: "Sneakers", category: "Footwear", amount: 20, location: "Wyoming", size: "M", color: "White", season: "Summer", rating: 2.9, subscription: "Yes", shipping: "Standard", discount: "Yes", promo: "Yes", prevPurchases: 14, payment: "Venmo", frequency: "Weekly" },
  { id: "7", age: 63, gender: "Male", item: "Shirt", category: "Clothing", amount: 85, location: "Montana", size: "M", color: "Gray", season: "Fall", rating: 3.2, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 49, payment: "Cash", frequency: "Quarterly" },
  { id: "8", age: 27, gender: "Male", item: "Shorts", category: "Clothing", amount: 34, location: "Louisiana", size: "L", color: "Charcoal", season: "Winter", rating: 3.2, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 19, payment: "Credit Card", frequency: "Weekly" },
  { id: "9", age: 26, gender: "Male", item: "Coat", category: "Outerwear", amount: 97, location: "West Virginia", size: "L", color: "Silver", season: "Summer", rating: 2.6, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 8, payment: "Venmo", frequency: "Annually" },
  { id: "10", age: 57, gender: "Male", item: "Handbag", category: "Accessories", amount: 31, location: "Missouri", size: "M", color: "Pink", season: "Spring", rating: 4.8, subscription: "Yes", shipping: "2-Day Shipping", discount: "Yes", promo: "Yes", prevPurchases: 4, payment: "Cash", frequency: "Quarterly" },
  { id: "11", age: 53, gender: "Male", item: "Shoes", category: "Footwear", amount: 34, location: "Arkansas", size: "L", color: "Purple", season: "Fall", rating: 4.1, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 26, payment: "Bank Transfer", frequency: "Bi-Weekly" },
  { id: "12", age: 30, gender: "Male", item: "Shorts", category: "Clothing", amount: 68, location: "Hawaii", size: "S", color: "Olive", season: "Winter", rating: 4.9, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 10, payment: "Bank Transfer", frequency: "Fortnightly" },
  { id: "13", age: 61, gender: "Male", item: "Coat", category: "Outerwear", amount: 72, location: "Delaware", size: "M", color: "Gold", season: "Winter", rating: 4.5, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 37, payment: "Venmo", frequency: "Fortnightly" },
  { id: "14", age: 65, gender: "Male", item: "Dress", category: "Clothing", amount: 51, location: "New Hampshire", size: "M", color: "Violet", season: "Spring", rating: 4.7, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 31, payment: "PayPal", frequency: "Weekly" },
  { id: "15", age: 64, gender: "Male", item: "Coat", category: "Outerwear", amount: 53, location: "New York", size: "L", color: "Teal", season: "Winter", rating: 4.7, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 34, payment: "Debit Card", frequency: "Weekly" },
  { id: "16", age: 64, gender: "Male", item: "Skirt", category: "Clothing", amount: 81, location: "Rhode Island", size: "M", color: "Teal", season: "Winter", rating: 2.8, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 8, payment: "PayPal", frequency: "Monthly" },
  { id: "17", age: 25, gender: "Male", item: "Sunglasses", category: "Accessories", amount: 36, location: "Alabama", size: "S", color: "Gray", season: "Spring", rating: 4.1, subscription: "Yes", shipping: "Next Day Air", discount: "Yes", promo: "Yes", prevPurchases: 44, payment: "Debit Card", frequency: "Bi-Weekly" },
  { id: "18", age: 53, gender: "Male", item: "Dress", category: "Clothing", amount: 38, location: "Mississippi", size: "XL", color: "Lavender", season: "Winter", rating: 4.7, subscription: "Yes", shipping: "2-Day Shipping", discount: "Yes", promo: "Yes", prevPurchases: 36, payment: "Venmo", frequency: "Quarterly" },
  { id: "19", age: 52, gender: "Male", item: "Sweater", category: "Clothing", amount: 48, location: "Montana", size: "S", color: "Black", season: "Summer", rating: 4.6, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 17, payment: "Cash", frequency: "Weekly" },
  { id: "20", age: 66, gender: "Male", item: "Pants", category: "Clothing", amount: 90, location: "Rhode Island", size: "M", color: "Green", season: "Summer", rating: 3.3, subscription: "Yes", shipping: "Standard", discount: "Yes", promo: "Yes", prevPurchases: 46, payment: "Debit Card", frequency: "Bi-Weekly" },
  { id: "21", age: 21, gender: "Male", item: "Pants", category: "Clothing", amount: 51, location: "Louisiana", size: "M", color: "Black", season: "Winter", rating: 2.8, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 50, payment: "Cash", frequency: "Every 3 Months" },
  { id: "22", age: 31, gender: "Male", item: "Pants", category: "Clothing", amount: 62, location: "North Carolina", size: "M", color: "Charcoal", season: "Winter", rating: 4.1, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 22, payment: "Debit Card", frequency: "Quarterly" },
  { id: "23", age: 56, gender: "Male", item: "Pants", category: "Clothing", amount: 37, location: "California", size: "M", color: "Peach", season: "Summer", rating: 3.2, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 32, payment: "Debit Card", frequency: "Annually" },
  { id: "24", age: 31, gender: "Male", item: "Pants", category: "Clothing", amount: 88, location: "Oklahoma", size: "XL", color: "White", season: "Winter", rating: 4.4, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 40, payment: "Credit Card", frequency: "Weekly" },
  { id: "25", age: 18, gender: "Male", item: "Jacket", category: "Outerwear", amount: 22, location: "Florida", size: "M", color: "Green", season: "Fall", rating: 2.9, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 16, payment: "Debit Card", frequency: "Weekly" },
  { id: "26", age: 18, gender: "Male", item: "Hoodie", category: "Clothing", amount: 25, location: "Texas", size: "M", color: "Silver", season: "Summer", rating: 3.6, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 14, payment: "PayPal", frequency: "Annually" },
  { id: "27", age: 38, gender: "Male", item: "Jewelry", category: "Accessories", amount: 20, location: "Nevada", size: "M", color: "Red", season: "Spring", rating: 3.6, subscription: "Yes", shipping: "Next Day Air", discount: "Yes", promo: "Yes", prevPurchases: 13, payment: "Credit Card", frequency: "Annually" },
  { id: "28", age: 56, gender: "Male", item: "Shorts", category: "Clothing", amount: 56, location: "Kentucky", size: "L", color: "Cyan", season: "Summer", rating: 5, subscription: "Yes", shipping: "Next Day Air", discount: "Yes", promo: "Yes", prevPurchases: 7, payment: "Bank Transfer", frequency: "Every 3 Months" },
  { id: "29", age: 54, gender: "Male", item: "Handbag", category: "Accessories", amount: 94, location: "North Carolina", size: "M", color: "Gray", season: "Fall", rating: 4.4, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 41, payment: "PayPal", frequency: "Every 3 Months" },
  { id: "30", age: 31, gender: "Male", item: "Dress", category: "Clothing", amount: 48, location: "Wyoming", size: "S", color: "Black", season: "Fall", rating: 4.1, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 14, payment: "Credit Card", frequency: "Weekly" },
  { id: "31", age: 57, gender: "Male", item: "Jewelry", category: "Accessories", amount: 31, location: "North Carolina", size: "L", color: "Black", season: "Winter", rating: 4.7, subscription: "Yes", shipping: "Standard", discount: "Yes", promo: "Yes", prevPurchases: 16, payment: "Credit Card", frequency: "Monthly" },
  { id: "32", age: 33, gender: "Male", item: "Dress", category: "Clothing", amount: 79, location: "West Virginia", size: "L", color: "Brown", season: "Winter", rating: 4.7, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 45, payment: "Venmo", frequency: "Monthly" },
  { id: "33", age: 36, gender: "Male", item: "Jacket", category: "Outerwear", amount: 67, location: "Kansas", size: "M", color: "Silver", season: "Summer", rating: 4.9, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 37, payment: "Venmo", frequency: "Annually" },
  { id: "34", age: 54, gender: "Male", item: "Pants", category: "Clothing", amount: 38, location: "Colorado", size: "L", color: "Green", season: "Summer", rating: 3.3, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 45, payment: "Cash", frequency: "Quarterly" },
  { id: "35", age: 36, gender: "Male", item: "T-shirt", category: "Clothing", amount: 91, location: "North Dakota", size: "L", color: "Violet", season: "Spring", rating: 4.6, subscription: "Yes", shipping: "2-Day Shipping", discount: "Yes", promo: "Yes", prevPurchases: 38, payment: "PayPal", frequency: "Quarterly" },
  { id: "36", age: 54, gender: "Male", item: "Blouse", category: "Clothing", amount: 33, location: "Massachusetts", size: "M", color: "Cyan", season: "Summer", rating: 4, subscription: "Yes", shipping: "2-Day Shipping", discount: "Yes", promo: "Yes", prevPurchases: 48, payment: "Credit Card", frequency: "Bi-Weekly" },
  { id: "37", age: 35, gender: "Male", item: "T-shirt", category: "Clothing", amount: 69, location: "Illinois", size: "M", color: "Maroon", season: "Winter", rating: 4.6, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 44, payment: "PayPal", frequency: "Fortnightly" },
  { id: "38", age: 35, gender: "Male", item: "Jeans", category: "Clothing", amount: 45, location: "Indiana", size: "S", color: "Cyan", season: "Summer", rating: 2.8, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 10, payment: "PayPal", frequency: "Weekly" },
  { id: "39", age: 29, gender: "Male", item: "Dress", category: "Clothing", amount: 37, location: "Florida", size: "M", color: "Red", season: "Winter", rating: 4.2, subscription: "Yes", shipping: "2-Day Shipping", discount: "Yes", promo: "Yes", prevPurchases: 44, payment: "Venmo", frequency: "Every 3 Months" },
  { id: "40", age: 70, gender: "Male", item: "Pants", category: "Clothing", amount: 60, location: "Arizona", size: "S", color: "Turquoise", season: "Summer", rating: 4.2, subscription: "Yes", shipping: "Express", discount: "Yes", promo: "Yes", prevPurchases: 18, payment: "Credit Card", frequency: "Monthly" },
  { id: "41", age: 69, gender: "Male", item: "Handbag", category: "Accessories", amount: 76, location: "Louisiana", size: "L", color: "Beige", season: "Winter", rating: 4.6, subscription: "Yes", shipping: "Next Day Air", discount: "Yes", promo: "Yes", prevPurchases: 31, payment: "Debit Card", frequency: "Quarterly" },
  { id: "42", age: 67, gender: "Male", item: "Scarf", category: "Accessories", amount: 39, location: "Alaska", size: "M", color: "Orange", season: "Spring", rating: 4.5, subscription: "Yes", shipping: "Standard", discount: "Yes", promo: "Yes", prevPurchases: 40, payment: "Venmo", frequency: "Annually" },
  { id: "43", age: 20, gender: "Male", item: "Coat", category: "Outerwear", amount: 100, location: "Tennessee", size: "M", color: "Beige", season: "Spring", rating: 4.1, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 15, payment: "PayPal", frequency: "Annually" },
  { id: "44", age: 25, gender: "Male", item: "Scarf", category: "Accessories", amount: 69, location: "Ohio", size: "L", color: "Lavender", season: "Fall", rating: 3.7, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 19, payment: "PayPal", frequency: "Fortnightly" },
  { id: "45", age: 39, gender: "Male", item: "Hat", category: "Accessories", amount: 53, location: "Kentucky", size: "S", color: "Silver", season: "Summer", rating: 4.6, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 45, payment: "PayPal", frequency: "Weekly" },
  { id: "46", age: 50, gender: "Male", item: "Socks", category: "Clothing", amount: 21, location: "Tennessee", size: "XL", color: "Indigo", season: "Fall", rating: 2.9, subscription: "Yes", shipping: "2-Day Shipping", discount: "Yes", promo: "Yes", prevPurchases: 25, payment: "PayPal", frequency: "Annually" },
  { id: "47", age: 57, gender: "Male", item: "Shirt", category: "Clothing", amount: 43, location: "California", size: "L", color: "White", season: "Summer", rating: 2.9, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 45, payment: "Cash", frequency: "Quarterly" },
  { id: "48", age: 55, gender: "Male", item: "Jewelry", category: "Accessories", amount: 54, location: "Montana", size: "M", color: "Charcoal", season: "Winter", rating: 4.5, subscription: "Yes", shipping: "Free Shipping", discount: "Yes", promo: "Yes", prevPurchases: 36, payment: "Cash", frequency: "Weekly" },
  { id: "49", age: 42, gender: "Male", item: "Shirt", category: "Clothing", amount: 55, location: "Nevada", size: "M", color: "Orange", season: "Summer", rating: 2.7, subscription: "Yes", shipping: "Store Pickup", discount: "Yes", promo: "Yes", prevPurchases: 38, payment: "Cash", frequency: "Monthly" },
  { id: "50", age: 68, gender: "Male", item: "Hoodie", category: "Clothing", amount: 30, location: "New Jersey", size: "S", color: "Indigo", season: "Spring", rating: 4.6, subscription: "Yes", shipping: "Next Day Air", discount: "Yes", promo: "Yes", prevPurchases: 34, payment: "Debit Card", frequency: "Bi-Weekly" }
];

export const mockTransactions: Transaction[] = rawData.map(item => {
  const revenue = item.amount;
  const expenses = Math.floor(revenue * (0.5 + Math.random() * 0.2));
  const profit = revenue - expenses;
  
  return {
    id: `TRX-${item.id}`,
    age: item.age,
    gender: item.gender,
    itemPurchased: item.item,
    category: item.category,
    revenue,
    expenses,
    profit,
    location: item.location,
    size: item.size,
    color: item.color,
    season: item.season,
    reviewRating: item.rating || 0,
    subscriptionStatus: item.subscription,
    shippingType: item.shipping,
    discountApplied: item.discount,
    promoCodeUsed: item.promo,
    previousPurchases: item.prevPurchases,
    paymentMethod: item.payment,
    frequencyOfPurchases: item.frequency,
    date: getRandomDate(),
    customerCount: 1
  };
});
