require('dotenv').config({ path: __dirname + '/../.env' }); // ✅ Explicit env loading

const pool = require('../config/db');
const { execSync } = require('child_process');

// 🧠 Secure decrypt of stored hex password
const decrypt = (hex) => {
  if (!hex) throw new Error("Encrypted password is missing");

  if (Buffer.isBuffer(hex)) {
    hex = hex.toString('hex');
  }

  const clean = hex.startsWith("\\x") ? hex.slice(2) : hex;
  return Buffer.from(clean, "hex").toString();
};

// 🔧 Build GOVC environment variables
const getGovcEnv = (conn) => {
  const decrypted = decrypt(conn.api_password_enc);
  const encode = encodeURIComponent;

  const govcUrl = `https://${encode(conn.api_username)}:${encode(decrypted)}@127.0.0.1:8989/sdk`;
  console.log("🔐 GOVC_URL:", govcUrl);

  return {
    GOVC_URL: govcUrl,
    GOVC_INSECURE: "1",
    GOVC_DATACENTER: "DC0",
  };
};

// 🚀 Run govc CLI and return output
const runGovc = (cmd, env) => {
  try {
    const output = execSync(`govc ${cmd}`, { env: { ...process.env, ...env } });
    return output.toString();
  } catch (err) {
    console.error('govc error:', err.message);
    return null;
  }
};

// 🧩 Parse VM info JSON from govc
const parseVMInfo = (json) => {
  const vm = json?.virtualMachines?.[0];
  if (!vm || !vm.config || !vm.runtime) return null;

  try {
    const memoryMB = vm.config.hardware?.memoryMB ?? 0;
    const memoryGB = Math.round(memoryMB / 1024);
    const vcpu = vm.config.hardware?.numCPU ?? 1;

    return {
      name: vm.name || vm.config.name || "Unnamed",
      uuid: vm.config.uuid,
      os_type: vm.config.guestFullName || "Unknown",
      memory_gb: memoryGB,
      vcpu_count: vcpu,
      power_state: vm.runtime.powerState || "unknown",
    };
  } catch (err) {
    console.error("❌ Error parsing VM info:", err.message);
    return null;
  }
};

// 🔄 Sync VMs from all active connections
exports.syncAllVMs = async () => {
  console.log("🔄 Starting vSphere VM sync...");

  const connections = await pool.query(`SELECT * FROM vsphere_connection WHERE is_active = true`);
  for (const conn of connections.rows) {
    const env = getGovcEnv(conn);
    const datacenterId = conn.datacenter_id;

    const rawList = runGovc("ls /DC0/vm", env);
    if (!rawList) continue;

    const vmPaths = rawList.trim().split('\n');

    for (const path of vmPaths) {
      const raw = runGovc(`vm.info -json "${path}"`, env);
      if (!raw) {
        console.error(`❌ No output from govc for VM path: ${path}`);
        continue;
      }

      try {
        const parsed = JSON.parse(raw);
        const data = parseVMInfo(parsed);

        if (!data || !data.uuid) {
          console.error(`❌ Skipped VM due to invalid data at path: ${path}`);
          continue;
        }

        await pool.query(
          `
          INSERT INTO vm (name, vsphere_id, os_type, memory_gb, vcpu_count, power_state, datacenter_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (vsphere_id) DO UPDATE SET
            name = EXCLUDED.name,
            os_type = EXCLUDED.os_type,
            memory_gb = EXCLUDED.memory_gb,
            vcpu_count = EXCLUDED.vcpu_count,
            power_state = EXCLUDED.power_state,
            datacenter_id = EXCLUDED.datacenter_id
          `,
          [
            data.name,
            data.uuid,
            data.os_type,
            data.memory_gb,
            data.vcpu_count,
            data.power_state,
            datacenterId,
          ]
        );

        console.log(`✅ Synced VM: ${data.name}`);
      } catch (err) {
        console.error(`❌ Failed to parse/sync VM from path: ${path}`);
        console.error(err.message);
      }
    }
  }

  console.log("✅ VM sync complete.");
};
