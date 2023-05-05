CREATE TABLE IF NOT EXISTS "User" (
	"user_id"	INTEGER NOT NULL,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"photo"	BLOB,
	"type"	TEXT CHECK("type" IN ('Rider', 'Mentor', 'Support')),
	"active"	INTEGER DEFAULT 0 CHECK("active" IN (0, 1)),
	PRIMARY KEY("user_id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Route" (
	"route_id"	INTEGER NOT NULL,
	"distance"	NUMERIC,
	"type"	TEXT CHECK(type IN ('outAndBack','Loop')),
	PRIMARY KEY("route_id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Ride" (
	"ride_id"	INTEGER NOT NULL,
	"route_id" INTEGER NOT NULL,
	"date"	DATE,
	PRIMARY KEY("ride_id")
	FOREIGN KEY("route_id") REFERENCES "Route"("route_id")
);

CREATE TABLE IF NOT EXISTS "Group" (
	"group_id"	INTEGER NOT NULL,
	"ride_id"	INTEGER,
	PRIMARY KEY("group_id"),
	FOREIGN KEY("ride_id") REFERENCES "Ride"("ride_id")
);

CREATE TABLE IF NOT EXISTS "GroupAssignment" (
	"user_id"	INTEGER,
	"group_id"	INTEGER,
	"check_in"	INTEGER DEFAULT 0 CHECK(check_in IN (0,1)),
	"check_out"	INTEGER DEFAULT 0 CHECK(check_out IN (0,1)),
  "create_date"	DATETIME DEFAULT CURRENT_TIMESTAMP,
  "update_date"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("group_id") REFERENCES "Group"("group_id"),
	FOREIGN KEY("user_id") REFERENCES "User"("user_id")
);

CREATE TABLE IF NOT EXISTS "Stop" (
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
	FOREIGN KEY("group_id") REFERENCES "Group"("group_id")
);

CREATE TABLE IF NOT EXISTS "RideSupport" (
	"user_id"	INTEGER,
	"ride_id"	INTEGER,
	"type"	TEXT,
	FOREIGN KEY("ride_id") REFERENCES "Ride"("ride_id"),
	FOREIGN KEY("user_id") REFERENCES "User"("user_id")
);

CREATE TABLE IF NOT EXISTS "RideExports" (
  "ride_id" INTEGER NOT NULL,
  "date"	DATE,
	FOREIGN KEY("ride_id") REFERENCES "Ride"("ride_id")
);


