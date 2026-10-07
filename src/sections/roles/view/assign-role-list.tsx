import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { Scrollbar } from 'src/components/scrollbar';
import { useGetAssignRoleUsersQuery } from '../../../../redux/service/userSlice';

import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';
import { TableNoData } from '../table-no-data';
import { Iconify } from 'src/components/iconify';

export default function AssignRoleListView() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const { data, isLoading, isError } = useGetAssignRoleUsersQuery({
    page: page + 1,
    per_page: 10,
    search: filterName,
  });

  const result = data?.data;
  const users = result?.data ?? [];
  const onSelectRow = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };
  const onSelectAllRows = (checked: boolean) => {
    setSelected(checked ? users.map((user) => String(user.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Assigned Roles
        </Typography>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            setPage(0);
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order="asc"
                orderBy="employee_id"
                rowCount={users.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={onSelectAllRows}
                headLabel={[
                  { id: 'employee_id', label: 'Employee ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'roles', label: 'Assigned Role(s)' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
                ) : isError ? (
                  <TableRow><TableCell colSpan={5} align="center">Could not load assigned roles.</TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableNoData searchQuery={filterName} colSpan={5} />
                ) : users.map((user) => {
                  const id = String(user.id);
                  return (
                    <TableRow hover selected={selected.includes(id)} key={user.id}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selected.includes(id)} onChange={() => onSelectRow(id)} />
                      </TableCell>
                      <TableCell>{user.employee?.employee_id ?? user.employee_id}</TableCell>
                      <TableCell>{user.employee?.name ?? user.name ?? '-'}</TableCell>
                      <TableCell>{user.roles?.length ? user.roles.map((role) => role.name).join(', ') : 'No roles assigned'}</TableCell>
                      <TableCell align="right">
                        <AssignedRoleActions onEdit={() => navigate('/roles/assign-role', {
                          state: {
                            userId: user.id,
                            roleIds: user.roles?.map((role) => role.id) ?? [],
                          },
                        })} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={result?.total ?? 0}
          rowsPerPage={10}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[10]}
        />
      </Card>
    </DashboardContent>
  );
}

function AssignedRoleActions({ onEdit }: { onEdit: () => void }) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            width: 150,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75 },
          }}
        >
          <MenuItem onClick={() => { setAnchorEl(null); onEdit(); }}>
            <Iconify icon="solar:pen-bold" />
            Edit Roles
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
