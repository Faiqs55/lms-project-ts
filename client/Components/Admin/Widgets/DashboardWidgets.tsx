import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiTrendingUp } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "../../../redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [userComparePercentage, setuserComparePercentage] = useState<any>();

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading && ordersLoading) {
      return;
    } else {
      if (data && ordersData) {
        const usersLastTwoMonths = data.users.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange = usersPreviousMonth !== 0 ?
            ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) *
            100 : 100;

          const ordersPercentChange = ordersPreviousMonth !== 0 ?
            ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) *
            100 : 100;

          setuserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="mt-[100px] min-h-screen px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 lg:col-span-9">
          <div className="dark:bg-[#111C43] rounded-lg shadow-lg p-4">
            <UserAnalytics isDashboard={true} />
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          <div className="w-full dark:bg-[#111C43] rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
            <div className="flex items-center p-6 justify-between">
              <div>
                <BiTrendingUp className="dark:text-[#45CBA0] text-[#000] text-[32px] mb-2" />
                <h5 className="font-Poppins dark:text-white text-black text-[22px] font-bold">
                  {ordersComparePercentage?.currentMonth}
                </h5>
                <h5 className="font-Poppins dark:text-[#45CBA0] text-gray-500 text-[16px] font-[500] uppercase tracking-wider">
                  Sales Obtained
                </h5>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgressWithLabel 
                  value={ordersComparePercentage?.percentChange > 0 ? 100 : 0} 
                  open={open} 
                />
                <h5 className={`text-center pt-2 font-semibold ${ordersComparePercentage?.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {ordersComparePercentage?.percentChange >= 0 ? "+" : ""}
                 {ordersComparePercentage?.percentChange.toFixed(2)}%
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full dark:bg-[#111C43] rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
            <div className="flex items-center p-6 justify-between">
              <div>
                <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[32px] mb-2" />
                <h5 className="font-Poppins dark:text-white text-black text-[22px] font-bold">
                  {userComparePercentage?.currentMonth}
                </h5>
                <h5 className="font-Poppins dark:text-[#45CBA0] text-gray-500 text-[16px] font-[500] uppercase tracking-wider">
                  New Users
                </h5>
              </div>
              <div className="flex flex-col items-center">
                <CircularProgressWithLabel 
                  value={userComparePercentage?.percentChange > 0 ? 100 : 0} 
                  open={open} 
                />
                <h5 className={`text-center pt-2 font-semibold ${userComparePercentage?.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {userComparePercentage?.percentChange >= 0 ? "+" : ""}
                  {userComparePercentage?.percentChange.toFixed(2)}%
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        <div className="md:col-span-8 lg:col-span-8 dark:bg-[#111c43] rounded-lg shadow-lg p-4">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="md:col-span-4 lg:col-span-4">
          <h5 className="dark:text-white text-black text-[20px] font-semibold font-Poppins mb-4">
            Recent Transactions
          </h5>
          <div className="dark:bg-[#111c43] rounded-lg shadow-lg overflow-hidden">
            <AllInvoices isDashboard={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;