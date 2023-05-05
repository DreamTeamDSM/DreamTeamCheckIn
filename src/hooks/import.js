const isSynced = () => {
    //do not allow if we have more recent changes to GroupAssignment or GroupCheck since last RideExport
};

const backup = () => {
    //save the current db file.. just incase. do we save this db file locally and just rename? or push it up to google? or both?
};

const import_users = () => {
    //import user data here
    //no parent dependencies
};

const import_routes = () => {
    //import routes and stops here
    //no parent dependencies, add routes before stiops
}

const import_ride_support = () => {
    //import ride support list here (this was not available in group sheet)
    //need users first, will have to match on name or id if available
}

const import_groups = () => {
    //will have to create the group, then group assignments
    //need users first
}

const import_data = () => {
    import_users();
    import_routes();
    import_ride_support();
    import_groups();
};

const trigger_import = () => {
    if (!isSynced) return "Error: You have not exported all changed data. Triggering an import erases app data. Please export all data before importing.";
    backup();
    import_data();
}
