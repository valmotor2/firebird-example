import UserInfo from "./models/UserInfo";
import Operatii from "./models/Operatii";
import CereriImprumut from "./models/CereriImprumut";
import ImpGrafic from "./models/ImpGrafic";
import Giranti from "./models/Giranti";
import config from "./config";

import Ftp from "./Ftp";
import Logger from "./models/Logger";

const start = async () => {
  const files_to_upload = [];
  let file = "";
  try {
    file = await new UserInfo().init();
    if (file) files_to_upload.push(file);
    file = await new Operatii().init();
    if (file) files_to_upload.push(file);
    file = await new CereriImprumut().init();
    if (file) files_to_upload.push(file);
    file = await new ImpGrafic().init();
    if (file) files_to_upload.push(file);

    file = await new Giranti().init();
    if (file) files_to_upload.push(file);

    const ftp = new Ftp();
    const dir_files = config.saveCsvFiles.path;
    for (let each of files_to_upload) {
      ftp.addPathOfFileForUpload(dir_files + "/" + each);
    }
    ftp.upload();
  } catch (err) {
    throw err;
  }

  process.on("uncaughtException", function(err) {
    Logger.error(JSON.stringify(err));
  });
};

start();
