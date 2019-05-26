var distance = require('google-distance-matrix');
 
//var origins = ['San Francisco CA', '40.7421,-73.9914'];
//var destinations = ['New York NY', 'Montreal', '41.8337329,-87.7321554', 'Honolulu'];
 
distance.key(process.env.GOOGLE_API_KEY);

module.exports = {
    getDistance(origin, destination){
        // console.log(origin);
        // console.log(destination);
        var origins = ['40.7421,-73.9914',];
        var destinations = ['41.8337329,-87.7321554',];

        distance.matrix(origins, destinations, function (err, distances) {
            if (err) {
                return console.log(err);
            }
            if(!distances) {
                return console.log('no distances');
            }
            if (distances.status == 'OK') {
                var origin = distances.origin_addresses[0];
                var destination = distances.destination_addresses[0];
                console.log(distances.rows[0].elements[0].status);
                if (distances.rows[0].elements[0].status == 'OK') {
                    console.log(distances.rows[0].elements[0]);
                    return distances.rows[0].elements[0];
                }else {
                    console.log(destination + ' is not reachable by land from ' + origin);
                }
            }
        });
    }
}
