import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { Task, Category } from "@/types";

const BASE_URL = "/api";

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Fetch failed");
  }
  return res.json();
}

async function mutator<T>(
  url: string,
  { arg }: { arg: { method?: string; body?: unknown } }
): Promise<T> {
  const res = await fetch(url, {
    method: arg.method || "POST",
    headers: { "Content-Type": "application/json" },
    body: arg.body ? JSON.stringify(arg.body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Mutation failed");
  }
  return res.json();
}

export function useTasks(params?: Record<string, string>) {
  const query = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  return useSWR<Task[]>(`${BASE_URL}/tasks${query}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 500,
  });
}

export function useCategories() {
  return useSWR<Category[]>(`${BASE_URL}/categories`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });
}

export function useStats() {
  return useSWR<{
    totalTasks: number;
    todayTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    weeklyCompleted: number;
    completionRate: number;
    categoryStats: { name: string; color: string; count: number }[];
    weeklyChart: { day: string; count: number }[];
  }>(`${BASE_URL}/stats`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });
}

export function useTask(id: string | null) {
  return useSWR<Task>(
    id ? `${BASE_URL}/tasks/${id}` : null,
    fetcher
  );
}

export function useCreateTask() {
  return useSWRMutation<Task, Error, string, { body: unknown }>(
    `${BASE_URL}/tasks`,
    mutator,
  );
}

export function useUpdateTask() {
  return useSWRMutation<Task, Error, string, { id: string; body: unknown }>(
    `${BASE_URL}/tasks`,
    (url, { arg }) =>
      fetch(`${url}/${arg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg.body),
      }).then((r) => {
        if (!r.ok) throw new Error("Update failed");
        return r.json();
      }),
  );
}

export function useDeleteTask() {
  return useSWRMutation<void, Error, string, { id: string }>(
    `${BASE_URL}/tasks`,
    (url, { arg }) =>
      fetch(`${url}/${arg.id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Delete failed");
        return r.json();
      }),
  );
}

export function useCreateCategory() {
  return useSWRMutation<Category, Error, string, { body: unknown }>(
    `${BASE_URL}/categories`,
    mutator,
  );
}

export function useUpdateCategory() {
  return useSWRMutation<Category, Error, string, { id: string; body: unknown }>(
    `${BASE_URL}/categories`,
    (url, { arg }) =>
      fetch(`${url}/${arg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg.body),
      }).then((r) => {
        if (!r.ok) throw new Error("Update failed");
        return r.json();
      }),
  );
}

export function useDeleteCategory() {
  return useSWRMutation<void, Error, string, { id: string }>(
    `${BASE_URL}/categories`,
    (url, { arg }) =>
      fetch(`${url}/${arg.id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Delete failed");
        return r.json();
      }),
  );
}
