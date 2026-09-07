import type {
  ApiResponse,
  ApiSuccessResponse,
  ApiPaginatedResponse,
  PaginationParams,
  FilterParams,
} from "@/types/api";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Custom API Error Class
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any[],
    public requestId?: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Request Options Interface
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Core fetch wrapper with error handling
 */
async function fetchApi<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, auth = true, headers = {}, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);

  // Prepare headers
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add Clerk auth token if needed (will be handled by Clerk middleware in Next.js)
  // The auth token is automatically included in server components and API routes

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      credentials: "include", // Include cookies for authentication
    });

    const data: ApiResponse<T> = await response.json();

    // Handle error responses
    if (!data.success) {
      throw new ApiError(
        data.error.code,
        data.error.message,
        data.error.details,
        data.error.requestId,
        response.status
      );
    }

    return data.data;
  } catch (error) {
    // Handle network errors
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "NETWORK_ERROR",
        "Unable to connect to the server. Please check your internet connection.",
        undefined,
        undefined,
        0
      );
    }

    throw new ApiError(
      "UNKNOWN_ERROR",
      error instanceof Error ? error.message : "An unknown error occurred",
      undefined,
      undefined,
      0
    );
  }
}

/**
 * GET request
 */
export async function get<T = any>(
  endpoint: string,
  params?: PaginationParams & FilterParams,
  options?: Omit<RequestOptions, "method" | "body" | "params">
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "GET",
    params,
    ...options,
  });
}

/**
 * POST request
 */
export async function post<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

/**
 * PATCH request
 */
export async function patch<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

/**
 * PUT request
 */
export async function put<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

/**
 * DELETE request
 */
export async function del<T = any>(
  endpoint: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "DELETE",
    ...options,
  });
}

/**
 * Upload file with multipart/form-data
 */
export async function upload<T = any>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestOptions, "method" | "body" | "headers">
): Promise<T> {
  const url = buildUrl(endpoint, options?.params);

  const requestHeaders: HeadersInit = {
    // Don't set Content-Type for FormData - browser will set it with boundary
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: requestHeaders,
      credentials: "include",
      ...options,
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ApiError(
        data.error.code,
        data.error.message,
        data.error.details,
        data.error.requestId,
        response.status
      );
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "UPLOAD_ERROR",
      error instanceof Error ? error.message : "File upload failed",
      undefined,
      undefined,
      0
    );
  }
}

/**
 * Download file
 */
export async function download(
  endpoint: string,
  filename?: string,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<void> {
  const url = buildUrl(endpoint, options?.params);

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        "DOWNLOAD_ERROR",
        `Failed to download file: ${response.statusText}`,
        undefined,
        undefined,
        response.status
      );
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "DOWNLOAD_ERROR",
      error instanceof Error ? error.message : "File download failed",
      undefined,
      undefined,
      0
    );
  }
}

// Export default API client
export const api = {
  get,
  post,
  patch,
  put,
  delete: del,
  upload,
  download,
};

export default api;
