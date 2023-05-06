import { loadDatabase } from "../database";
import { isRideSynced } from "./import";

const resultToObjArray = (result) => {
  if (!result?.values || !result.values.length === 0) return null;

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
    `SELECT route_id, ride_id, date FROM Rides WHERE ride_id=${id}`
  )[0];
  // console.log(ride);
  const rideObj = resultToObjArray(ride)[0];
  const route = db.exec(
    `SELECT * FROM Routes WHERE route_id=${rideObj.route_id}`
  )[0];
  // console.log(route);
  const routeObj = resultToObjArray(route)[0];
  const rideSupport = db.exec(
    `SELECT * FROM Users WHERE user_id IN (SELECT user_id FROM RideSupport WHERE ride_id=${id})`
  )[0];
  // console.log(rideSupport);
  const mentors = db.exec(
    `SELECT *, Users.user_id FROM Users ` +
    `LEFT JOIN (` +
    `    SELECT * FROM GroupAssignments` +
    `    LEFT JOIN Groups on GroupAssignments.group_id=Groups.group_id` +
    `    WHERE Groups.ride_id=${id}` +
    `) q ON q.user_id = Users.user_id ` +
    `WHERE Users.user_type_id=(SELECT user_type_id FROM UserTypes WHERE type='Mentor') ` +
    `ORDER BY ride_id DESC, Users.last_name,Users.first_name`
  )[0]
  // console.log(mentors);
  const mentorsObjArray = resultToObjArray(mentors);
  // console.log(mentorsObjArray);
  const riders = db.exec(
    `SELECT *, Users.user_id FROM Users ` +
    `LEFT JOIN (` +
    `    SELECT * FROM GroupAssignments` +
    `    LEFT JOIN Groups on GroupAssignments.group_id=Groups.group_id` +
    `    WHERE Groups.ride_id=${id}` +
    `) q ON q.user_id = Users.user_id ` +
    `WHERE Users.user_type_id=(SELECT user_type_id FROM UserTypes WHERE type='Rider') ` +
    `ORDER BY ride_id DESC, Users.last_name,Users.first_name`
  )[0];
  console.log(id, riders);
  const ridersObjArray = resultToObjArray(riders);
  const stops = db.exec(
    `SELECT * FROM Stops WHERE route_id=${routeObj.route_id}`
  )[0];
  // console.log(stops);
  const stopsObjArray = resultToObjArray(stops);
  // console.log(stopsObjArray);


  const sql = `SELECT * FROM ` +
    `GroupCheck ` +
    `LEFT JOIN Groups on Groups.group_id=GroupCheck.group_id ` +
    `WHERE Groups.ride_id=${id} ` +
    `and GroupCheck.group_id in (select GroupAssignments.group_id from GroupAssignments INNER JOIN Groups on GroupAssignments.group_id = Groups.group_id WHERE Groups.ride_id=${id} and GroupAssignments.check_in = 1 group by GroupAssignments.group_id)`;
  const groupStops = db.exec(sql)[0];
  //console.log("groupStops query data",groupStops);
  const groupStopsObjArray = resultToObjArray(groupStops);
  //console.log("groupStopsObjArray",groupStopsObjArray);
  const groups = db.exec(
    `SELECT * FROM Groups where ride_id=${id}`
  )[0];
  // console.log(groups);
  const groupsObjArray = resultToObjArray(groups);
  // console.log(groupsObjArray)

  const isSyncedResult = await isRideSynced(id);

  const allTheData = {
    Ride: rideObj,
    Route: routeObj,
    Date: rideObj?.date,
    Destination: routeObj?.route_name,
    NumMentors: mentorsObjArray?.length ?? 0,
    NumRiders: ridersObjArray?.length,
    Miles: routeObj?.distance,
    Riders: ridersObjArray,
    Mentors: mentorsObjArray,
    Support: rideSupport,
    Stops: stopsObjArray,
    GroupStops: groupStopsObjArray,
    Groups: groupsObjArray,
    IsSynced: isSyncedResult,
  };

  console.log(allTheData);
  return allTheData;
  //{Date, Destination, # Members, # Riders, Miles, Riders [{ID, FN, LN, Photo, check_in_status}], Members [ID, FN, LN, Photo, check_in_status], Stops [{id, description, check_in_status}]}
};
