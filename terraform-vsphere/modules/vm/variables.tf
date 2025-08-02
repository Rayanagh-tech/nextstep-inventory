variable "vm_name" {
  description = "Name of the virtual machine"
  type        = string
}

variable "cpu" {
  description = "Number of virtual CPUs to allocate to the VM"
  type        = number
  default     = 2
}

variable "memory" {
  description = "Memory (in MB) to allocate to the VM"
  type        = number
  default     = 2048
}

variable "guest_id" {
  description = "Guest OS identifier (e.g., 'otherGuest64' for generic 64-bit OS)"
  type        = string
  default     = "otherGuest64"
}
