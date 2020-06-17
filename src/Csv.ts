import config from "./config";
import fs from "fs";
import path from "path";
import Logger from "./models/Logger";

const Json2csvParser = require("json2csv").Parser;

class Csv {
  private csv: any = null;
  private textProcessedAsCsv = "";

  constructor(fields: string[], opts = {}) {
    const optsFinal = { fields, ...opts };
    this.csv = new Json2csvParser(optsFinal);
  }

  parse(text: object[]) {
    try {
      this.textProcessedAsCsv = this.csv.parse(text);
    } catch (err) {
      throw err;
    }
  }

  writeCSV(nameOfFile: string) {
    const pathFileForSave = config.saveCsvFiles.path;

    const file_name = path.join(pathFileForSave, nameOfFile);

    Logger.info(
      `The file: ${nameOfFile} was created in: ${pathFileForSave} and now will be write with new data!`
    );
    fs.writeFileSync(file_name, this.textProcessedAsCsv);
    Logger.info(`The file ${nameOfFile} was completed with new data.`);
  }
}

export default Csv;
