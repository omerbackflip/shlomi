const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { ServerApp } = require("../config/constants");

exports.transformCSVData = (sheet_name_list, workbook) => {
	try {
		return sheet_name_list.map((y) => {
			var worksheet = workbook.Sheets[y];
			var headers = {};
			var data = [];

			Object.keys(worksheet).forEach((z) => {
				var tt = 0;
				for (var i = 0; i < z.length; i++) {
					if (!isNaN(z[i])) {
						tt = i;
						break;
					}
				};
				var col = z.substring(0, tt);
				var row = parseInt(z.substring(tt));
				var value = worksheet[z].v;

				if (row == 1 && value) {
					headers[col] = value;
				}

				if (!data[row]) data[row] = {};
				data[row][headers[col]] = value;
			})
			data.shift();
			data.shift();
			return data
		});
	} catch (error) {
		return false;
	}
}

exports.convertToJSON = (array) => {
	var first = array[0].join()
	var headers = first.split(',');
  
	var jsonData = [];
	for ( var i = 1, length = array.length; i < length; i++ )
	{
  
	  var myRow = array[i].join();
	  var row = myRow.split(',');
  
	  var data = {};
	  for ( var x = 0; x < row.length; x++ )
	  {
		data[headers[x]] = row[x];
	  }
	  jsonData.push(data);
  
	}
	return jsonData;
};

exports.createExcelUtil = (sheetsMap /* object: { sheetName: dataArray, ... } */, filename) => {
  if (!sheetsMap || typeof sheetsMap !== 'object') {
    console.error('createExcelUtil: sheetsMap must be an object of sheetName -> array');
    return false;
  }

  try {
    // Build workbook
    const wb = xlsx.utils.book_new();

    // For each sheet, clone & flatten arrays, then append sheet
    for (const [sheetName, rawData] of Object.entries(sheetsMap)) {
      const data = Array.isArray(rawData) ? rawData : [];

      // convert arrays to multiline strings and remove Mongo internals if necessary
      const formattedData = data.map(item => {
        // If item is a plain object (from .lean()) we can shallow-copy it
        const flattened = { ...(item || {}) };
        for (const key in flattened) {
          if (Array.isArray(flattened[key])) {
            flattened[key] = flattened[key].join('\n');
          }
          // optionally remove _id if you prefer string id
          if (key === '_id' && flattened[key] && typeof flattened[key] === 'object') {
            // keep the string representation
            flattened._id = String(flattened._id);
          }
        }
        return flattened;
      });

      // create worksheet (use date handling options you used before)
      const ws = xlsx.utils.json_to_sheet(formattedData, { cellDates: true, dateNF: 'dd/mm/yyyy', UTC: true });

      // ensure valid sheet name (SheetJS allows up to 31 chars)
      const safeName = (sheetName || 'Sheet').substring(0, 31);
      xlsx.utils.book_append_sheet(wb, ws, safeName);
    }

    // Ensure filename exists and is safe
    const excelFilename = filename || `backup-${Date.now()}.xlsx`;
    const filePath = path.join(ServerApp.uploadFolderPath, excelFilename);

    // make parent directory if needed (best-effort)
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // write file
    xlsx.writeFile(wb, filePath);

    return {
      filename: excelFilename,
      filePath
    };

  } catch (error) {
    console.error('❌ Error creating Excel workbook:', error);
    return false;
  }
};
 