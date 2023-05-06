CREATE TABLE IF NOT EXISTS "UserTypes" (
	"user_type_id" INTEGER NOT NULL,
	"type" TEXT,
	PRIMARY KEY("user_type_id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Users" (
	"user_id"	INTEGER NOT NULL,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"photo_url"	TEXT,
	"user_type_id" INTEGER,
	"active"	INTEGER DEFAULT 0 CHECK("active" IN (0, 1)),
	"isNew" INTEGER DEFAULT 0 CHECK("isNew" IN (0,1)),
	PRIMARY KEY("user_id" AUTOINCREMENT),
	FOREIGN KEY("user_type_id") REFERENCES "UserTypes"("user_type_id")
);

CREATE TABLE IF NOT EXISTS "Routes" (
	"route_id"	INTEGER NOT NULL,
	"route_name" TEXT,
	"via" TEXT,
	"distance"	NUMERIC,
	"climb" NUMERIC,
	"hours" NUMERIC,
	"difficulty" TEXT,
	"type"	TEXT,
	PRIMARY KEY("route_id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Rides" (
	"ride_id"	INTEGER NOT NULL,
	"route_id" INTEGER NOT NULL,
	"date"	DATE,
	PRIMARY KEY("ride_id" AUTOINCREMENT),
	FOREIGN KEY("route_id") REFERENCES "Routes"("route_id")
);

CREATE TABLE IF NOT EXISTS "Groups" (
	"group_id"	INTEGER NOT NULL,
	"group_name" TEXT,
	"ride_id"	INTEGER,
	PRIMARY KEY("group_id" AUTOINCREMENT),
	FOREIGN KEY("ride_id") REFERENCES "Rides"("ride_id")
);

CREATE TABLE IF NOT EXISTS "GroupAssignments" (
	"user_id"	INTEGER,
	"group_id"	INTEGER,
	"check_in"	INTEGER DEFAULT 0 CHECK(check_in IN (0,1)),
	"check_out"	INTEGER DEFAULT 0 CHECK(check_out IN (0,1)),
  "create_date"	DATETIME DEFAULT CURRENT_TIMESTAMP,
  "update_date"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("group_id") REFERENCES "Groups"("group_id"),
	FOREIGN KEY("user_id") REFERENCES "Users"("user_id")
);

CREATE TABLE IF NOT EXISTS "Stops" (
	"stop_id"	INTEGER NOT NULL,
	"route_id"	INTEGER,
	"description"	TEXT,
	"order"	INTEGER,
	PRIMARY KEY("stop_id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "GroupCheck" (
	"group_id"	INTEGER,
	"stop_id"	INTEGER,
	"check_in"	INTEGER DEFAULT 0 CHECK(check_in IN (0,1)),
	"check_out"	INTEGER DEFAULT 0 CHECK(check_out IN (0,1)),
  "create_date"	DATETIME DEFAULT CURRENT_TIMESTAMP,
  "update_date"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("group_id") REFERENCES "Groups"("group_id"),
	FOREIGN KEY("stop_id") REFERENCES "Stops"("stop_id")
);

CREATE TABLE IF NOT EXISTS "RideSupport" (
	"user_id"	INTEGER,
	"ride_id"	INTEGER,
	"type"	TEXT,
	FOREIGN KEY("ride_id") REFERENCES "Rides"("ride_id"),
	FOREIGN KEY("user_id") REFERENCES "Users"("user_id")
);

CREATE TABLE IF NOT EXISTS "RideExports" (
  "ride_id" INTEGER NOT NULL,
  "date"	DATE,
	FOREIGN KEY("ride_id") REFERENCES "Rides"("ride_id")
);


