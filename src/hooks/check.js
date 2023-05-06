import { loadDatabase, saveDatabase } from '../database';

export const check_in_participant = async (user_id, group_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupAssignment SET check_in=1 WHERE user_id=${user_id} AND group_id=${group_id}`);
    await saveDatabase();
}

export const check_out_participant = async (user_id, group_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupAssignment SET check_out=1 WHERE user_id=${user_id} AND group_id=${group_id}`);
    await saveDatabase();
}

export const check_in_group = async (group_id, stop_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupCheck SET check_in=1 WHERE stop_id=${stop_id} AND group_id=${group_id}`);
    await saveDatabase();
}

export const check_out_group = async (group_id, stop_id) => {
    let db = await loadDatabase();
    db.exec(`UPDATE GroupCheck SET check_out=1 WHERE stop_id=${stop_id} AND group_id=${group_id}`);
    await saveDatabase();
}
