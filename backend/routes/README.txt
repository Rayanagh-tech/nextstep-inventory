🔐 Auth Routes (authController.js)

| Method | Path                 | Description                | Access |
| ------ | -------------------- | -------------------------- | ------ |
| POST   | `/api/auth/register` | Register a new user        | Public |
| POST   | `/api/auth/login`    | Login and return JWT token | Public |


👤 User Routes (userController.js)

| Method | Path             | Description               | Access     |
| ------ | ---------------- | ------------------------- | ---------- |
| GET    | `/api/users`     | Get all users             | Admin      |
| GET    | `/api/users/:id` | Get a specific user by ID | Admin/User |
| POST   | `/api/users`     | Create a new user         | Admin      |
| PUT    | `/api/users/:id` | Update user info          | Admin/User |
| DELETE | `/api/users/:id` | Delete a user             | Admin      |

🏢 Datacenter Routes (datacenterController.js)

| Method | Path                   | Description           | Access        |
| ------ | ---------------------- | --------------------- | ------------- |
| GET    | `/api/datacenters`     | Get all datacenters   | Authenticated |
| GET    | `/api/datacenters/:id` | Get datacenter by ID  | Authenticated |
| POST   | `/api/datacenters`     | Create new datacenter | Admin         |
| PUT    | `/api/datacenters/:id` | Update datacenter     | Admin         |
| DELETE | `/api/datacenters/:id` | Delete datacenter     | Admin         |

🖥️ Server Routes (serverController.js)

| Method | Path               | Description              | Access        |
| ------ | ------------------ | ------------------------ | ------------- |
| GET    | `/api/servers`     | Get all physical servers | Authenticated |
| GET    | `/api/servers/:id` | Get server by ID         | Authenticated |
| POST   | `/api/servers`     | Create new server        | Admin         |
| PUT    | `/api/servers/:id` | Update a server          | Admin         |
| DELETE | `/api/servers/:id` | Delete a server          | Admin         |

💾 Storage Bay Routes (storageController.js)

| Method | Path                    | Description              | Access        |
| ------ | ----------------------- | ------------------------ | ------------- |
| GET    | `/api/storage-bays`     | Get all storage bays     | Authenticated |
| GET    | `/api/storage-bays/:id` | Get storage bay by ID    | Authenticated |
| POST   | `/api/storage-bays`     | Create a new storage bay | Admin         |
| PUT    | `/api/storage-bays/:id` | Update a storage bay     | Admin         |
| DELETE | `/api/storage-bays/:id` | Delete a storage bay     | Admin         |

📦 Backup Policy Routes (backupPolicyController.js)

| Method | Path                       | Description             | Access        |
| ------ | -------------------------- | ----------------------- | ------------- |
| GET    | `/api/backup-policies`     | Get all backup policies | Authenticated |
| GET    | `/api/backup-policies/:id` | Get backup policy by ID | Authenticated |
| POST   | `/api/backup-policies`     | Create a backup policy  | Admin         |
| PUT    | `/api/backup-policies/:id` | Update a backup policy  | Admin         |
| DELETE | `/api/backup-policies/:id` | Delete a backup policy  | Admin         |

📊 Monitoring Configuration Routes (monitoringController.js)

| Method | Path                          | Description                  | Access        |
| ------ | ----------------------------- | ---------------------------- | ------------- |
| GET    | `/api/monitoring-configs`     | Get all monitoring configs   | Authenticated |
| GET    | `/api/monitoring-configs/:id` | Get monitoring config by ID  | Authenticated |
| POST   | `/api/monitoring-configs`     | Create new monitoring config | Admin         |
| PUT    | `/api/monitoring-configs/:id` | Update monitoring config     | Admin         |
| DELETE | `/api/monitoring-configs/:id` | Delete monitoring config     | Admin         |

⚠️ Alert Configuration Routes (alertController.js)

| Method | Path              | Description                      | Access        |
| ------ | ----------------- | -------------------------------- | ------------- |
| GET    | `/api/alerts`     | Get all alert configurations     | Authenticated |
| POST   | `/api/alerts`     | Create a new alert configuration | Admin         |
| PUT    | `/api/alerts/:id` | Update alert configuration       | Admin         |
| DELETE | `/api/alerts/:id` | Delete alert configuration       | Admin         |

📘 Audit Log Routes (auditLogController.js)

| Method | Path              | Description                           | Access |
| ------ | ----------------- | ------------------------------------- | ------ |
| GET    | `/api/audit-logs` | Get audit logs (filtered & paginated) | Admin  |

🏷️ Tag Routes (tagController.js)

| Method | Path            | Description      | Access        |
| ------ | --------------- | ---------------- | ------------- |
| GET    | `/api/tags`     | Get all tags     | Authenticated |
| POST   | `/api/tags`     | Create a new tag | Admin         |
| PUT    | `/api/tags/:id` | Update a tag     | Admin         |
| DELETE | `/api/tags/:id` | Delete a tag     | Admin         |

💻 Virtual Machine Routes (vmController.js)

| Method | Path           | Description    | Access        |
| ------ | -------------- | -------------- | ------------- |
| GET    | `/api/vms`     | Get all VMs    | Authenticated |
| GET    | `/api/vms/:id` | Get a VM by ID | Authenticated |
| POST   | `/api/vms`     | Create new VM  | Admin         |
| PUT    | `/api/vms/:id` | Update VM      | Admin         |
| DELETE | `/api/vms/:id` | Delete VM      | Admin         |

🧪 vSphere Connection Routes (vsphereController.js)

| Method | Path                | Description                      | Access        |
| ------ | ------------------- | -------------------------------- | ------------- |
| GET    | `/api/vsphere`      | Get all vSphere connections      | Authenticated |
| POST   | `/api/vsphere/test` | Simulate/test vCenter connection | Authenticated |
| POST   | `/api/vsphere`      | Create new connection            | Admin         |
| PUT    | `/api/vsphere/:id`  | Update a vSphere connection      | Admin         |

