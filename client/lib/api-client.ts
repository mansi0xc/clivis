class ApiClient {
  private baseUrl = '/api'

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Society APIs
  async getSocieties() {
    return this.request<{ societies: any[] }>('/societies')
  }

  async createSociety(data: { name: string; description?: string }) {
    return this.request<{ society: any }>('/societies', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSociety(id: string) {
    return this.request<{ society: any }>(`/societies/${id}`)
  }

  async updateSociety(id: string, data: { name?: string; description?: string }) {
    return this.request<{ society: any }>(`/societies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteSociety(id: string) {
    return this.request<{ message: string }>(`/societies/${id}`, {
      method: 'DELETE',
    })
  }

  // Member APIs
  async getSocietyMembers(societyId: string) {
    return this.request<{ members: any[] }>(`/societies/${societyId}/members`)
  }

  async addSocietyMember(societyId: string, data: { email: string; role?: string }) {
    return this.request<{ member: any }>(`/societies/${societyId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateMemberRole(societyId: string, userId: string, role: string) {
    return this.request<{ member: any }>(`/societies/${societyId}/members/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  }

  async removeSocietyMember(societyId: string, userId: string) {
    return this.request<{ message: string }>(`/societies/${societyId}/members/${userId}`, {
      method: 'DELETE',
    })
  }

  // User APIs
  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me')
  }
}

export const apiClient = new ApiClient() 