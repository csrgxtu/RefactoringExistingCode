const fs = require('fs');
const assert = require('assert');

function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;

    for (let perf of invoice.performances) {
        // print line for this order
        result += ` ${playFor(plays, perf).name}: ${usd(amountFor(playFor(plays, perf), perf))} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount(invoice, plays))}\n`;
    result += `You earned ${totalCredits(invoice, plays)} credits\n`;
    return result;
}


function totalAmount(invoice, plays) {
    let amount = 0;

    for (let perf of invoice.performances) {
        amount += amountFor(playFor(plays, perf), perf)
    }

    return amount
}

function totalCredits(invoice, plays) {
    let credits = 0;

    for (let perf of invoice.performances) {
        credits += volumeCreditsFor(perf, plays)
    }

    return credits
}


function volumeCreditsFor(performance, plays) {
    let credits = 0;

    credits += Math.max(performance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(plays, performance).type) {
        credits += Math.floor(performance.audience / 5);
    }

    return credits;
}

function playFor(plays, performance) {
    return plays[performance.playID];
}

function amountFor(play, performance) {
    let amount = 0;
    switch (play.type) {
        case "tragedy":
            amount = 40000;
            if (performance.audience > 30) {
                amount += 1000 * (performance.audience - 30);
            }
            break;
        case "comedy":
            amount = 30000;
            if (performance.audience > 20) {
                amount += 10000 + 500 * (performance.audience - 20);
            }
            amount += 300 * performance.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return amount;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
}


// load the play & invoice json
plays = JSON.parse(fs.readFileSync('./play.json'))
invoices = JSON.parse(fs.readFileSync('./invoices.json'))

bill = statement(invoices[0], plays)
expected_bill = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`;
assert.equal(bill, expected_bill);
console.log(bill);