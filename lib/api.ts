const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = {
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }
    
    return response.json();
  },

  async get(endpoint: string, token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }
    
    return response.json();
  },

  async createRestaurantApi(data: any, token: string) {

    const response = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(errorData.message || "Error al registrar el restaurante");
    }

    return response.json();
  },

  async getRestaurantsApi(token: string) {
  try {
    const response = await fetch(`${API_URL}/restaurants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // 🚀 Extraemos el JSON en una constante una sola vez
    const data = await response.json();

    if (!response.ok) {
      console.log('Error data:', data);
      throw new Error(data.message || "Error al obtener los restaurantes");
    }
    
    // Retornamos los datos limpios
    return data;
  } catch (error) {
    console.error('Error al obtener los restaurantes:', error);
    throw error;
  }
},

  async updateRestaurantApi(id: string, data: any, token: string) {
    try {
      const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json()

      if (!response.ok) {
        console.error('Error al actualizar en API:', resData);
        throw new Error(resData.message || "Error al actualizar el restaurante");
      }

      return resData;
    } catch (error) {
      console.error('Error al actualizar el restaurante:', error);
      throw error;
    }
  },

  async deleteRestaurantApi(id: string, token: string) {
    try {
      const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const resData = await response.json()

      if (!response.ok) {
        console.error('Error al eliminar en API:', resData);
        throw new Error(resData.message || "Error al eliminar el restaurante");
      }

      return resData;
    } catch (error) {
      console.error('Error al eliminar el restaurante:', error);
      throw error;
    }
  },

  async claimRestaurantApi(code: string, token: string) {
    const response = await fetch(`${API_URL}/restaurants/claim-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    });

    const resData = await response.json()

    if (!response.ok) {
      console.error('Error al reclamar en API:', resData);
      throw new Error(resData.message || "Error al reclamar el restaurante");
    }

    return resData;
  },

  async getMyRestaurantApi(token: string) {
    const response = await fetch(`${API_URL}/restaurants/my-restaurant`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const resData = await response.json()

    if (!response.ok) {
      console.error('Error al obtener restaurante en API:', resData);
      throw new Error(resData.message || "Error al obtener el restaurante");
    }

    return resData;
  },

  async updateMyRestaurantApi(data: any, token: string) {
    const response = await fetch(`${API_URL}/restaurants/my-restaurant/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json()

    if (!response.ok) {
      console.error('Error al actualizar restaurante en API:', resData);
      throw new Error(resData.message || "Error al actualizar el restaurante");
    }

    return resData;
  },
};


