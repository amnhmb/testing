import { saveInvoice, getInvoices, getClients } from '../src/services/storage.js';

// Mock localStorage if running in Node
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => null,
  };
}

const runTest = async () => {
  try {
    console.log("Running saveInvoice test...");
    const invoice = {
      client_name: "Hambali Test",
      client_phone: "01125507190",
      job_name: "Test Job",
      date: "2026-07-30",
      items: [],
      subtotal: 0,
      discount_type: "per_pcs",
      discount_value: 0,
      grand_total: 0,
      deposit: 0,
      balance: 0,
      status: "Unpaid",
      notes: ""
    };
    const res = await saveInvoice(invoice);
    console.log("Save successful:", res);
  } catch (e) {
    console.error("Save failed with error:", e);
  }
};

runTest();
