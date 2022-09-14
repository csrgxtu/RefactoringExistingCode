const fs = require('fs');
const assert = require('assert');
const tools = require('./tools');

function statement(data, invoice, plays) {
    let result = `Statement for ${data.customer}\n`;

    for (let perf of invoice.performances) {
        // print line for this order
        result += ` ${tools.playFor(plays, perf).name}: ${tools.usd(tools.amountFor(tools.playFor(plays, perf), perf))} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${data.totalAmount}\n`;
    result += `You earned ${data.totalCredits} credits\n`;
    return result;
}

function htmlStatement(data, invoice, plays) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;

    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n";
    for (let perf of invoice.performances) {
        result += `  <tr><td>${tools.playFor(plays, perf).name}</td><td>${perf.audience}</td>`;
        result += `<td>${tools.usd(tools.amountFor(tools.playFor(plays, perf), perf))}</td>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${data.totalAmount}</em></p>\n`;
    result += `<p>You earned <em>${data.totalCredits}</em></p>\n`;

    return result;
}


// load the play & invoice json
plays = JSON.parse(fs.readFileSync('./play.json'));
invoices = JSON.parse(fs.readFileSync('./invoices.json'));

data = tools.statementData(invoices[0], plays);

bill = statement(data, invoices[0], plays)
expected_bill = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`;
assert.equal(bill, expected_bill);
console.log(bill);

htmlBill = htmlStatement(data, invoices[0], plays);
console.log(htmlBill);
