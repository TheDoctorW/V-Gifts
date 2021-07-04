import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Typography from "@material-ui/core/Typography";

export default function UsersDataGrid(props) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'account_name', headerName: 'Account name', width: 180 },
    { field: 'first_name', headerName: 'First name', width: 180 },
    { field: 'last_name', headerName: 'Last name', width: 180 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.getValue('first_name') || ''} ${params.getValue('last_name') || ''}`,
    },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'city', headerName: 'City', width: 180 },
    { field: 'country', headerName: 'Country', width: 180 },

  ];
  
  const rows = props.users.map(x => {
    return {
      id: x['user_id'],
      account_name: x['account_name'],
      first_name: x['first_name'],
      last_name: x['last_name'],
      email: x['email'],
      address: x['address'],
      city: x['city'],
      country: x['country'],
    };
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Typography
        variant="h3"
      >
        Users in system
      </Typography>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}
