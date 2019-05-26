var distance = require('google-distance-matrix');
 
distance.key(process.env.GOOGLE_API_KEY);

module.exports = {
    getDistance(origin, destination){
        var origins = ['40.7421,-73.9914',];
        var destinations = ['41.8337329,-87.7321554',];
        return new Promise(function(resolve, reject){
            distance.matrix(origins, destinations, function (err, distances) {
                if (err) {
                    reject(err);
                }
                if(!distances) {
                    reject(new Error('no distances'));
                }
                if (distances.status == 'OK') {
                    var origin = distances.origin_addresses[0];
                    var destination = distances.destination_addresses[0];
                    console.log(distances.rows[0].elements[0].status);
                    if (distances.rows[0].elements[0].status == 'OK') {
                        resolve(distances.rows[0].elements[0]);
                    }else {
                        reject(new Error('destination not reachable'));
                    }
                }
            })
        });
    }
}
