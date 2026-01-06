import { API_URL } from './config';

export async function getCatalogues(page = 1, limit = 100, search = '', sessionToken = null) {
  try {
    // Session token is required
    if (!sessionToken) {
      throw new Error('Session token is required');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    params.append('session', sessionToken);
    
    const res = await fetch(`${API_URL}/catalogues?${params.toString()}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid or expired session token');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch catalogues');
    }
    
    const result = await res.json();
    
    // Backend returns { success, data, message, pagination }
    if (result.success) {
      return {
        catalogues: result.data || [],
        pagination: result.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
      };
    }
    
    return { catalogues: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
  } catch (error) {
    console.error('Error fetching catalogues:', error);
    return { catalogues: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
  }
}

export async function getCatalogueById(id, sessionToken = null) {
  try {
    // Session token is required
    if (!sessionToken) {
      throw new Error('Session token is required');
    }

    const params = new URLSearchParams();
    params.append('session', sessionToken);
    
    const url = `${API_URL}/catalogues/${id}?${params.toString()}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid or expired session token');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch catalogue');
    }
    
    const result = await res.json();
    
    // Backend returns { success, data, message }
    if (result.success) {
      return result.data || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching catalogue:', error);
    return null;
  }
}

export async function submitPriceInquiry(data, sessionToken = null) {
  try {
    // Session token is required
    if (!sessionToken) {
      throw new Error('Session token is required');
    }

    const params = new URLSearchParams();
    params.append('session', sessionToken);
    
    const url = `${API_URL}/catalogues/price-inquiry?${params.toString()}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid or expired session token');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit price inquiry');
    }
    
    const result = await res.json();
    
    if (result.success) {
      return { success: true, message: result.message };
    }
    
    throw new Error(result.message || 'Failed to submit price inquiry');
  } catch (error) {
    console.error('Error submitting price inquiry:', error);
    throw error;
  }
}