'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const orders = require('../lib/orders');

test('order history sorts DD/MM/YYYY dates newest first chronologically', function () {
  const db = {
    orders: [
      { id: 1, date: '31/12/2023' },
      { id: 2, date: '01/01/2024' },
      { id: 3, date: '15/06/2024' }
    ]
  };

  assert.deepEqual(orders.list(db).map(function (order) { return order.id; }), [3, 2, 1]);
});

test('order history date range includes only dates inside the inclusive HTML date range', function () {
  const db = {
    orders: [
      { id: 1, date: '05/02/2024' },
      { id: 2, date: '05/03/2024' },
      { id: 3, date: '25/04/2024' }
    ]
  };

  assert.deepEqual(
    orders.list(db, { from: '2024-02-01', to: '2024-02-20' }).map(function (order) { return order.id; }),
    [1]
  );
});

test('order history keeps original order when dates are identical', function () {
  const db = {
    orders: [
      { id: 1, date: '10/04/2024' },
      { id: 2, date: '10/04/2024' },
      { id: 3, date: '10/04/2024' }
    ]
  };

  assert.deepEqual(orders.list(db).map(function (order) { return order.id; }), [1, 2, 3]);
});
