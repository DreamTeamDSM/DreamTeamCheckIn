import { loadDatabase } from "../database";

const resultToObjArray = (result) => {
  if (!result?.values || !result.values.length === 0) return {};

  const ObjArray = result.values.map(value => {
    let obj = {};
    value.map((val, index) => {
      obj[result.columns[index]] = val
    })
    return obj;
  })

  return ObjArray
}

export const getRides = async () => {
  //So we can populate ride list to select from
  //[{ID, Date, Destination}]
  const db = await loadDatabase();

  //get rides
  const result = db.exec(
    "SELECT * FROM Rides"
  );
  const rideData = resultToObjArray(result[0]);

  console.log(rideData);

  return rideData;
};

export const getRideById = async (id) => {
  //So we can populate page with info once ride is selected
  const db = await loadDatabase();
  const ride = db.exec(
    `SELECT route_id, date FROM Rides WHERE ride_id=${id}`
  )[0];
  console.log(ride);
  const routeId = ride.values[0][0];
  console.log('routeId', routeId)
  //TODO add description
  const route = db.exec(
    `SELECT route_id, distance FROM Routes WHERE route_id=${routeId}`
  )[0];
  console.log(route);
  // const routeId = route.values[0][0];
  const routeDistance = route.values[0][1];
  const rideSupport = db.exec(
    `SELECT * FROM Users WHERE user_id IN (SELECT user_id FROM RideSupport WHERE ride_id=${rideId})`
  )[0];
  console.log(rideSupport);
  const mentors = db.exec(
    `SELECT * FROM Users WHERE user_id IN (SELECT user_id FROM GroupAssignments WHERE group_id IN (SELECT group_id FROM Groups WHERE ride_id=${id}) AND user_type_id=(SELECT user_type_id FROM UserTypes WHERE type='Mentor'))`
  )[0];
  console.log(mentors);
  const mentorsObjArray = resultToObjArray(mentors);
  console.log(mentorsObjArray);
  const riders = db.exec(
    `SELECT * FROM Users WHERE user_id IN (SELECT user_id FROM GroupAssignments WHERE group_id IN (SELECT group_id FROM Groups WHERE ride_id=${id}) AND user_type_id=(SELECT user_type_id FROM UserTypes WHERE type='Rider'))`
  )[0];
  console.log(riders);
  const ridersObjArray = resultToObjArray(riders);
  console.log(ridersObjArray);
  const stops = db.exec(
    `SELECT * FROM Stops WHERE route_id=${routeId}`
  )[0];
  console.log(stops);
  const stopsObjArray = resultToObjArray(stops);
  console.log(stopsObjArray);

  const allTheData = {
    Date: ride.values[0][1],
    Destination: "TODO",
    NumMentors: mentorsObjArray.length,
    NumRiders: ridersObjArray.length,
    Miles: routeDistance,
    Riders: ridersObjArray,
    Mentors: mentorsObjArray,
    Stops: stopsObjArray
  };

  console.log(allTheData);
  return allTheData;
  //{Date, Destination, # Members, # Riders, Miles, Riders [{ID, FN, LN, Photo, check_in_status}], Members [ID, FN, LN, Photo, check_in_status], Stops [{id, description, check_in_status}]}
};
