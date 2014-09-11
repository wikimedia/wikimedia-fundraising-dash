exports.data = function(req, res){
  res.send(Math.random() * 100 + "");
};

exports.metadata = function(req, res){
  res.json({
	"name": "fraud",
	"filters": [
		{
		  "column" : "currency_code",
		  "display" : "Currency",
		  "type" : "dropdown",
		  "values" : ["USD", "EUR", "GBP", "JPY"]
		},
		{
		  "column" : "ct.referrer",
		  "display": "Referrer",
		  "type": "text"
		},
		{
		  "date" : "i.date",
		  "display": "Date",
		  "type": "datetime",
		  "min": "2005-01-01",
		  "max": "2099-12-31"
		},
		{
		  "column" : "i.amount",
		  "display": "Amount",
		  "type": "number",
		  "min": 0,
		  "max": 10000
		}
	]
  });
};
