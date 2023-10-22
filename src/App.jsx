import { useState } from 'react'
import { Typography, TextField, Button, Paper, CssBaseline, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { read, utils } from 'xlsx'
import FileUploader from './components/FileUploader';
import './App.css'

function App() {
  const [oFile, setFile] = useState();
  const [mainProp, setMainProp] = useState("Docs");
  const [isProjectsFile, setIsProjectsFile] = useState(false);


  const onConvertToJSON = async () => {

    const data = await oFile.arrayBuffer();
    const workbook = read(data);

    const sheetName = workbook.SheetNames[0];
    const XL_row_object = utils.sheet_to_row_object_array(workbook.Sheets[sheetName], { defval: "" });
    const jsonObject = JSON.stringify(XL_row_object);

    let oResult = {};
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

    if (isProjectsFile) {
      try {
        oResult = transformProjectsFile(oResult[mainProp], mainProp);
      } catch (error) {
        alert(error);
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(oResult));
    const dlElement = document.createElement("a");
    dlElement.setAttribute("href", dataStr);
    dlElement.setAttribute("download", "converted.json");
    dlElement.click();
    setFile();
  }

  function transformProjectsFile(inputData, mainProp) {
    const outputData = {
      "Project": {
        "DesignatedWing": inputData[0].DesignatedWing,
        "ProjectNum": inputData[0].ProjectNum,
        "ProjectName": inputData[0].ProjectName,
        "ProjectType": inputData[0].ProjectType,
        "WBS": inputData[0].WBS,
        "ContractNum": inputData[0].ContractNum,
        "RoadRailNum": inputData[0].RoadRailNum,
        "ProjectContent": inputData[0].ProjectContent,
        "Interchange": inputData[0].Interchange,
        "Manhap_all_username": inputData[0].Manhap_all_username,
        "Manhap": inputData[0].Manhap,
        "Manhap_username": inputData[0].Manhap_username,
        "Mamap_username": inputData[0].Mamap_username,
        "Mamap": inputData[0].Mamap,
        "Planner_all_username": inputData[0].Planner_all_username,
        "FromKm": inputData[0].FromKm,
        "ToKm": inputData[0].ToKm,
        "ManagementCompany": inputData[0].ManagementCompany,
        "TenderType": inputData[0].TenderType,
        "ExecutionContractorCompany": inputData[0].ExecutionContractorCompany,
        "ProjectsSection": inputData[0].ProjectsSection
      }
    };

    outputData[mainProp] = [];

    for (let i = 0; i < inputData.length; i++) {
      const doc = {
        "FileName": inputData[i].FileName,
        "MainFolder": inputData[i].MainFolder,
        "ProjectNum": inputData[i].ProjectNum_1,
        "SubFolderPath": inputData[i].SubFolderPath,
        "SourceDocID": inputData[i].SourceDocID,
        "DocType": inputData[i].DocType,
        "RequestNum": inputData[i].RequestNum,
        "Element": inputData[i].Element,
        "SogBakara": inputData[i].SogBakara,
        "Discipline": inputData[i].Discipline,
        "Date": inputData[i].Date,
        "AddedBy": inputData[i].AddedBy,
        "FileOrFolder": inputData[i].FileOrFolder
      };
      outputData[mainProp].push(doc);
    }

    return outputData;
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

        <FormControlLabel control={<Checkbox checked={isProjectsFile} onChange={e => { setIsProjectsFile(e.target.checked) }} />} label="קובץ פרויקטים" />

        <Button variant="contained" color="success" disabled={!oFile} startIcon={<FileDownloadIcon />} onClick={onConvertToJSON} sx={{ marginTop: '2rem' }}>
          המר והורד
        </Button>

      </Paper>
      <CssBaseline />
    </>

  )
}

export default App
