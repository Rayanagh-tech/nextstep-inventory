variable "vsphere_user" {
  description = "vSphere username"
  type        = string
}

variable "vsphere_password" {
  description = "vSphere password"
  type        = string
  sensitive   = true
}

variable "vsphere_server" {
  description = "vSphere server address"
  type        = string
}

variable "datacenter" {
  description = "Name of the datacenter"
  type        = string
  default     = "DC0"
}

variable "cluster" {
  description = "Name of the compute cluster"
  type        = string
  default     = "DC0_C0"
}

variable "datastore" {
  description = "Name of the datastore"
  type        = string
  default     = "LocalDS_0"
}

variable "network" {
  description = "Name of the network"
  type        = string
  default     = "VM Network"
}

variable "vm_name" {
  description = "Name of the virtual machine to be created"
  type        = string
}

variable "cpu" {
  description = "Number of vCPUs for the VM"
  type        = number
  default     = 2
}

variable "memory" {
  description = "Memory in MB for the VM"
  type        = number
  default     = 2048
}

variable "guest_id" {
  description = "Guest OS identifier (e.g., 'otherGuest64')"
  type        = string
  default     = "otherGuest64"
}
