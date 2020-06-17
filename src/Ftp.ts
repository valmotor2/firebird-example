import Ftp from "ftp";
import config from "./config";
import Logger from "./models/Logger";
class FtpClass {
  private files: Array<string> = [];
  private instance: any = null;

  constructor() {
    this.instance = new Ftp();
  }

  addPathOfFileForUpload(file: string) {
    this.files.push(file);
  }

  upload() {
    this.instance.connect(config.ftpForUploadData);
    this.instance.on("ready", async () => {
      for (let file of this.files) {
        const save_file_as = file.split("/").reverse()[0];
        await this.uploadAsync(file, save_file_as);
      }
      this.instance.end();
    });

    this.instance.on("error", (err: any) => {
      throw err;
    });
  }

  uploadAsync(file: string, save_file_as: string) {
    return new Promise((resolve, reject) =>
      this.instance.put(file, save_file_as, (err: any) => {
        if (err) return reject(err);
        Logger.info(`File: ${save_file_as} was uploaded! `);
        resolve();
      })
    );
  }

  listDirectory(dir: string = "/") {
    this.instance.connect(config.ftpForUploadData);
    this.instance.on("ready", () => {
      this.instance.list((err: any, list: any) => {
        if (err) throw err;
        this.instance.end();
      });
    });
    this.instance.on("error", (err: any) => {
      throw err;
    });
  }
}

export default FtpClass;
