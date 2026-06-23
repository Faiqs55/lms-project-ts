import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "../../../redux/features/course/courseApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "../../../redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );
        const course = coursesData?.courses.find(
          (course: any) => course._id === item.courseId
        );
        return {
          ...item,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "$" + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: any = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
      : [
          {
            field: " ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => {
              return (
                <a href={`mailto:${params.row.userEmail}`}>
                  <AiOutlineMail
                    className="dark:text-white text-black"
                    size={20}
                  />
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  orderData &&
    orderData.forEach((item: any) => {
      rows.push({
        id: item._id,
        userName: item.userName,
        userEmail: item.userEmail,
        title: item.title,
        price: item.price,
        created_at: format(item.createdAt),
      });
    });

    if (!mounted) {
      return null;
    }

    return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{m: isDashboard ? "0" : "40px"}}>
          <Box
            sx={{
                m: isDashboard ? "0" : "40px 0 0 0",
                height: isDashboard ? "35vh" : "90vh",
                overflow: "hidden",
                backgroundColor: resolvedTheme === "dark" ? "#111C43" : "#fff",
                borderRadius: "10px",
                boxShadow: resolvedTheme === "dark" ? "0 4px 20px 0 rgba(0,0,0,0.5)" : "0 4px 20px 0 rgba(0,0,0,0.1)",
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
                fontFamily: "Poppins, sans-serif",
              },
              "& .MuiSvgIcon-root": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
                borderBottom:
                  resolvedTheme === "dark"
                    ? "1px solid #ffffff1a !important"
                    : "1px solid #ccc !important",
                "&:hover": {
                    backgroundColor: resolvedTheme === "dark" ? "#1F2A40 !important" : "#e5faf2 !important",
                },
              },
              "& .MuiTablePagination-root": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none !important",
              },
              "& .name-column--cell": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: resolvedTheme === "dark" ? "#3e4396 !important" : "#A4A9FC !important",
                borderBottom: "none",
                color: resolvedTheme === "dark" ? "#fff" : "#000",
                borderRadius: isDashboard ? "0" : "10px 10px 0 0",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: resolvedTheme === "dark" ? "#3e4396 !important" : "#A4A9FC !important",
                color: resolvedTheme === "dark" ? "#fff !important" : "#000 !important",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: resolvedTheme === "dark" ? "#111C43" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: resolvedTheme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: resolvedTheme === "dark" ? "#3e4396" : "#A4A9FC",
                borderRadius: isDashboard ? "0" : "0 0 10px 10px",
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
            <DataGrid
              checkboxSelection={isDashboard ? false : true}
              rows={rows}
              columns={columns}
              slots={isDashboard ? {} : { toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;