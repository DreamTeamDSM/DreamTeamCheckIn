import { loadDatabase, saveDatabase } from "../database";

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

export const updateGroupAssignment = async (user_id, ride_id, new_group_id) => {
  const db = await loadDatabase();

  const result = db.exec(
    "SELECT DISTINCT Groups.group_id FROM Users \
    INNER JOIN GroupAssignments on Users.user_id = GroupAssignments.user_id \
    INNER JOIN Groups on Groups.group_id = GroupAssignments.group_id \
    WHERE Users.user_id = " + user_id + " AND Groups.ride_id = " + ride_id + "; \
    "
  )[0];
  const groupAssignmentsObjArray = resultToObjArray(result);

  if (groupAssignmentsObjArray && groupAssignmentsObjArray.length > 0) {
    console.log('Found match, updating record');
    const group_id = groupAssignmentsObjArray[0].group_id;

    // record exists, update it
    db.exec(
      "\
      UPDATE GroupAssignments \
      SET group_id = " + new_group_id + "\
      WHERE user_id = " + user_id + " AND group_id = " + group_id + ";\
      "
    );
    saveDatabase(db);
  } else {
    console.log('No match found, inserting new record');
    // record doesn't exists, insert it
    db.exec(
      "\
      INSERT INTO GroupAssignments (user_id, group_id) \
      VALUES (" + user_id + "," + new_group_id + "); \
      "
    );
    saveDatabase(db);
  }

  return;
};