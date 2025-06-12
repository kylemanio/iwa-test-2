let usbDevice

async function connect() {
  try {
    usbDevice = await navigator.usb.requestDevice({
      filters: [], // You can add filters like { vendorId: 0x2341 }
    });

    await usbDevice.open();
    if (usbDevice.configuration === null) {
      await usbDevice.selectConfiguration(1);
    }
    await usbDevice.claimInterface(0); // Most devices use interface 0
    document.getElementById("disconnect-usb").disabled = false;
    console.log(`Connected to ${usbDevice.productName}`);

    readLoop();
  } catch (error) {
    console.log("Error: " + error);
  }
}

async function disconnect() {
  if (usbDevice) {
    await usbDevice.close();
    console.log("Device disconnected");
    document.getElementById("disconnect-usb").disabled = true
    usbDevice = null;
  }
}

async function send(data) {
  if (!usbDevice) {
    console.log("Device not connected");
    return;
  }

  const encoder = new TextEncoder();
  const dataToSend = encoder.encode(data);
  try {
    await usbDevice.transferOut(1, dataToSend); // Endpoint number may vary
    console.log("Sent: " + data);
  } catch (err) {
    console.log("Send error: " + err);
  }
}

async function readLoop() {
  try {
    while (usbDevice && usbDevice.opened) {
      const result = await usbDevice.transferIn(1, 64); // Endpoint and length may vary
      if (result.data) {
        const decoder = new TextDecoder();
        const text = decoder.decode(result.data);
        console.log("Received: " + text);
      }
    }
  } catch (error) {
    console.log("Read error: " + error);
  }
}


document.getElementById("connect-usb").addEventListener("click", connect);
document.getElementById("disconnect-usb").addEventListener("click", disconnect);
document.getElementById("send-usb").addEventListener("click", () => {
  const text = document.getElementById("sendText").value;
  send(text);
});
