import Model from "./Model";

class CereriImprumut extends Model {
  async init() {
    const data = await CereriImprumut.getData();
    if (data.length) return Model.putDataInCSV(data, "cereriimp");
    return "";
  }

  static async getData() {
    const sql = `
      SELECT id,id_pf,data_acord,suma_ac,proc_dob,proc_dob_soc,dob_spec,tip,luni_gratie,nr_rate,data_scad1,mcd,dob_zi,id_tip,
        com1_inc,com2_inc,com3_lun,ret_stat,tip_ab, acordat, achitat
      FROM cereri_imp 
      WHERE acordat = 1 AND ( achitat is NULL OR achitat = 0)
    `;

    return Model.getDataFromDatabaseBySql(sql);
  }
}

export default CereriImprumut;
