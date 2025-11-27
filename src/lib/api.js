const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCatalogues(page = 1, limit = 100, search = '') {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const res = await fetch(`${API_URL}/catalogues?${params.toString()}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch catalogues');
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

export async function getCatalogueById(id) {
  try {
    const res = await fetch(`${API_URL}/catalogues/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch catalogue');
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

export async function submitPriceInquiry(data) {
  try {
    const res = await fetch(`${API_URL}/catalogues/price-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to submit price inquiry');
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