'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const reports = require('../lib/reports');

test('GST audit matches the ledger for a capped SAVE10 order with a 5% HSN slab', function () {
  // In-memory copy of the order shown in the audit screen; never load data/db.json.
  const order = {
    id: 1004,
    date: '30/01/2022',
    customer: 'Kalyani Foods (Wholesale)',
    coupon: 'SAVE10',
    items: [{ id: 5, name: 'Cold-Pressed Groundnut Oil 5L', hsn: '1508', price: 1120, qty: 2 }],
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    total: 2194.5
  };

  const audit = reports.getGstReconciliation({ orders: [order] });

  assert.equal(audit.totalChecked, 1);
  assert.equal(audit.mismatchCount, 0);
  assert.equal(audit.totalDelta, 0);
  assert.equal(audit.rows[0].matched, true);
  assert.equal(audit.rows[0].invoiceDiscount, 150);
  assert.equal(audit.rows[0].invoiceTax, 104.5);
  assert.equal(audit.rows[0].invoiceTotal, 2194.5);
});
