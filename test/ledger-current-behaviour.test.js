'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const ledger = require('../lib/ledger');

test('string settlement amount is added numerically to totalSettled', function () {
  const customer = {
    id: 7,
    name: 'Asha Stores',
    openingBalance: 0,
    totalBilled: 100,
    totalSettled: 0
  };
  const db = { customers: [customer], nextSettlementId: 1, settlements: [] };

  const result = ledger.recordSettlement(db, 7, '25', 'upi', 'part payment');

  assert.equal(result.ok, true);
  assert.equal(result.settlement.amount, 25);
  assert.equal(customer.totalSettled, 25);
  assert.equal(customer.balance, 75);
  assert.equal(ledger.listCustomers(db)[0].balance, 75);
});

test('successive string settlements accumulate as numbers', function () {
  const customer = {
    id: 8,
    name: 'Meera Traders',
    openingBalance: 0,
    totalBilled: 100,
    totalSettled: 25
  };
  const db = { customers: [customer], nextSettlementId: 2, settlements: [] };

  const result = ledger.recordSettlement(db, 8, '5', 'cash');

  assert.equal(result.ok, true);
  assert.equal(customer.totalSettled, 30);
  assert.equal(customer.balance, 70);
  assert.equal(ledger.listCustomers(db)[0].balance, 70);
});
