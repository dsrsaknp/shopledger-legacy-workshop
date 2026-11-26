'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const inventory = require('../lib/inventory');
const orders = require('../lib/orders');

test('inventory check allows selling exactly the last sellable unit', function () {
  const products = [{ id: 7, name: 'Tea', stock: 1, reserved: 0 }];
  const items = [{ id: 7, qty: 1 }];

  assert.deepEqual(inventory.check(products, items), { ok: true });
  assert.equal(inventory.getSellableStock(products[0]), 1);
});

test('cancelling an order restores its sold quantity to stock', function () {
  const product = { id: 7, name: 'Tea', stock: 2, reserved: 0 };
  const order = {
    id: 1001,
    status: 'completed',
    paymentMode: 'cash',
    items: [{ id: 7, name: 'Tea', qty: 1 }]
  };
  const db = { products: [product], orders: [order] };

  // This matches checkout: committed quantities are removed from physical stock.
  inventory.reserve(db.products, order.items);
  assert.equal(product.stock, 1);

  const result = orders.cancel(db, order.id, 'Customer changed mind');

  assert.equal(result.ok, true);
  assert.equal(order.status, 'cancelled');
  assert.equal(order.cancelReason, 'Customer changed mind');
  assert.equal(product.stock, 2);
  assert.equal(product.reserved, 0);
});
