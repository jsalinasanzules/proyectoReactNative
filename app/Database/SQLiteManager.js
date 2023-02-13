import * as SQLite from 'expo-sqlite';
import React, {useState, useEffect} from 'react'




import * as schema from './schemas';
const database_name = 'CotzulDB.db';
const database_version = '1.0';
const database_displayname = 'CotzulDB';
const database_size = 200000;
const [texto, setTexto] = useState("Cargando...");

class SQLiteManager {
    

    constructor() {
        this.type = 'SingletonDefaultExportInstance';
        this.db = null;
    }

    
    initDB() {
        let db;
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        );

        try {
            db.transaction((tx) =>  {{tx.executeSql('SELECT 1 FROM Producto LIMIT 1')}});
            console.log("ya han sido registradas");
          } catch (e) {
            db.transaction((tx) => {
                for (const name in schema.Tables) {
                    this.createTable(tx, schema.Tables[name], name);
                }
            })
            .then(() => {
                console.log("Registro las tablas");
            })
            .catch(() => {
                console.log("no se ha registrado nada");
            });
          }


        texto = "Base de datos creada...";

        return db;
    }

    closeDatabase(db) {
        if (db) {
            db.close()
                .then((status) => {
                    //
                })
                .catch((error) => {
                    this.errorCB(error);
                });
        } else {
            //
        }
    }


    



    addMovieReview(movie) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    for (let i = 0; i < movie.length; i++) {
                        tx.executeSql('INSERT OR REPLACE INTO Movie VALUES (?, ?)', [
                            movie[i].name,
                            movie[i].description,
                        ]).then(([tx, results]) => {
                            //
                            resolve(results);
                        });
                    }
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    createTablesFromSchema() {
        if (this.db) {
            this.db.transaction((tx) => {
                for (const name in schema.Tables) {
                    this.createTable(tx, schema.Tables[name], name);
                }
            });
        }
    }

    dropDatabase() {
        return new Promise((resolve, reject) => {
            SQLite.deleteDatabase(database_name)
                .then(() => {
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size,
                    );
                })
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        }).catch((error) => {
            //
        });
    }

    createTable(tx, table, tableName) {
        let sql = `CREATE TABLE IF NOT EXISTS ${tableName} `;
        const createColumns = [];
        for (const key in table) {
            createColumns.push(
                `${key} ${table[key].type.type} ${
          table[key].primary_key ? 'PRIMARY KEY NOT NULL' : ''
        } default ${table[key].default_value}`,
            );
        }
        sql += `(${createColumns.join(', ')});`;
        tx.executeSql(
            sql,
            [],
            () => {
                //
            },
            () => {
                //
            },
        );
    }
}

export default new SQLiteManager();