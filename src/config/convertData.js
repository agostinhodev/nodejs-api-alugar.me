module.exports = function convertData(date) {	

    let dateArr = date.split("/");
    let dateFormatted = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    return dateFormatted;
	
};
