module.exports = function(sequelize, Seq) {
    var PaymentsFraudBreakdown = sequelize.define('PaymentsFraudBreakdown', {
        id:                         Seq.INTEGER,
        payments_fraud_id:          Seq.INTEGER,
        filter_name:                Seq.STRING,
        risk_score:                 Seq.DECIMAL,
    });

    return PaymentsFraudBreakdown;
};