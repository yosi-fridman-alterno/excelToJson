import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { read, readFile, writeFileXLSX, utils } from 'xlsx'

function App() {
  const [oFile, setFile] = useState();

  const onFileChange = async (oEvent) => {
    setFile(oEvent.target.files[0]);
  }

  const onConvertToJSON = async () => {
    const data = await oFile.arrayBuffer();
    const workbook = read(data);

    const sheetName = workbook.SheetNames[0];
    const XL_row_object = utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    const json_object = JSON.stringify(XL_row_object);
    const newLines = { Docs: JSON.parse(json_object) };
    console.log(newLines);

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newLines));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "converted.json");
    dlAnchorElem.click();
  }

  return (
    <>
      <div dir='rtl'>
        <h1>
          המרת קבצי אקסל ל-JSON
        </h1>
        {/* <h3>
          בחר קובץ:
        </h3> */}
        <div className="card">
          <input name='' type="file" onChange={onFileChange} onClick={(event) => { event.target.value = null }} />
          <br />
          <br />
          <button onClick={onConvertToJSON}>
            המר והורד
          </button>
        </div>
        {/* {this.fileData()} */}
      </div>
    </>




  )
}

export default App
