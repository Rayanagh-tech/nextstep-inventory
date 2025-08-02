# 🧠 NextStep Inventory System with VMware vSphere Integration

A full-stack web application to manage and monitor physical servers, virtual machines (VMs), storage bays, and datacenters — with live integration to VMware vSphere and automated infrastructure preparation using Terraform.

## 📌 Features

- ✅ Relational PostgreSQL database to store inventory metadata
- ✅ Secure RESTful API built with Node.js & Express
- ✅ JWT-based authentication and role-based access control
- ✅ Zustand for global state management
- ✅ Modern frontend using React + Tailwind CSS
- ✅ **Live sync with VMware vSphere** using govc CLI
- ✅ **Infrastructure provisioning with Terraform** modules
- ✅ Full CRUD for servers, VMs, datacenters, vSphere connections, storage bays, and tags
- ✅ Role-based UI (admin vs. user permissions)
- ✅ Realtime dashboard with KPIs and trend charts

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

├── terraform-vsphere/ # Infrastructure as Code (Terraform)
│ ├── main.tf
│ ├── variables.tf
│ ├── provider.tf
│ └── modules/
│ └── vm/ # Reusable VM module
├── .env # Backend config





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
## 🧩 vSphere Integration

This project supports **live synchronization with VMware vSphere** using [`govc`](https://github.com/vmware/govmomi/tree/main/govc), a CLI for vSphere automation.

### 🔧 How It Works

- Users add vSphere credentials from **Settings → vSphere Connections**
- Connections are stored in the `vsphere_connections` table
- The backend script (`backend/vsphereSync.js`) uses `govc` to:
  - Connect to vSphere instances
  - Fetch VM and server info
  - Sync into `virtual_machines` and `physical_servers` tables

🕒 You can schedule this sync using `cron` or integrate it into CI/CD pipelines.

---

## ⚙️ Terraform Automation

The [`terraform-vsphere`](./terraform-vsphere/) folder automates VM provisioning via vSphere.

### 🧾 Features

- Modular VM creation via `modules/vm`
- Variables for CPU, memory, network, datastore, and more
- Integration with existing datacenter and resource pool

### 🚀 Usage

```bash
cd terraform-vsphere

# 1. Initialize Terraform
terraform init

# 2. Apply the infrastructure
terraform apply -auto-approve
## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nextstep-inventory.git
cd nextstep-inventory
