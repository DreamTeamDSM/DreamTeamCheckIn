// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Provide a lightweight test-time mock for the Storage API used by the app
// and a local `fetch` handler for the DB init SQL so tests don't attempt
// a real network or browser-only API.
(() => {
	if (typeof navigator !== 'undefined' && !navigator.storage) {
		const files = new Map();

		const makeDirHandle = () => ({
			async *entries() {
				for (const [key, value] of files.entries()) {
					yield [key, value];
				}
			},
			async getFileHandle(name, options) {
				if (!files.has(name)) {
					if (options && options.create) {
						const file = {
							async getFile() {
								return new File([new Uint8Array(0)], name);
							},
							async createWritable() {
								return {
									async write(_data) {},
									async close() {},
								};
							},
						};
						files.set(name, file);
						return file;
					}
					throw new Error('File not found');
				}
				return files.get(name);
			},
			async removeEntry(name) {
				files.delete(name);
			},
		});

		navigator.storage = {
			async getDirectory() {
				return makeDirHandle();
			},
		};
	}

	// Minimal fetch mock for `sql/init_db.sql` used during createDatabase()
	const originalFetch = typeof global.fetch === 'function' ? global.fetch : null;
	global.fetch = async (input, init) => {
		const url = input && input.toString ? input.toString() : String(input);
		if (url.includes('/sql/init_db.sql') || url.endsWith('init_db.sql')) {
			return {
				ok: true,
				status: 200,
				text: async () => `CREATE TABLE IF NOT EXISTS \"UserTypes\" (\n\t\"user_type_id\" INTEGER NOT NULL,\n\t\"type\" TEXT,\n\tPRIMARY KEY(\"user_type_id\" AUTOINCREMENT)\n);\n\nCREATE TABLE IF NOT EXISTS \"Users\" (\n\t\"user_id\"\tINTEGER NOT NULL,\n\t\"first_name\"\tTEXT,\n\t\"last_name\"\tTEXT,\n\t\"photo_url\"\tTEXT,\n\t\"user_type_id\" INTEGER,\n\t\"active\" INTEGER DEFAULT 0 CHECK(\"active\" IN (0, 1)),\n\t\"isNew\" INTEGER DEFAULT 0 CHECK(\"isNew\" IN (0,1)),\n\tPRIMARY KEY(\"user_id\" AUTOINCREMENT),\n\tFOREIGN KEY(\"user_type_id\") REFERENCES \"UserTypes\"(\"user_type_id\")\n);\n`,
			};
		}

		if (originalFetch) {
			return originalFetch(input, init);
		}

		return { ok: false, status: 404 };
	};
})();
