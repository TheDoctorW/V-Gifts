import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import { DataGrid } from '@material-ui/data-grid';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const INVALID_EMAIL = 462;
const INVALID_NAME = 464;
const EXISTED_NAME = 463;
const EXISTED_EMAIL = 468;

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: "2rem",
  },
}));

export default function AdminsManagement(props) {
  const classes = useStyles();

  const token = props.token;
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    password: "",
    email: "",
    showPassword: true,
  })
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    nameError: false,
    emailError: false,
    passwordError: false,
    help_text: ""
  });

  const handle_error = () => event => {
    setState({
      nameError: false,
      emailError: false,
      passwordError: false,
      help_text: ""
    });
  };

  const handleChange = name => event => {
    setNewAdmin({
      ...newAdmin,
      [name]: event.target.value
    });
  };

  const handleClickShowPassword = () => {
    setNewAdmin({ ...newAdmin, showPassword: !newAdmin.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleAddAdmin = (event) => {
    event.preventDefault();

    axios.post("/admin/add_admin", {
      token,
      name: newAdmin.name,
      password: newAdmin.password,
      email: newAdmin.email,
    })
    .then((response) => {
      const data = response.data;
      if (data.code === INVALID_EMAIL) {
        // invalid email
        setState({
          ...state,
          emailError: true,
          help_text: "The entered email is invalid"
        });
      } else if (data.code === INVALID_NAME) {
        // invalid user name
        setState({
          nameError: true,
          help_text: "The admin name is invalid"
        });
      } else if (data.code === EXISTED_NAME) {
        // username exist
        setState({
          nameError: true,
          help_text: "The admin name is already existed"
        });
      } else if (data.code === EXISTED_EMAIL) {
        // email existed
        setState({
          ...state,
          emailError: true,
          help_text: "The admin email is already existed"
        });
      } else {
        setLoading(true);
      }
      
    })
    .catch((err) => {});
  }

  useEffect((() => {
    axios.get("/admin/all_admin", {
      params: {
        token,
      }
    })
    .then((response) => {
      const data = response.data;

      setAdmins(data);
    })
    .catch((err) => {});
  }), [loading, token]);



  const columns = [
    { field: "id", headerName: 'Admin ID', width: 150},
    { field: "username", headerName: 'Admin Name', width: 180 },
    { field: "email", headerName: 'Admin Email', width: 250 },
  ];

  const rows = admins.map(x => {
    return {
      "id": x["admin_id"],
      "username": x["username"],
      "email": x["email"],
    };
  });

  return (
    <div style={{ width: '100%'}}>
      <Typography variant="h5">Admins in the system</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={7}
        checkboxSelection
        autoHeight
      />
      <form className={classes.form} onSubmit={handleAddAdmin}>
        <Typography variant="h5" style={{marginBottom: "1rem"}}>
          Add a New Admin
        </Typography>
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            required
            id="admin-name"
            label="Admin Name"
            placeholder="Admin Name"
            variant="outlined"
            error={state.nameError}
            helperText={state.help_text}
            onChange={handleChange('name')}
            onClick={handle_error()}
            style={{
              marginRight: "1rem",
            }}
          />
          <TextField
            required
            id="admin-email"
            label="Admin Email"
            placeholder="Admin Email"
            variant="outlined"
            error={state.emailError}
            helperText={state.help_text}
            onChange={handleChange('email')}
            onClick={handle_error()}
            style={{
              marginRight: "1rem",
            }}
          />
          <OutlinedInput
            id="outlined-adornment-password"
            type={newAdmin.showPassword ? 'text' : 'password'}
            value={newAdmin.password}
            label="Admin Password"
            placeholder="Admin Password"
            variant="outlined"
            error={state.passwordError}
            helperText={state.help_text}
            onChange={handleChange('password')}
            onClick={handle_error()}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {newAdmin.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />

          {/* <TextField
            required
            type={newAdmin.showPassword ? 'text' : 'password'}
            value={newAdmin.password}
            id="admin-password"
            label="Admin Password"
            placeholder="Admin Password"
            variant="outlined"
            error={state.passwordError}
            helperText={state.help_text}
            onChange={handleChange('password')}
            onClick={handle_error()}
          /> */}
          <Button 
            type="submit"
            variant="contained" 
            color="primary"
            style={{
              marginLeft: "1rem",
              height: "100%",
            }}
          >
            Add
          </Button>
        </Box>
      </form>
    </div>
  );
}