let device = null;
let dataString = "AA00810401031805840818058104025801F4"

async function connectToHIDDevice() {
    try {
        const devices = await navigator.hid.requestDevice({
            filters: [
            // You can specify vendorId/productId here, or leave it open
            // { vendorId: 0x1234, productId: 0x5678 }
            ]
        });

        if (devices.length === 0) {
            console.log('No devices selected.');
            return;
        }

        device = devices[0];

        await device.open();
        console.log(`Connected to: ${device.productName}`);

        document.getElementById('disconnect-webhid').disabled = false;


        device.addEventListener("inputreport", (event) => {
            const { data, reportId } = event;
            const values = [];

            for (let i = 0; i < data.byteLength; i++) {
            values.push(data.getUint8(i));
            }

            console.log(`Report ${reportId} received:`, values);
        });

        const reportId = 0; // depends on your device
        // const data = new Uint8Array(dataString); // example data
        const data = new TextEncoder().encode(dataString); // example data
        await device.sendReport(reportId, data);
        console.log("Report sent:", data);

    } catch (error) {
        console.error("WebHID Error:", error);
    }
}

async function disconnectFromHIDDevice() {
    if (device && device.opened) {
        try {
            await device.close();
            console.log(`Disconnected from: ${device.productName}`);
            document.getElementById('disconnect-webhid').disabled = true;
        } catch (error) {
            console.error("WebHID Disconnection Error:", error);
        }
    } else {
        console.log("No device connected.");
    }
}

document.getElementById('connect-webhid').addEventListener('click', connectToHIDDevice);
document.getElementById('disconnect-webhid').addEventListener('click', disconnectFromHIDDevice);

navigator.hid.addEventListener("disconnect", (event) => {
  console.log(`HID disconnected: ${event.device.productName}`);
  console.dir(event);
});