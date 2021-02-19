
export const queryGetFlightById = () => {
    let query = `SELECT f.id, f.origin, f.destination, f.airline, f.departing `;
    query += `FROM dbo.flight f `;
    query += `WHERE f.id= @flightId`;

    return query;
};

/** 
export const queryGetFlightById = (flightId) => {
    let query = `SELECT f.id, f.origin, f.destination, f.airline, f.departing `;
    query += `FROM dbo.flight f `;
    query += `WHERE f.id= '${flightId}'`;

    return query;
};
*/
