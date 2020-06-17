import Model from "./Model";

class Giranti extends Model {
  async init() {
    const data = await Giranti.getData();
    if (data.length) return Model.putDataInCSV(data, "giranti");
    return "";
  }

  static async getData() {
    const sql = `
        SELECT id, id_cerere, id_pf,  suma, scoring 
        FROM giranti where id_cerere IN ( SELECT ID from cereri_imp WHERE acordat = 1 AND ( achitat is NULL OR achitat = 0) )
    `;
    return Model.getDataFromDatabaseBySql(sql);
  }
}

export default Giranti;
