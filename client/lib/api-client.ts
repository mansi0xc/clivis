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

  // Outing APIs
  async getSocietyOutings(societyId: string) {
    return this.request<{ outings: any[] }>(`/societies/${societyId}/outings`)
  }

  async createOuting(societyId: string, data: { title: string; description?: string; date: string; location?: string; budget?: number }) {
    return this.request<{ outing: any }>(`/societies/${societyId}/outings`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getOuting(societyId: string, outingId: string) {
    return this.request<{ outing: any }>(`/societies/${societyId}/outings/${outingId}`)
  }

  async updateOuting(societyId: string, outingId: string, data: { title?: string; description?: string; date?: string; location?: string; budget?: number }) {
    return this.request<{ outing: any }>(`/societies/${societyId}/outings/${outingId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteOuting(societyId: string, outingId: string) {
    return this.request<{ message: string }>(`/societies/${societyId}/outings/${outingId}`, {
      method: 'DELETE',
    })
  }

  // Participant APIs
  async getOutingParticipants(societyId: string, outingId: string) {
    return this.request<{ participants: any[] }>(`/societies/${societyId}/outings/${outingId}/participants`)
  }

  async joinOuting(societyId: string, outingId: string) {
    return this.request<{ participant: any }>(`/societies/${societyId}/outings/${outingId}/participants`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  async updateParticipantStatus(societyId: string, outingId: string, userId: string, status: string) {
    return this.request<{ participant: any }>(`/societies/${societyId}/outings/${outingId}/participants/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async removeParticipant(societyId: string, outingId: string, userId: string) {
    return this.request<{ message: string }>(`/societies/${societyId}/outings/${outingId}/participants/${userId}`, {
      method: 'DELETE',
    })
  }

  // Instance APIs
  async getOutingInstances(societyId: string, outingId: string) {
    return this.request<{ instances: any[] }>(`/societies/${societyId}/outings/${outingId}/instances`)
  }

  async createInstance(societyId: string, outingId: string, data: { title: string; description?: string; totalAmount: number; participants: Array<{ userId: string; amount: number }> }) {
    return this.request<{ instance: any }>(`/societies/${societyId}/outings/${outingId}/instances`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient() 