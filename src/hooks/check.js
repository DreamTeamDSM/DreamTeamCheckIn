import { loadDatabase, saveDatabase } from '../database';

export const reset_participant = async (user_id, group_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupAssignments SET check_in=0, check_out=0 WHERE user_id=${user_id} AND group_id=${group_id}`);
    await saveDatabase(db);
}

export const check_in_participant = async (user_id, group_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupAssignments SET check_in=1 WHERE user_id=${user_id} AND group_id=${group_id}`);
    await saveDatabase(db);
}

export const check_out_participant = async (user_id, group_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupAssignments SET check_out=1 WHERE user_id=${user_id} AND group_id=${group_id}`);
    await saveDatabase(db);
}

export const check_in_group = async (group_id, stop_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupCheck SET check_in=1 WHERE stop_id=${stop_id} AND group_id=${group_id}`);
    await saveDatabase(db);
}

export const check_out_group = async (group_id, stop_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupCheck SET check_out=1 WHERE stop_id=${stop_id} AND group_id=${group_id}`);
    await saveDatabase(db);
}

export const reset_group = async (group_id, stop_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupCheck SET check_in=0, check_out=0 WHERE group_id=${group_id} and stop_id=${stop_id}`);
    await saveDatabase(db);
}