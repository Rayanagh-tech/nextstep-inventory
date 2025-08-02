# 🧠 NextStep Inventory System with VMware vSphere Integration

A full-stack web application to manage and monitor physical servers, virtual machines (VMs), storage bays, and datacenters — with live integration to VMware vSphere and automated infrastructure preparation using Terraform.

## 📌 Features

- ✅ Relational PostgreSQL database to store inventory metadata
- ✅ Secure RESTful API built with Node.js & Express
- ✅ JWT-based authentication and role-based access control
- ✅ Zustand for global state management
- ✅ Modern frontend using React + Tailwind CSS
- ✅ Real-time integration with VMware vSphere API to sync VM and host data
- ✅ Full CRUD for servers, VMs, datacenters, vSphere connections, storage bays, and tags
- ✅ Role-based UI controls (admin vs. user permissions)
- ✅ Dynamic dashboards for monitoring KPIs and trends
---

## 🗂️ Project Structure

nextstep-inventory/
├── backend/ # Express API for managing inventory data
│ ├── controllers/
│ ├── db/
│    └── schema.sql # Database schema (PostgreSQL)
│ ├── routes/
│ ├── services/
│ ├── middleware/
│ └── models/
├── frontend/ # React + Tailwind frontend interface
│ ├── components/
│ ├── pages/
│ ├── store/ # Zustand state management
│ └── types/
├── integration/ # Scripts to connect and sync with vSphere API





---

## 🧱 Database Schema (PostgreSQL)

The core relational schema consists of:

- `data_centers`: Tracks all physical locations
- `physical_servers`: Metadata for each server (CPU, RAM, status)
- `virtual_machines`: VM configurations and states
- `storage_bays`: Storage infrastructure per datacenter
- `vsphere_connections`: Credentials and sync logs for vSphere integration
- `vmware_events`: Event history for VMs (snapshots, migrations, etc.)
- `tags`, `monitoring_logs`, `alerts`, and more


> 📄 See [`schema.sql`](./schema.sql) for full table definitions

---
##🧩 VMware vSphere Integration

This project supports real-time sync with VMware vSphere using govc, a CLI tool for interacting with vSphere.

###🔧 How It Works

  -Users add vSphere connections via the Settings → vSphere Connections page in the frontend.

  -These connections (hostnames, credentials) are stored in the vsphere_connections table.

  -The backend script integration/syncVsphere.js uses govc to: Connect to each vSphere instance

  -Fetch live virtual machine and host data

  -Insert or update entries in virtual_machines and physical_servers tables

  
## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nextstep-inventory.git
cd nextstep-inventory
