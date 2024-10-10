import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Goods {
  id: number;
  quantity: number;
  name: string;
  type: string;
  averageImportPrice: number;
  weight: number;
  unit: string;
  sellingPrice: number;
}

export interface NewGoods {
  quantity: number;
  name: string;
  type: string;
  averageImportPrice: number;
  weight: number;
  unit: string;
  sellingPrice: number;
}

export interface Dishes {
  id: number;
  name: string;
  unit: number;
  price: number;
  type: string;
}

export interface Ingredient {
  goodsId: number; // ID của nguyên liệu (goods)
  quantity: number; // Số lượng nguyên liệu trong món ăn
}

export interface NewDish {
  name: string;
  unit: string;
  price: number;
  type: string;
  ingredients: Ingredient[]; // Danh sách nguyên liệu của món ăn
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Goods[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface Provider {
  id: string;
  name: string;
  address: string;
  contactInfo: string;
}

export interface NewProvider {
  name: string;
  address: string;
  contactInfo: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Goods", "Dishes", "Providers", "Expenses"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    // goods
    getGoods: build.query<Goods[], string | void>({
      query: (search) => ({
        url: "/goods",
        params: search ? { search } : {},
      }),
      providesTags: ["Goods"],
    }),
    createGoods: build.mutation<Goods, NewGoods>({
      query: (newGoods) => ({
        url: "/goods",
        method: "POST",
        body: newGoods,
      }),
      invalidatesTags: ["Goods"],
    }),
    updateGoods: build.mutation<
      Goods,
      { id: number; updatedGoods: Partial<Goods> }
    >({
      query: ({ id, updatedGoods }) => ({
        url: `/goods/${id}`,
        method: "PUT",
        body: updatedGoods,
      }),
      invalidatesTags: ["Goods"],
    }),
    deleteGoods: build.mutation<void, number>({
      query: (id) => ({
        url: `/goods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goods"],
    }),

    // dishes
    getDishes: build.query<Dishes[], string | void>({
      query: (search) => ({
        url: "/dishes",
        params: search ? { search } : {},
      }),
      providesTags: ["Goods"],
    }), // Update in api.ts
    getIngredients: build.query<Dishes[], string | void>({
      query: (search) => ({
        url: "/goods",
        params: search ? { search } : {},
      }),
      providesTags: ["Goods"],
    }),
    createDish: build.mutation<Dishes, NewDish>({
      query: (newDish) => ({
        url: "/dishes",
        method: "POST",
        body: newDish,
      }),
      invalidatesTags: ["Dishes"],
    }),
    // providers
    getProviders: build.query<Provider[], void>({
      query: () => "/providers",
      providesTags: ["Providers"],
    }),
    createProvider: build.mutation<Goods, NewGoods>({
      query: (newProvider) => ({
        url: "/providers",
        method: "POST",
        body: newProvider,
      }),
      invalidatesTags: ["Goods"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetGoodsQuery,
  useCreateGoodsMutation,
  useUpdateGoodsMutation,
  useDeleteGoodsMutation,
  useGetDishesQuery,
  useGetIngredientsQuery,
  useCreateDishMutation,
  useGetProvidersQuery,
  useGetExpensesByCategoryQuery,
} = api;
