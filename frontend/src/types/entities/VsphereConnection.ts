export interface VsphereConnection {
    id: string;
    datacenter_id: string;
    api_username: string;
    api_version: string | null;
    is_active: boolean;
    last_used: string | null;
    created_at: string;
    updated_at?: string;
    last_used_by?: string;
    tags?: string[];
    datacenter_name?: string;
  }
  export interface VSphereConnectionCreate {
    datacenter_id: string;
    api_username: string;
    api_password: string;
    api_version?: string;
    api_url: string; // ✅ Add this for testing the connection
    tags?: string[];

  }
  
  export interface VSphereConnectionUpdate {
    api_username?: string;
    api_password?: string;
    api_version?: string;
    is_active?: boolean;
    last_used_by?: string;
    tags?: string[];
  }
  
  export interface ConnectionTestResult {
    success: boolean;
    status: string;
    message: string;
    api_version: string;
    tags: string[];
  }
  