/**
 * Spaceship Service
 * Handles cross-app authentication and access management for Spaceship integration
 */

export interface SpaceshipAccess {
  hasAccess: boolean;
  spaceshipUserId?: number;
}

export interface SpaceshipToken {
  spaceshipToken: string;
  expiresIn: number;
  redirectUrl: string;
}

class SpaceshipService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:3004';
    
    return fetch(`${apiUrl}/api${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  /**
   * Check if user has Spaceship access
   */
  async checkSpaceshipAccess(): Promise<SpaceshipAccess> {
    try {
      const response = await this.fetchWithAuth('/auth/spaceship-access-status');
      
      if (!response.ok) {
        console.warn('No Spaceship access or not authenticated');
        return { hasAccess: false };
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to check Spaceship access:', error);
      return { hasAccess: false };
    }
  }

  /**
   * Create Spaceship access for current user
   */
  async createSpaceshipAccess(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.fetchWithAuth('/auth/create-spaceship-access', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create Spaceship access');
      }
      
      return response.json();
    } catch (error: any) {
      console.error('Failed to create Spaceship access:', error);
      throw new Error(error.message || 'Failed to create Spaceship access');
    }
  }

  /**
   * Generate Spaceship login token and redirect
   */
  async loginToSpaceship(): Promise<void> {
    try {
      const response = await this.fetchWithAuth('/auth/generate-spaceship-token', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate Spaceship token');
      }
      
      const data: SpaceshipToken = await response.json();

      if (data.redirectUrl) {
        // Redirect to Spaceship with token
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL provided');
      }
    } catch (error: any) {
      console.error('Failed to login to Spaceship:', error);
      throw new Error(error.message || 'Failed to login to Spaceship');
    }
  }

  /**
   * Direct redirect to Spaceship (for users with existing access)
   */
  async redirectToSpaceship(): Promise<void> {
    try {
      // Check if user has access first
      const access = await this.checkSpaceshipAccess();
      
      if (!access.hasAccess) {
        // Create access first
        await this.createSpaceshipAccess();
      }
      
      // Generate token and redirect
      await this.loginToSpaceship();
    } catch (error) {
      console.error('Failed to redirect to Spaceship:', error);
      throw error;
    }
  }
}

export const spaceshipService = new SpaceshipService();