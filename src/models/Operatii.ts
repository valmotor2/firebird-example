import Model from "./Model";
import moment from "moment";

class Operatii extends Model {
  async init() {
    const data = await Operatii.getData();

    if (data.length) {
      return Model.putDataInCSV(data, "operatii");
    }
    return "";
  }

  static async getData() {
    const last_month = moment()
      .subtract(1, "month")
      .format("DD.MM.YYYY");

    const sql = `
        SELECT ID, ID_OP, NR_ACT, DATA, SUMA, CD, CC, ID_CD, ID_CC, PF_CD, PF_CC, ID_IMPR_CC, ID_IMPR_CD, EXPL
          FROM operatii
          WHERE DATA > '${last_month}' AND ((pf_cc > 0 AND pf_cc < 100000) OR (pf_cd > 0 AND pf_cd < 100000))
    `;

    return Model.getDataFromDatabaseBySql(sql);
  }
}

export default Operatii;
