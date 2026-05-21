import createClient from "openapi-fetch";
import type { paths } from "./schema";

const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// Remova o sufixo /api/v1 se estiver presente, pois os caminhos no schema já incluem /api/v1
const baseUrl = rawUrl.replace(/\/api\/v1\/?$/, "");

export const apiClient = createClient<paths>({ 
  baseUrl 
});
