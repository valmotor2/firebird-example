import Model from "./Model";
import moment from "moment";

class ImpGrafic {
  async init() {
    const data = await ImpGrafic.getData();
    if (data.length) return Model.putDataInCSV(data, "impgraf");
    return "";
  }

  static async getData() {
    const startOfMonth = moment().format("YYYY-MM-DD");
    const endOfMonth = moment()
      .add(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const sql = `
            SELECT * 
            FROM grafice 
            WHERE data between '${startOfMonth}' AND '${endOfMonth}' 
                AND ID_CERERE IN ( SELECT ID from cereri_imp WHERE acordat = 1 AND ( achitat is NULL OR achitat = 0))
        `;

    return Model.getDataFromDatabaseBySql(sql);
  }
}

export default ImpGrafic;
