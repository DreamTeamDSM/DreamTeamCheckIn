import { loadDatabase } from "../database";

const getRides = () => {
  //So we can populate ride list to select from
  //[{ID, Date, Destination}]
  const db = loadDatabase();

  //get rides
  const rides = db.exec(
    "SELECT * FROM Rides"
  );
  console.log(rides.values);
  return rides.values
};

const getRide = (date, destination) => {
  //So we can populate page with info once ride is selected
  //{Date, Destination, # Members, # Riders, Miles, Riders [{ID, FN, LN, Photo, check_in_status}], Members [ID, FN, LN, Photo, check_in_status], Stops [{id, description, check_in_status}]}
};
