export interface RawCustomerRecord {
  [key: string]: any;
}

export const mapRawRecordToCustomer = (raw: RawCustomerRecord, index: number) => {
  const findVal = (keywords: string[], defaultVal: any = '') => {
    for (const key of Object.keys(raw)) {
      const clean = key.trim().toLowerCase();
      if (keywords.some(kw => clean.includes(kw))) {
        const val = raw[key];
        if (val !== undefined && val !== null && val !== '') {
          return val;
        }
      }
    }
    return defaultVal;
  };

  const parseNum = (keywords: string[], defaultVal: number = 0): number => {
    const rawVal = findVal(keywords, null);
    if (rawVal === null || rawVal === undefined) return defaultVal;
    const cleaned = String(rawVal).replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? defaultVal : num;
  };

  const customerId = String(findVal(['customer id', 'cust id', 'id', 'customer_id'], `CUST-${1000 + index}`));
  const name = String(findVal(['name', 'customer name', 'full name', 'client'], `Customer ${index + 1}`));
  const age = parseNum(['age'], 35);
  const gender = String(findVal(['gender', 'sex'], 'Unspecified'));
  const income = parseNum(['income', 'annual income', 'salary'], 65000);
  const occupation = String(findVal(['occupation', 'job', 'profession', 'role'], 'Professional'));
  const education = String(findVal(['education', 'qualification', 'degree'], 'Bachelor'));
  const city = String(findVal(['city', 'location', 'town'], 'Hyderabad'));
  const country = String(findVal(['country', 'nation'], 'India'));
  const purchaseFrequency = parseNum(['purchase frequency', 'frequency', 'freq', 'purchase_freq'], 12);
  const annualSpending = parseNum(['annual spending', 'spending', 'total spending', 'spend'], 3500);
  const lastPurchaseDate = String(findVal(['last purchase date', 'last purchase', 'date'], new Date().toISOString().split('T')[0]));
  const numberOfOrders = parseNum(['number of orders', 'num orders', 'orders count', 'total orders', 'orders'], 15);
  const averageOrderValue = parseNum(['average order value', 'avg order value', 'aov'], annualSpending && numberOfOrders ? annualSpending / numberOfOrders : 150);
  const preferredCategory = String(findVal(['preferred category', 'category', 'top category'], 'Electronics'));
  const customerRating = parseNum(['customer rating', 'rating', 'score'], 4.5);

  // Compute Customer Lifetime Value heuristic: Annual Spending * (Customer Rating / 2.5) * (Number of Orders / 10)
  const lifetimeValue = Math.round(annualSpending * 1.8 + numberOfOrders * 120 + averageOrderValue * 2.5);

  return {
    customerId,
    name,
    age,
    gender,
    income,
    occupation,
    education,
    city,
    country,
    purchaseFrequency,
    annualSpending,
    lastPurchaseDate,
    numberOfOrders,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    preferredCategory,
    customerRating,
    lifetimeValue
  };
};
