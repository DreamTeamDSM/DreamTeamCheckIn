import { loadDatabase, saveDatabase } from '../database';

export const check_in_participant = (user_id, group_id) => {
    let db = loadDatabase();
    db.exec(`UPDATE GroupAssignment SET check_in=1 WHERE user_id=${user_id} AND group_id=${group_id}`);
    saveDatabase();
}

export const check_out_participant = (user_id, group_id) => {
    let db = loadDatabase();
    db.exec(`UPDATE GroupAssignment SET check_out=1 WHERE user_id=${user_id} AND group_id=${group_id}`);
    saveDatabase();
}

export const check_in_group = (group_id, stop_id) => {
    let db = loadDatabase();
    db.exec(`UPDATE GroupCheck SET check_in=1 WHERE stop_id=${stop_id} AND group_id=${group_id}`);
    saveDatabase();
}

export const check_out_group = (group_id, stop_id) => {
    let db = loadDatabase();
    db.exec(`UPDATE GroupCheck SET check_out=1 WHERE stop_id=${stop_id} AND group_id=${group_id}`);
    saveDatabase();
}
