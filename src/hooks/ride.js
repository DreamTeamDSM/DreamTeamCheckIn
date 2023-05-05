import { loadDatabase } from "../database";

const resultToObjArray = (result) => {

  const ObjArray = result.values.map(value => {
    let obj = {};
    value.map((val, index) => {
      obj[result.columns[index]]=val
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

export const getRide = (date, destination) => {
  //So we can populate page with info once ride is selected
  //{Date, Destination, # Members, # Riders, Miles, Riders [{ID, FN, LN, Photo, check_in_status}], Members [ID, FN, LN, Photo, check_in_status], Stops [{id, description, check_in_status}]}
};