export interface Datacenter {
    id: string;
    name: string;
    location: string;
    vcenter_api_url?: string;
    api_url: string;
    description?: string;
    timezone?: string;
    vcenter_fqdn?: string;
    vcenter_version?: string;
    last_sync_status?: string;
    last_sync_time?: string;
    tags?: string[]; // assuming it's stored as an array of strings
  }


  // ✅ DTO for creating a datacenter
export interface DatacenterCreateDto {
  name: string;
  location: string;
  vcenter_api_url?: string;
  description?: string;
  timezone?: string;
}

// ✅ DTO for updating a datacenter
export interface DatacenterUpdateDto {
  name?: string;
  location?: string;
  vcenter_api_url?: string;
  description?: string;
  timezone?: string;
}

  