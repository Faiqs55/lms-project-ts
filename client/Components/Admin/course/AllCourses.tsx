import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "../../../redux/features/course/courseApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "../../../styles/styles";
import { toast } from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Link href={`/admin/edit-course/${params.row.id}`}>
            <FiEdit2 className="dark:text-white text-black" size={20} />
          </Link>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Button
            onClick={() => {
              setOpen(!open);
              setCourseId(params.row.id);
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
  ];

  const rows: any = [];

  {
    data &&
      data.courses.forEach((item: any) => {
        rows.push({
          id: item._id,
          title: item.name,
          ratings: item.ratings,
          purchased: item.purchased,
          created_at: format(item.createdAt),
        });
      });
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error,refetch]);

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
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
                }
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
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this course?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`}
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

export default AllCourses;