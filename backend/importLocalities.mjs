import fs from 'fs'
import { createReadStream } from 'fs';
import csv from 'csv-parser'

import sequelize from "./models/database.mjs";
import Locality from "./models/locality.mjs";

const importCSV = async (filePath) => {
    const localities = [];

    return new Promise((resolve, reject) => {
        createReadStream(filePath)
            .pipe(csv({ separator: ',' })) 
            .on('data', (row) => {
                const locality = row['NUME']?.trim();
                const county = row['JUDET']?.trim();
                const county_abbrev = row['PRESCURTARE_JUDET']?.trim();

                if (locality && county && county_abbrev) {
                    localities.push({ name: locality, county: county, county_abbrev: county_abbrev });
                }
            })
            .on('end', async () => {
                try {
                    await sequelize.sync();
                    await Locality.bulkCreate(localities, { ignoreDuplicates: true });
                    console.log(`Successfully imported ${localities.length} localities`);
                    resolve();
                } catch (error) {
                    console.error('Error inserting data:', error);
                    reject(error);
                } finally {
                    await sequelize.close();
                }
            })
            .on('error', (err) => reject(err));
    });
};

export default importCSV;