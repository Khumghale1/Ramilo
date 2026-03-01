const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to make authenticated requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include", // Include cookies for auth
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// ─── Saves API ─────────────────────────────────────────────────────────────────

export interface SavedPlace {
  id: string;
  placeId: string;
  moodContext?: string;
  savedAt: string;
  place: Place;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  area: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  priceRange: string;
  hasParking: boolean;
  crowdLevel: string;
  alcoholAvailable: boolean;
  photos: string[];
  coverPhoto?: string;
  contactPhone?: string;
  website?: string;
  instagramHandle?: string;
}

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  const response = await fetchWithAuth("/api/saves");
  return response.data;
}

export async function savePlace(placeId: string, moodContext?: string): Promise<SavedPlace> {
  const response = await fetchWithAuth("/api/saves", {
    method: "POST",
    body: JSON.stringify({ placeId, moodContext }),
  });
  return response.data;
}

export async function unsavePlace(placeId: string): Promise<void> {
  await fetchWithAuth(`/api/saves/${placeId}`, {
    method: "DELETE",
  });
}

// ─── Plans API ─────────────────────────────────────────────────────────────────

export interface PlannedVisit {
  id: string;
  placeId: string;
  plannedDate?: string;
  moodContext?: string;
  wasVisited: boolean;
  place: Place;
}

export async function getPlannedVisits(): Promise<PlannedVisit[]> {
  const response = await fetchWithAuth("/api/plans");
  return response.data;
}

export async function addPlan(placeId: string, plannedDate?: string, moodContext?: string): Promise<PlannedVisit> {
  const response = await fetchWithAuth("/api/plans", {
    method: "POST",
    body: JSON.stringify({ placeId, plannedDate, moodContext }),
  });
  return response.data;
}

export async function removePlan(planId: string): Promise<void> {
  await fetchWithAuth(`/api/plans/${planId}`, {
    method: "DELETE",
  });
}

// ─── Places API ────────────────────────────────────────────────────────────────

export async function getPlaces(params?: {
  moodId?: string;
  area?: string;
  priceRange?: string;
  crowdLevel?: string;
}): Promise<Place[]> {
  const searchParams = new URLSearchParams();
  if (params?.moodId) searchParams.set("moodId", params.moodId);
  if (params?.area) searchParams.set("area", params.area);
  if (params?.priceRange) searchParams.set("priceRange", params.priceRange);
  if (params?.crowdLevel) searchParams.set("crowdLevel", params.crowdLevel);

  const query = searchParams.toString();
  const response = await fetchWithAuth(`/api/places${query ? `?${query}` : ""}`, {
    credentials: "omit", // Places don't require auth
  });
  return response.data;
}

export async function getPlaceById(id: string): Promise<Place> {
  const response = await fetchWithAuth(`/api/places/${id}`, {
    credentials: "omit",
  });
  return response.data;
}

// ─── Business Submissions API ─────────────────────────────────────────────────

export interface BusinessSubmission {
  id: string;
  businessName: string;
  category: string;
  area: string;
  contact: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  priceRange: string;
  hasParking: boolean;
  crowdLevel: string;
  alcoholAvailable: boolean;
  bestForMoods: string[];
  photos: string[];
  website?: string;
  instagramHandle?: string;
  openingHours?: string;
  specialFeatures?: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export async function getMySubmissions(): Promise<BusinessSubmission[]> {
  const response = await fetchWithAuth("/api/business/my-submissions");
  return response.data;
}

export async function getMySubmissionById(id: string): Promise<BusinessSubmission> {
  const response = await fetchWithAuth(`/api/business/my-submissions/${id}`);
  return response.data;
}

export async function updateMySubmission(
  id: string,
  data: Partial<Omit<BusinessSubmission, "id" | "status" | "submittedAt" | "reviewedAt" | "rejectionReason">>
): Promise<BusinessSubmission> {
  const response = await fetchWithAuth(`/api/business/my-submissions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteMySubmission(id: string): Promise<void> {
  await fetchWithAuth(`/api/business/my-submissions/${id}`, {
    method: "DELETE",
  });
}

// ─── User API ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "USER" | "BUSINESS_USER" | "ADMIN";
  lastLogin?: string;
  preferredAreas?: string[];
  createdAt: string;
}

export async function getMe(): Promise<User> {
  const response = await fetchWithAuth("/api/user/me");
  return response.data;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  businessUsers: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "USER" | "BUSINESS_USER" | "ADMIN";
  lastLogin?: string;
  createdAt: string;
  _count: {
    businessSubmissions: number;
  };
}

export interface AdminSubmission extends BusinessSubmission {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function getAdminStats(): Promise<AdminStats> {
  const response = await fetchWithAuth("/api/admin/stats");
  return response.data;
}

export async function getAdminUsers(role?: "USER" | "BUSINESS_USER"): Promise<AdminUser[]> {
  const query = role ? `?role=${role}` : "";
  const response = await fetchWithAuth(`/api/admin/users${query}`);
  return response.data;
}

export async function getAdminUserById(id: string): Promise<AdminUser> {
  const response = await fetchWithAuth(`/api/admin/users/${id}`);
  return response.data;
}

export async function updateUserRole(id: string, role: "USER" | "BUSINESS_USER"): Promise<AdminUser> {
  const response = await fetchWithAuth(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  return response.data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await fetchWithAuth(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminSubmissions(status?: "PENDING" | "APPROVED" | "REJECTED"): Promise<AdminSubmission[]> {
  const query = status ? `?status=${status}` : "";
  const response = await fetchWithAuth(`/api/admin/submissions${query}`);
  return response.data;
}

export async function getAdminSubmissionById(id: string): Promise<AdminSubmission> {
  const response = await fetchWithAuth(`/api/admin/submissions/${id}`);
  return response.data;
}

export async function approveSubmission(id: string, password: string, name?: string): Promise<{ submission: AdminSubmission; userEmail: string; message: string }> {
  const response = await fetchWithAuth(`/api/admin/submissions/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ password, name }),
  });
  return response.data;
}

export async function rejectSubmission(id: string, reason: string): Promise<AdminSubmission> {
  const response = await fetchWithAuth(`/api/admin/submissions/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
  return response.data;
}
