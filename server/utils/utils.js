module.exports = {
    isNightTime(date){
        var dateToTest = date;
        if (!dateToTest){
            dateToTest = new Date();
        }
        var hourToTest = dateToTest.getHours();
        var minHourNight = parseInt(process.env.MIN_HOUR_NIGHT);
        var maxHourNight = parseInt(process.env.MAX_HOUR_NIGHT);
        
        if (minHourNight > maxHourNight){            
            if (hourToTest > minHourNight && hourToTest < 24) return true;
            else if (hourToTest < maxHourNight && hourToTest > 0) return true;
            else return false;
        }
        else {
            if (hourToTest > minHourNight && hourToTest < maxHourNight) return true;
            else return false;
        }
    }
}