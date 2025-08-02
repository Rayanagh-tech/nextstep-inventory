##############################
# Data Sources
##############################

# Retrieve datacenter
data "vsphere_datacenter" "dc" {
  name = "DC0"
}

# Retrieve compute cluster
data "vsphere_compute_cluster" "cluster" {
  name          = "DC0_C0"
  datacenter_id = data.vsphere_datacenter.dc.id
}

# Retrieve datastore
data "vsphere_datastore" "datastore" {
  name          = "LocalDS_0"
  datacenter_id = data.vsphere_datacenter.dc.id
}

# Retrieve network
data "vsphere_network" "network" {
  name          = "VM Network"
  datacenter_id = data.vsphere_datacenter.dc.id
}

# Retrieve the base VM to clone (can be powered-off, doesn't have to be a real "template" in vcsim)
data "vsphere_virtual_machine" "template" {
  name          = "base-template"
  datacenter_id = data.vsphere_datacenter.dc.id
}


##############################
# Virtual Machine Resource
##############################

resource "vsphere_virtual_machine" "this" {
  name             = var.vm_name
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  datastore_id     = data.vsphere_datastore.datastore.id

  num_cpus = var.cpu
  memory   = var.memory
  guest_id = var.guest_id  # Should be "otherGuest64" if using base-template created manually

  wait_for_guest_net_timeout = 0
  wait_for_guest_ip_timeout  = 0

  clone {
    template_uuid = data.vsphere_virtual_machine.template.id
  }

  network_interface {
    network_id   = data.vsphere_network.network.id
    adapter_type = "vmxnet3"
  }

  disk {
    label            = "disk0"
    size             = 10
    thin_provisioned = true
  }

  lifecycle {
    ignore_changes = [annotation]
  }
}
