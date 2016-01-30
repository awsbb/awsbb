import fs from 'fs';
import path from 'path';

export function mapRoutes(server) {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, './route-maps'), (err, files) => {
      if (err) {
        return reject(err);
      }
      files.map((file) => {
        const routeMaps = require(`./route-maps/${file}`);
        routeMaps.setup(server);
      });
      resolve();
    });
  });
}
