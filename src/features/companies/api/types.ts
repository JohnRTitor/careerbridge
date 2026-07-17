export interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyFilters {
  q?: string;
  industry?: string;
  location?: string;
  page?: number;
  limit?: number;
}
