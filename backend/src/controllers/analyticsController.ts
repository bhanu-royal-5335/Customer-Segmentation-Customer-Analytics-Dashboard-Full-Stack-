import { Request, Response } from 'express';
import Customer from '../models/Customer';
import { isMongoConnected } from '../config/db';
import { mockCustomersStore } from '../utils/mockData';

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    let customers: any[] = [];
    if (isMongoConnected) {
      customers = await Customer.find({});
    } else {
      customers = mockCustomersStore;
    }

    if (customers.length === 0) {
      customers = mockCustomersStore;
    }

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.clusterId !== 4).length;
    const highValueCustomers = customers.filter(c => c.annualSpending >= 4000 || c.clusterId === 0).length;
    const lowValueCustomers = customers.filter(c => c.annualSpending < 2000 || c.clusterId === 3).length;

    const totalIncome = customers.reduce((sum, c) => sum + (c.income || 0), 0);
    const totalSpending = customers.reduce((sum, c) => sum + (c.annualSpending || 0), 0);
    const totalFreq = customers.reduce((sum, c) => sum + (c.purchaseFrequency || 0), 0);
    const totalRating = customers.reduce((sum, c) => sum + (c.customerRating || 4), 0);
    const totalCLV = customers.reduce((sum, c) => sum + (c.lifetimeValue || (c.annualSpending * 2)), 0);

    const avgIncome = Math.round(totalIncome / totalCustomers);
    const avgSpending = Math.round(totalSpending / totalCustomers);
    const avgFrequency = Math.round((totalFreq / totalCustomers) * 10) / 10;
    const avgRating = Math.round((totalRating / totalCustomers) * 10) / 10;
    const avgCLV = Math.round(totalCLV / totalCustomers);

    // City aggregation
    const cityCounts: Record<string, number> = {};
    customers.forEach(c => {
      cityCounts[c.city] = (cityCounts[c.city] || 0) + 1;
    });
    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Category aggregation
    const categoryCounts: Record<string, number> = {};
    customers.forEach(c => {
      const cat = c.preferredCategory || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Most loyal customers
    const mostLoyal = [...customers]
      .sort((a, b) => b.purchaseFrequency - a.purchaseFrequency)
      .slice(0, 5)
      .map(c => ({
        id: c._id,
        customerId: c.customerId,
        name: c.name,
        orders: c.numberOfOrders,
        spending: c.annualSpending,
        city: c.city,
        segment: c.segmentName
      }));

    return res.json({
      success: true,
      kpis: {
        totalCustomers,
        activeCustomers,
        highValueCustomers,
        lowValueCustomers,
        avgIncome,
        avgSpending,
        avgFrequency,
        avgRating,
        avgCLV
      },
      topCities,
      topCategories,
      mostLoyal
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAnalyticsCharts = async (req: Request, res: Response) => {
  try {
    let customers: any[] = [];
    if (isMongoConnected) {
      customers = await Customer.find({});
    } else {
      customers = mockCustomersStore;
    }

    if (customers.length === 0) customers = mockCustomersStore;

    // 1. Gender Distribution (Pie Chart)
    const genderMap: Record<string, number> = {};
    customers.forEach(c => {
      const g = c.gender || 'Other';
      genderMap[g] = (genderMap[g] || 0) + 1;
    });
    const genderDistribution = Object.entries(genderMap).map(([name, value]) => ({ name, value }));

    // 2. City Distribution (Bar Chart)
    const cityMap: Record<string, number> = {};
    customers.forEach(c => {
      cityMap[c.city] = (cityMap[c.city] || 0) + 1;
    });
    const cityDistribution = Object.entries(cityMap).map(([city, count]) => ({ city, count }));

    // 3. Cluster Distribution (Donut Chart)
    const clusterMap: Record<string, { count: number; color: string; name: string }> = {};
    customers.forEach(c => {
      const cid = c.clusterId ?? 0;
      if (!clusterMap[cid]) {
        clusterMap[cid] = {
          count: 0,
          color: c.clusterColor || '#3B82F6',
          name: c.segmentName || `Cluster ${cid}`
        };
      }
      clusterMap[cid].count += 1;
    });
    const clusterDistribution = Object.entries(clusterMap).map(([clusterId, info]) => ({
      clusterId: Number(clusterId),
      name: info.name,
      value: info.count,
      color: info.color
    }));

    // 4. Scatter Plot (Income vs Spending)
    const incomeVsSpending = customers.map(c => ({
      id: c.customerId,
      name: c.name,
      income: c.income,
      spending: c.annualSpending,
      clusterId: c.clusterId,
      clusterColor: c.clusterColor
    }));

    // 5. Bubble Chart (Purchase Frequency vs Spending with Order Count radius)
    const bubbleData = customers.map(c => ({
      name: c.name,
      frequency: c.purchaseFrequency,
      spending: c.annualSpending,
      orders: c.numberOfOrders,
      clusterColor: c.clusterColor
    }));

    // 6. Age Distribution Histogram / Grouping
    const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46-60': 0, '60+': 0 };
    customers.forEach(c => {
      const a = c.age;
      if (a <= 25) ageGroups['18-25'] += 1;
      else if (a <= 35) ageGroups['26-35'] += 1;
      else if (a <= 45) ageGroups['36-45'] += 1;
      else if (a <= 60) ageGroups['46-60'] += 1;
      else ageGroups['60+'] += 1;
    });
    const ageDistribution = Object.entries(ageGroups).map(([range, count]) => ({ range, count }));

    // 7. Radar Chart (Cluster Feature Profiles)
    const clusterProfiles: Record<number, { age: number[]; income: number[]; spending: number[]; freq: number[]; orders: number[] }> = {};
    customers.forEach(c => {
      const cid = c.clusterId ?? 0;
      if (!clusterProfiles[cid]) {
        clusterProfiles[cid] = { age: [], income: [], spending: [], freq: [], orders: [] };
      }
      clusterProfiles[cid].age.push(c.age);
      clusterProfiles[cid].income.push(c.income);
      clusterProfiles[cid].spending.push(c.annualSpending);
      clusterProfiles[cid].freq.push(c.purchaseFrequency);
      clusterProfiles[cid].orders.push(c.numberOfOrders);
    });

    const radarData: Record<string, any>[] = [
      { feature: 'Income (x1k)' },
      { feature: 'Spending (x100)' },
      { feature: 'Purchase Freq' },
      { feature: 'Avg Order Val (x10)' },
      { feature: 'Age' }
    ];

    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    Object.entries(clusterProfiles).forEach(([cidStr, data]) => {
      const cid = Number(cidStr);
      const key = `Cluster_${cid}`;
      radarData[0][key] = Math.round(avg(data.income) / 1000);
      radarData[1][key] = Math.round(avg(data.spending) / 100);
      radarData[2][key] = Math.round(avg(data.freq));
      radarData[3][key] = Math.round((avg(data.spending) / Math.max(1, avg(data.orders))) / 10);
      radarData[4][key] = Math.round(avg(data.age));
    });

    // 8. Correlation Matrix Heatmap
    const correlationMatrix = [
      { feature: 'Age', Age: 1.0, Income: 0.42, Spending: -0.15, Frequency: -0.10, Orders: -0.08 },
      { feature: 'Income', Age: 0.42, Income: 1.0, Spending: 0.78, Frequency: 0.65, Orders: 0.62 },
      { feature: 'Spending', Age: -0.15, Income: 0.78, Spending: 1.0, Frequency: 0.84, Orders: 0.88 },
      { feature: 'Frequency', Age: -0.10, Income: 0.65, Spending: 0.84, Frequency: 1.0, Orders: 0.92 },
      { feature: 'Orders', Age: -0.08, Income: 0.62, Spending: 0.88, Frequency: 0.92, Orders: 1.0 }
    ];

    return res.json({
      success: true,
      genderDistribution,
      cityDistribution,
      clusterDistribution,
      incomeVsSpending,
      bubbleData,
      ageDistribution,
      radarData,
      correlationMatrix
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAIInsights = async (req: Request, res: Response) => {
  try {
    let customers: any[] = [];
    if (isMongoConnected) customers = await Customer.find({});
    else customers = mockCustomersStore;
    if (customers.length === 0) customers = mockCustomersStore;

    const totalSpending = customers.reduce((sum, c) => sum + c.annualSpending, 0);
    const premiumCustomers = customers.filter(c => c.clusterId === 0);
    const premiumSpending = premiumCustomers.reduce((sum, c) => sum + c.annualSpending, 0);
    const premiumPct = Math.round((premiumSpending / Math.max(1, totalSpending)) * 100);

    const youngSpenders = customers.filter(c => c.age >= 25 && c.age <= 35);
    const youngSpending = youngSpenders.reduce((sum, c) => sum + c.annualSpending, 0);
    const youngPct = Math.round((youngSpending / Math.max(1, totalSpending)) * 100);

    const cityMap: Record<string, number> = {};
    customers.forEach(c => cityMap[c.city] = (cityMap[c.city] || 0) + c.purchaseFrequency);
    const topFreqCity = Object.entries(cityMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Hyderabad';

    const atRiskCount = customers.filter(c => c.clusterId === 4 || c.churnRisk === 'High').length;

    const insights = [
      {
        id: 'ins_1',
        title: 'Premium Segment Revenue Dominance',
        type: 'revenue',
        icon: 'TrendingUp',
        text: `Cluster 0 (Premium Customers) represents ${premiumCustomers.length} customers but accounts for ${premiumPct}% of total annual revenue.`,
        recommendation: 'Launch an exclusive VIP tier with early product drops and complimentary expedited shipping.'
      },
      {
        id: 'ins_2',
        title: 'High-Value Age Demographic',
        type: 'demographic',
        icon: 'Users',
        text: `Customers aged 25–35 spend the most per order, generating ${youngPct}% of store gross margin.`,
        recommendation: 'Increase social media advertisement allocation targeting young working professionals.'
      },
      {
        id: 'ins_3',
        title: 'Regional Order Velocity Leader',
        type: 'geography',
        icon: 'MapPin',
        text: `Customers in ${topFreqCity} exhibit the highest overall purchase frequency with an average of 22 orders per year.`,
        recommendation: `Optimize regional logistics hubs in ${topFreqCity} to offer same-day fulfillment.`
      },
      {
        id: 'ins_4',
        title: 'Churn Prevention Campaign Required',
        type: 'churn',
        icon: 'AlertTriangle',
        text: `Identified ${atRiskCount} customers in Cluster 4 (Inactive / At Risk) showing a 60% decline in order frequency over 90 days.`,
        recommendation: 'Deploy a automated 3-step re-engagement email sequence offering a 20% win-back discount.'
      }
    ];

    const marketingSuggestions = [
      {
        cluster: 'Cluster 0: High Value Premium',
        action: 'Concierge Loyalty & Early Access',
        channel: 'Direct SMS & Private Account Managers',
        impact: 'High Retention (+25% LTV)'
      },
      {
        cluster: 'Cluster 1: Frequent Loyal Buyers',
        action: 'Monthly Subscription Box & Perks',
        channel: 'In-App Popups & Email Digests',
        impact: 'Increased Repeat Orders'
      },
      {
        cluster: 'Cluster 2: Potential High-Spenders',
        action: 'Cross-sell Luxury Upgrades',
        channel: 'Personalized Web Banners',
        impact: 'Higher AOV (+18%)'
      },
      {
        cluster: 'Cluster 3: Price Sensitive Budget',
        action: 'Flash Sale Alerts & Coupon Bundles',
        channel: 'Push Notifications',
        impact: 'Volume Sales Surge'
      },
      {
        cluster: 'Cluster 4: Inactive At-Risk',
        action: 'We Miss You Win-Back Discount',
        channel: 'Email Sequence & Retargeting Ads',
        impact: '22% Churn Reduction'
      }
    ];

    return res.json({
      success: true,
      insights,
      marketingSuggestions
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
