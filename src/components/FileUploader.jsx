import { Button } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function FileUploader({ setFile }) {
  return (
    <Button component="label" variant="contained" startIcon={<InsertDriveFileIcon />}>
      בחר קובץ
      <VisuallyHiddenInput type="file" accept=".xls,.xlsx"
        onClick={(event) => { event.target.value = null }}
        onChange={event => { setFile(event.target.files[0]); }} />
    </Button>

  )
}

FileUploader.propTypes = {
  setFile: PropTypes.func.isRequired
}

export default FileUploader
