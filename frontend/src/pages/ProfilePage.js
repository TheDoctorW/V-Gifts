import React from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext';
import UserDrawer from '../components/UserDrawer';

export default function ProfilePage(props) {
	// const { profile } = props.match.params;
	const token = React.useContext(AuthContext).user;
  const [profile, setProfile] = React.useState({
    "first_name": "",
    "last_name": "",
    "username": "",
    "email": "",
    "address": "",
    "fund": 0,
  });

	React.useEffect((() => {
		axios.get('/user/profile', { 
      params: {
        token,
      }
    })
    .then((response) => {
      const data = response.data;

      setProfile({
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "username": data["username"],
        "email": data["email"],
        "address": data["address"],
        "fund": data["fund"],
      });
    })
    .catch((err) => {});
	}), [token]);
    
  return (
    <div>
      <UserDrawer profile={profile} history={props.history}/>
    </div>
  );

}
