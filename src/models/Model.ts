import config from "../config";
import Firebird, {
  Options as IOptions,
  Database as IDatabase
} from "node-firebird";
import Logger from "./Logger";
import Csv from "../Csv";

export const MOMENT_FORMAT_RO = "DD.MM.YYYY";

abstract class Model {
  private static options: IOptions = {
    ...config.firebird
  };

  protected db = null;

  static queryPromise(
    query: string,
    params: any[] = [],
    oneRow = false
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      Firebird.attach(Model.options, function(err: any, db: IDatabase) {
        if (err) return reject(err);

        db.query(query, params, (error, results) => {
          if (error) {
            db.detach();
            return reject(error);
          }

          if (oneRow) {
            db.detach();
            return resolve(results[0] || null);
          }

          db.detach();
          return resolve(results);
        });
      });
    });
  }

  static async getDB(): Promise<IDatabase> {
    return await new Promise((resolve, reject) => {
      Firebird.attach(Model.options, (err: any, db: IDatabase) => {
        if (err) return reject(err);

        resolve(db);
      });
    });
  }

  static async getDataFromDatabaseBySql(sql: string) {
    const dataProcessed: any = [];
    let catchError: any;
    try {
      const results = await Model.queryPromise(sql);

      for (let r of results) {
        const a = Object.keys(r);
        let append: any = {};
        for (let key of a) {
          append[key.toLowerCase()] = Buffer.isBuffer(r[key])
            ? Buffer.from(r[key])
                .toString()
                .trim()
            : r[key];
        }

        dataProcessed.push(append);
        catchError = r;
      }
    } catch (err) {
      Logger.error("Error get data:", err, catchError);
    }

    return dataProcessed;
  }

  static async putDataInCSV(data: any, fileName = "default") {
    const header = Object.keys(data[0]);
    const csv = new Csv(header);
    csv.parse(data);
    csv.writeCSV(`${fileName}.csv`);

    return `${fileName}.csv`;
  }

  // static querySequentially(query: string, params: any[] = []) {
  //   Firebird.attach(Model.options, function(err, db) {

  //     if (err)
  //         throw err;

  //     // db = DATABASE
  //     db.sequentially('SELECT * FROM BIGTABLE', function(row, index) {

  //         // EXAMPLE
  //         stream.write(JSON.stringify(row));

  //     }, function(err) {
  //         // END
  //         // IMPORTANT: close the connection
  //         db.detach();
  //     });
  //   });
  // }
}

export default Model;
