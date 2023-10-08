import { useState } from 'react'
import { Typography, TextField, Button, Paper, CssBaseline } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { read, utils } from 'xlsx'
import FileUploader from './components/FileUploader';
import './App.css'

function App() {
  const [oFile, setFile] = useState();
  const [mainProp, setMainProp] = useState("Docs");

  const onConvertToJSON = async () => {

    const data = await oFile.arrayBuffer();
    const workbook = read(data);

    const sheetName = workbook.SheetNames[0];
    const XL_row_object = utils.sheet_to_row_object_array(workbook.Sheets[sheetName], { defval: "" });
    const jsonObject = JSON.stringify(XL_row_object);

    const oResult = {};
    oResult[mainProp] = JSON.parse(jsonObject);

    for (let row of oResult[mainProp]) {
      for (let prop in row) {
        if (prop.startsWith("__EMPTY")) {
          delete row[prop];
          continue;
        }

        try {
          if (Number(row[prop]) !== isNaN && row[prop] instanceof Date === false) {
            row[prop] = row[prop].toString();
          }
          // eslint-disable-next-line no-empty
        } catch (error) { }

      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(oResult));
    const dlElement = document.createElement("a");
    dlElement.setAttribute("href", dataStr);
    dlElement.setAttribute("download", "converted.json");
    dlElement.click();
    setFile();
  }

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold', direction: 'rtl' }}>
        המרת אקסל ל-JSON
      </Typography>

      <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', padding: '32px' }}>

        <FileUploader setFile={setFile} />

        {oFile && <Typography sx={{ direction: 'rtl' }}>
          קובץ נבחר: {oFile.name}
        </Typography>}

        <TextField
          label="תכונה ראשית"
          onChange={e => { setMainProp(e.target.value) }}
          value={mainProp}
          sx={{ marginTop: '2rem' }}
        />

        <Button variant="contained" color="success" disabled={!oFile} startIcon={<FileDownloadIcon />} onClick={onConvertToJSON} sx={{ marginTop: '2rem' }}>
          המר והורד
        </Button>

      </Paper>
      <CssBaseline />
    </>

  )
}

export default App
