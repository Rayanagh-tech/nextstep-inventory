👥 User & Access Control

| Table         | Description                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`user`**    | Contains all system users (e.g., **admin**, **operator**, **viewer**) with support for roles, multi-factor authentication (MFA), last login info, and vSphere access permissions. |
| **`api_key`** | Stores API keys linked to users for **programmatic access**, including permission scopes and expiry time.                                                                         |


🏢 Core Infrastructure

| Table             | Description                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`datacenter`**  | Represents each **physical datacenter** (e.g., Tunis, Sousse, Sfax), storing metadata such as location, timezone, and vCenter API URL. |
| **`server`**      | Tracks **physical servers** within datacenters — including their hostname, specs, and status.                                          |
| **`vm`**          | Represents **virtual machines** running on physical servers, with info like OS, memory, storage, and power state.                      |
| **`storage_bay`** | Catalogs **storage arrays/bays**, showing total and used capacity, as well as operational status.                                      |


🔗 vSphere Integration

| Table                         | Description                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| **`vsphere_connection`**      | Stores credentials and connection info for each datacenter’s **vCenter API**.                           |
| **`datacenter_sync_history`** | Logs each **sync operation** with vCenter, including timestamp, success/failure, and technical details. |

📈 Monitoring & Alerts

| Table                          | Description                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **`monitoring_configuration`** | Specifies **which metrics to monitor** (e.g., CPU, RAM) for each datacenter, with defined thresholds. |
| **`monitoring_threshold`**     | Defines **warning and critical thresholds** for various metrics, and notification preferences.        |
| **`alert_configuration`**      | Manages **alert rules**, severity levels, and **notification channels** (email, SMS, Slack, etc.).    |

🛠️ Maintenance & Security Policies

| Table                       | Description                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| **`maintenance_procedure`** | Step-by-step guides for physical server maintenance (including required tools/resources).     |
| **`maintenance_window`**    | Defines **safe time slots** when maintenance is allowed without affecting production systems. |
| **`security_policy`**       | Lists **security rules** enforced at the datacenter level (e.g., encryption, firewall rules). |


🏷️ Tagging & Metadata

| Table            | Description                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| **`tag`**        | A **catalog of tags** (e.g., `production`, `backup`, `GPU`) used to label infrastructure components.                 |
| **`entity_tag`** | A flexible **tag linking table** that associates tags with any entity (server, VM, storage\_bay) using polymorphism. |


💾 Backup & Networking

| Table                       | Description                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **`backup_policy`**         | Defines backup **retention rules** and scheduling strategies per VM or datacenter.   |
| **`backup_schedule`**       | Tracks scheduled or completed **backup jobs** tied to backup policies.               |
| **`network_configuration`** | Stores network-related settings for each server or VM (IP address, NIC, VLAN, etc.). |


ER diagram :
c:\Users\RAYEN GHARBI\OneDrive\Pictures\Iphone\OneDrive\Desktop\personal-folder\stage 2025\nextstep_inventory_er.png


CREATE TABLE alert (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,                           -- e.g., "vm-monitor", "backup-agent", "kafka"
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  related_entity TEXT,                            -- optional: "vm", "server", "backup", etc.
  related_id UUID,                                -- UUID of the related entity (e.g., VM ID)
  user_id UUID REFERENCES "user"(id) ON DELETE SET NULL, -- who triggered the alert
  created_at TIMESTAMPTZ DEFAULT NOW()
);
