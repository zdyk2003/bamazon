var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_DB"
});

connection.connect(function(err) {
	if(err) throw err;
	// console.log("connected as id " + connection.threadId + "\n");
	buyProducts();	
});

function buyProducts() {
	console.log("Here are all our products...\n");
	connection.query("SELECT * FROM products", function(err, res) {
	    if (err) throw err;
	    for(var i = 0; i < res.length; i++) {
	    	console.log('ID: ' + res[i].id + '\nProduct: ' + res[i].product_name + '\nPrice: ' + res[i].price + '\n====================');	    	
	    }
	    inquirer.prompt([
	    {
	    	name: 'product',
	    	type: 'list',
	    	choices: function() {
	    		var choiceArray = [];
	    		for(var i = 0; i < res.length; i++) {
	    			choiceArray.push(res[i].product_name);
	    		}
	    		return choiceArray;
	    	},
	    	message: 'What would like to buy?'
	    },
	    {
    		name: 'unit',
    		type: 'input',
    		message: 'How many would you like to buy?'
	    }
	    ]).then(function(answers) {
	    	var chosenItem;
	    	for(var i = 0; i < res.length; i++) {
				if(res[i].product_name === answers.product) {
					chosenItem = res[i];
				}
			}
			if(chosenItem.stock_quantity < (answers.unit)) {
				console.log("Sorry, there is an insufficient quantity");
			}
			else {
				totalPrice(chosenItem.stock_quantity, answers.unit, answers.product);	
			}
				setTimeout(function() {
					buyProducts();
					}, 4000);	
	    });    
	});
}
function totalPrice(stock_quantity, unit, product, price) {
	// console.log("UPDATE products SET stock_quantity = " + (stock_quantity - unit) + " WHERE product_name = " + product + price);
	connection.query("UPDATE products SET stock_quantity = " + (stock_quantity - unit) + " WHERE product_name = '" + product + "'", function(err,res){
		if (err) {
			console.log(err);
			throw err;
		}
		else {
		connection.query("SELECT price FROM products = '" + product + "'", function(err,res) {
		var chosenItem = product;
		var itemPrice;
		console.log(chosenItem);
//** the math for this is wrong, need to fix this
		console.log("Your total is $ " + (chosenItem.price * unit));		
	   	console.log("Your order is on it's way!");
	    })
		}
	});
}

