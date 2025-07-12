# 🧠 NextStep Inventory System with VMware vSphere Integration

A full-stack web application to manage and monitor physical servers, virtual machines (VMs), storage bays, and datacenters — with live integration to VMware vSphere.

## 📌 Features

- ✅ Relational PostgreSQL database to store inventory metadata
- ✅ Secure RESTful API built with Node.js & Express
- ✅ JWT-based authentication and role-based access control
- ✅ Modern frontend using React + Tailwind CSS
- ✅ Real-time integration with VMware vSphere API to sync VM and host data
- ✅ Modular, scalable architecture following best practices

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

> 📄 See [`schema.sql`](./schema.sql) for full table definitions

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nextstep-inventory.git
cd nextstep-inventory

