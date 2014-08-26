module.exports = function(sequelize, Seq) {
    var PaymentsInitial = sequelize.define('PaymentsInitial', {
        id:                         Seq.INTEGER,
        contribution_tracking_id:   Seq.INTEGER,
        gateway:                    Seq.STRING,
        order_id:                   Seq.INTEGER,
        gateway_txn_id:             Seq.INTEGER,
        validation_action:          Seq.STRING,
        payments_final_status:      Seq.STRING,
        payment_method:             Seq.STRING,
        payment_submethod:          Seq.STRING,
        country:                    Seq.STRING,
        amount:                     Seq.INTEGER,
        currency_code:              Seq.DECIMAL,
        server:                     Seq.STRING,
        date:                       Seq.DATE
    });

    return PaymentsInitial;
};
