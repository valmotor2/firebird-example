import Model from "./Model";

class UserInfo extends Model {
  async init() {
    const data = await UserInfo.getData();
    if (data.length) return Model.putDataInCSV(data, "userinfo");
    return "";
  }

  static async getData() {
    const sql = `
      SELECT ID, NPREN, SMS_TEL, FISA, SOLD_FSA_PREL, SOLD_FSB_PREL, SOLD_AJ_DEC_PREL, DEP_LUN, DEP_OCAZ, AJ_DEC
      FROM PF p
      WHERE data_retragere IS NULL
        `;
    return Model.getDataFromDatabaseBySql(sql);
  }
}

export default UserInfo;
