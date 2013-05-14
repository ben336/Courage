
(function() {
	var dummyDB = {};

	function addToDB(user) {
		dummyDB[user.id] = user;
		console.log(dummyDB);
		return user;
	}

	function getByID(id) {
		return dummyDB[id];
	}

	exports.addToDB = addToDB;
	exports.getByID = getByID;


}());