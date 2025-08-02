output "vm_name" {
  value = vsphere_virtual_machine.this.name
}

output "vm_ip" {
  value = vsphere_virtual_machine.this.default_ip_address
}
