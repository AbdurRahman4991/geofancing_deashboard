import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import { DashboardContent } from "src/layouts/dashboard";
import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from "src/components/iconify";

import { TableNoData } from "../table-no-data";
import { UserTableHead } from "../user-table-head";
import { UserTableToolbar } from "../user-table-toolbar";

import { useRouter } from "src/routes/hooks";

import {
  PermissionTableRow,
  PermissionProps,
} from "../permission-table-row";

import { useGetPermissionsQuery } from "../../../../redux/service/permissionSlice";

export function PermissionView() {
  const table = useTable();

  const router = useRouter();

  const [filterName, setFilterName] = useState("");

  const { data: permissions = [], isLoading } =
    useGetPermissionsQuery();

  const filteredData = permissions.filter((item: PermissionProps) =>
    item.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ flexGrow: 1 }}
        >
          Permissions
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
          onClick={() =>
            router.push("/permissions/create-permission")
          }
        >
          New Permission
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) =>
            setFilterName(e.target.value)
          }
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 700 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={filteredData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    filteredData.map((item) =>
                      String(item.id)
                    )
                  )
                }
                headLabel={[
                  {
                    id: "name",
                    label: "Permission",
                  },
                  {
                    id: "guard_name",
                    label: "Guard",
                  },
                  {
                    id: "",
                    label: "Action",
                  },
                ]}
              />

              <TableBody>
                {filteredData.map(
                  (row: PermissionProps) => (
                    <PermissionTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(
                        String(row.id)
                      )}
                      onSelectRow={() =>
                        table.onSelectRow(
                          String(row.id)
                        )
                      }
                    />
                  )
                )}

                {!filteredData.length &&
                  !isLoading && (
                    <TableNoData
                      searchQuery={filterName}
                    />
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={0}
          count={filteredData.length}
          rowsPerPage={filteredData.length || 10}
          rowsPerPageOptions={[10]}
          onPageChange={() => {}}
        />
      </Card>
    </DashboardContent>
  );
}

// ===============================

export function useTable() {
  const [page, setPage] = useState(0);

  const [orderBy, setOrderBy] =
    useState("name");

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [order, setOrder] = useState<
    "asc" | "desc"
  >("asc");

  const onSort = useCallback(
    (id: string) => {
      const isAsc =
        orderBy === id && order === "asc";

      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (
      checked: boolean,
      newSelecteds: string[]
    ) => {
      if (checked) {
        setSelected(newSelecteds);
      } else {
        setSelected([]);
      }
    },
    []
  );

  const onSelectRow = useCallback(
    (id: string) => {
      const newSelected = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id];

      setSelected(newSelected);
    },
    [selected]
  );

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSort,
    onSelectRow,
    onSelectAllRows,
  };
}