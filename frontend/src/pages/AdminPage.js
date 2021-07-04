import React, { useState } from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext';

import AdminDrawer from '../components/AdminDrawer';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

}));




function AdminPage(props) {
    // eslint-disable-next-line
    const classes = useStyles();
    const token = React.useContext(AuthContext).admin;
    const [profile, setProfile] = useState({
      name: "",
      email: "",
    });

    React.useEffect((() => {
      axios.get('admin/profile', {
        params: {
          token: token,
        }
      })
      .then((response) => {
        const data = response.data;
        setProfile({
          name: data.username,
          email: data.email,
        });
      })
      .catch((err) => {});
    }), [token]);

    return (
      <div>
        <AdminDrawer history={props.history} profile={profile}/>
      </div>
    );
}

export default AdminPage;