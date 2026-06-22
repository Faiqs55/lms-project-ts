import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "../../../styles/styles";
import { toast } from "react-hot-toast";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Delete user successfully!");
      setOpen(false);
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [updateError, isSuccess, deleteSuccess, deleteError]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Button
            onClick={() => {
              setOpen(!open);
              setUserId(params.row.id);
            }}
          >
            <AiOutlineDelete
              className="dark:text-white text-black"
              size={20}
            />
          </Button>
        );
      },
    },
    {
      field: "email_link",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <a href={`mailto:${params.row.email}`}>
            <AiOutlineMail className="dark:text-white text-black" size={20} />
          </a>
        );
      },
    },
  ];

  const rows: any = [];

  if (isTeam) {
    const newData =
      data && data.users.filter((item: any) => item.role === "admin");

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  }

  const handleSubmit = async () => {
    await updateUserRole({ email, role });
  };

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ p: "24px", paddingTop: "120px" }}>
          {isTeam && (
            <div className="w-full flex justify-end">
              <div
                className={`${styles.button} !w-[200px] !rounded-[10px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </div>
            </div>
          )}
          <Box
            sx={{
              height: "80vh",
              backgroundColor: resolvedTheme === "dark" ? "#111C43" : "#fff",
              borderRadius: "10px",
              boxShadow: resolvedTheme === "dark" ? "0 4px 20px 0 rgba(0,0,0,0.5)" : "0 4px 20px 0 rgba(0,0,0,0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif !important",
                flex: 1,
              },
              "& .MuiSvgIcon-root": {
                color: resolvedTheme === "dark" ? "#fff" : "#333",
              },
              "& .MuiButtonBase-root": {
                backgroundColor: "transparent !important",
              },
              "& .MuiDataGrid-sortIcon": {
                color: resolvedTheme === "dark" ? "#fff" : "#333",
              },
              "& .MuiDataGrid-menuIcon": {
                color: resolvedTheme === "dark" ? "#fff" : "#333",
              },
              "& .MuiDataGrid-iconButtonContainer": {
                color: resolvedTheme === "dark" ? "#fff" : "#333",
              },
              "& .MuiDataGrid-columnHeaderDraggableContainer": {
                 color: resolvedTheme === "dark" ? "#fff" : "#333",
              },
              "& .MuiDataGrid-row": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
                borderBottom:
                  resolvedTheme === "dark"
                    ? "1px solid #ffffff1a !important"
                    : "1px solid #e0e0e0 !important",
                "&:hover": {
                  backgroundColor: resolvedTheme === "dark" ? "#1F2A40 !important" : "#e5faf2 !important",
                },
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: resolvedTheme === "dark" ? "#1F2A40 !important" : "#e5faf2 !important",
                "&:hover": {
                   backgroundColor: resolvedTheme === "dark" ? "#3e4396 !important" : "#d1f5e9 !important",
                }
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none !important",
                display: "flex",
                alignItems: "center",
              },
              "& .name-column--cell": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: resolvedTheme === "dark" ? "#3e4396" : "#A4A9FC",
                borderBottom: "none",
                color: resolvedTheme === "dark" ? "#fff" : "#000",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "10px 10px 0 0",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: resolvedTheme === "dark" ? "#3e4396 !important" : "#A4A9FC !important",
                color: resolvedTheme === "dark" ? "#fff !important" : "#000 !important",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: resolvedTheme === "dark" ? "#111C43" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: resolvedTheme === "dark" ? "#3e4396" : "#A4A9FC",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                "& .MuiTablePagination-root": {
                  color: resolvedTheme === "dark" ? "#fff" : "#000",
                },
                "& .MuiButtonBase-root": {
                  color: resolvedTheme === "dark" ? "#fff !important" : "#000 !important",
                },
              },
              "& .MuiCheckbox-root": {
                color:
                  resolvedTheme === "dark" ? `#b7ebde !important` : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={`${styles.input}`}
                  />
                  <select
                    name=""
                    id=""
                    className={`${styles.input} !mt-6`}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option
                      className="dark:bg-[#000] text-[#fff]"
                      value="admin"
                    >
                      Admin
                    </option>
                    <option className="dark:bg-[#000] text-[#fff]" value="user">
                      User
                    </option>
                  </select>
                  <br />
                  <div
                    className={`${styles.button} my-6 !h-[30px]`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllUsers;