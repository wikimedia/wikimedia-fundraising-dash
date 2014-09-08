module.exports = function(sequelize, Seq) {
    var PaymentsFraud = sequelize.define('PaymentsFraud', {
        id:                         Seq.INTEGER,
        contribution_tracking_id:   Seq.INTEGER,
        gateway:                    Seq.STRING,
        order_id:                   Seq.INTEGER,
        validation_action:          Seq.STRING,
        user_ip:                    Seq.INTEGER,
        payment_method:             Seq.STRING,
        risk_score:                 Seq.DECIMAL,
        server:                     Seq.STRING,
        date:                       Seq.DATE
    });

    return PaymentsFraud;
};