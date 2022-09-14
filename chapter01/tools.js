module.exports = {
    statementData: function (invoice, plays) {
        let data = {};

        data.customer = invoice.customer;
        data.totalAmount = module.exports.usd(module.exports.totalAmount(invoice, plays));
        data.totalCredits = module.exports.totalCredits(invoice, plays);
        return data;
    },
    totalAmount: function (invoice, plays) {
        let amount = 0;

        for (let perf of invoice.performances) {
            amount += module.exports.amountFor(module.exports.playFor(plays, perf), perf)
        }

        return amount
    },
    totalCredits: function (invoice, plays) {
        let credits = 0;

        for (let perf of invoice.performances) {
            credits += module.exports.volumeCreditsFor(perf, plays)
        }

        return credits
    },
    volumeCreditsFor: function (performance, plays) {
        let credits = 0;

        credits += Math.max(performance.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === module.exports.playFor(plays, performance).type) {
            credits += Math.floor(performance.audience / 5);
        }

        return credits;
    },
    playFor: function (plays, performance) {
        return plays[performance.playID];
    },
    usd: function (aNumber) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(aNumber / 100);
    },
    amountFor: function (play, performance) {
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
}
