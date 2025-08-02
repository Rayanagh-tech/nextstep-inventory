
##############################
# Data Sources
##############################

data "vsphere_datacenter" "dc" {
  name = var.datacenter
}

data "vsphere_compute_cluster" "cluster" {
  name          = var.cluster
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_datastore" "datastore" {
  name          = var.datastore
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_network" "network" {
  name          = var.network
  datacenter_id = data.vsphere_datacenter.dc.id
}

##############################
# VM Module Call
##############################

module "nextstep_demo_vm" {
  source   = "./modules/vm"
  vm_name  = var.vm_name
  cpu      = var.cpu
  memory   = var.memory
  guest_id = var.guest_id
}

