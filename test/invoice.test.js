'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const pricing = require('../lib/pricing');
const invoice = require('../lib/invoice');

test('invoice matches billing HSN tax, discount, and totals', function () {
  // Plain in-memory order fixture. Do not load the store or data/db.json here.
  const items = [{ id: 5, name: 'Cold-Pressed Groundnut Oil 5L', hsn: '1508', price: 1120, qty: 2 }];
  const billed = pricing.computeTotals(items, 'SAVE10');
  const invoiced = invoice.computeInvoiceFigures({ items: items, coupon: 'SAVE10' });

  assert.deepEqual(
    { subtotal: billed.subtotal, discount: billed.discount, tax: billed.tax, total: billed.total },
    { subtotal: 2240, discount: 150, tax: 104.5, total: 2194.5 }
  );
  assert.deepEqual(
    { subtotal: invoiced.subtotal, discount: invoiced.discount, tax: invoiced.tax, total: invoiced.total },
    { subtotal: billed.subtotal, discount: billed.discount, tax: billed.tax, total: billed.total }
  );
  assert.equal(invoiced.rows[0].gstPercent, 5);
  assert.equal(invoiced.rows[0].lineTax, 104.5);
});

test('invoice does not show a reconciliation notice when it matches the billed total', function () {
  const order = {
    id: 1004,
    items: [{ id: 5, name: 'Cold-Pressed Groundnut Oil 5L', hsn: '1508', price: 1120, qty: 2 }],
    coupon: 'SAVE10',
    total: 2194.5
  };

  const html = invoice.render(order);

  assert.doesNotMatch(html, /Accountant Reconciliation Notice/);
  assert.match(html, /Invoice Total<\/td><td class="r">₹2194\.50/);
});
