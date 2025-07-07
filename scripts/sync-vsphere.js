const { SmartConnect, Disconnect } = require('pyvmomi');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function syncVSphere() {
    try {
        // Connect to vSphere
        const si = await SmartConnect({
            host: process.env.VSPHERE_HOST,
            user: process.env.VSPHERE_USERNAME,
            password: process.env.VSPHERE_PASSWORD,
            port: 443,
        });

        const content = si.RetrieveContent();
        const rootFolder = content.rootFolder;
        const datacenter = rootFolder.childEntity[0];
        const hostFolder = datacenter.hostFolder;
        const computeResource = hostFolder.childEntity[0];
        const hostSystem = computeResource.host[0];
        const vmFolder = datacenter.vmFolder;
        const vms = vmFolder.childEntity;

        // Sync hosts (physical servers)
        const hostData = {
            datacenter_id: 1, // You'll need to map this to your actual datacenter
            hostname: hostSystem.name,
            ip_address: hostSystem.summary.config.ipAddress,
            cpu_cores: hostSystem.summary.hardware.numCpuCores,
            ram_gb: Math.round(hostSystem.summary.hardware.memorySize / (1024 * 1024 * 1024)),
            model: hostSystem.summary.hardware.model,
            status: hostSystem.summary.runtime.powerState
        };

        await pool.query(
            'INSERT INTO server (datacenter_id, hostname, ip_address, cpu_cores, ram_gb, model, status) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (hostname) DO UPDATE SET ip_address = EXCLUDED.ip_address, cpu_cores = EXCLUDED.cpu_cores, ram_gb = EXCLUDED.ram_gb, model = EXCLUDED.model, status = EXCLUDED.status',
            Object.values(hostData)
        );

        // Sync VMs
        for (const vm of vms) {
            const vmData = {
                server_id: 1, // You'll need to map this to the correct server
                name: vm.name,
                ip_address: vm.summary.guest.ipAddress,
                cpu_cores: vm.config.hardware.numCPU,
                ram_gb: Math.round(vm.config.hardware.memoryMB / 1024),
                status: vm.summary.runtime.powerState
            };

            await pool.query(
                'INSERT INTO vm (server_id, name, ip_address, cpu_cores, ram_gb, status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (name) DO UPDATE SET ip_address = EXCLUDED.ip_address, cpu_cores = EXCLUDED.cpu_cores, ram_gb = EXCLUDED.ram_gb, status = EXCLUDED.status',
                Object.values(vmData)
            );
        }

        console.log('vSphere sync completed successfully');
        await Disconnect(si);
    } catch (error) {
        console.error('Error syncing vSphere:', error);
        throw error;
    }
}

module.exports = syncVSphere;

// If running directly, execute the sync
if (require.main === module) {
    syncVSphere()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Sync failed:', error);
            process.exit(1);
        });
}
