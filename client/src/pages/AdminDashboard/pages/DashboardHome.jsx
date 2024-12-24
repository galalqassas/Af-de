import { useEffect, useState } from "react";
import { LineChart, PieChart } from "@mui/x-charts";
import Card from "../components/Card";

function DashboardHome() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
9
  // DashboardHome.jsx
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin');  // Updated path
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  fetchDashboardData();
}, []);

  if (error) {
    return <div className="text-red-500">Error loading dashboard: {error}</div>;
  }

  if (!dashboardData) {
    return <div>Loading dashboard data...</div>;
  }

  const { total_users, active_courses, pending_approvals, total_enrollments } = dashboardData;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="grid grid-cols-12 grid-rows-9 gap-4 h-full">
        <Card className="flex flex-col justify-between col-span-3 row-span-3">
          <div className="flex">
            <p className="text-lg font-semibold">Total users</p>
          </div>
          <p className="text-right text-4xl font-bold">{total_users.students + total_users.teachers + total_users.parents + total_users.admins}</p>
        </Card>
        <Card className="flex flex-col justify-between col-span-3 row-span-3">
          <div className="flex">
            <p className="text-lg font-semibold">Active courses</p>
          </div>
          <p className="text-right text-4xl font-bold">{active_courses}</p>
        </Card>
        <Card className="flex flex-col justify-between col-span-3 row-span-3">
          <div className="flex">
            <p className="text-lg font-semibold">Pending approvals</p>
          </div>
          <p className="text-right text-4xl font-bold">{pending_approvals}</p>
        </Card>
        <Card className="flex flex-col justify-between col-span-3 row-span-3">
          <div className="flex">
            <p className="text-lg font-semibold">Total enrollments</p>
          </div>
          <p className="text-right text-4xl font-bold">{total_enrollments}</p>
        </Card>
        <Card className="col-span-6 row-span-6 flex flex-col gap-2">
          <p className="text-lg font-semibold">Enrollments per year</p>
          <div className="h-full w-full">
            <LineChart
              colors={['#7C4DFF', '#8d65fc', '#a07efc', '#bca4fc']}
              xAxis={[{
                data: dashboardData.enrollments_over_time.map(e => e.year),
                valueFormatter: v => v.toString(),
                label: "Years",
                tickInterval: dashboardData.enrollments_over_time.map(e => e.year)
              }]}
              series={[{
                data: dashboardData.enrollments_over_time.map(e => e.count),
                label: "Enrollments",
              }]}
            />
          </div>
        </Card>
        <Card className="col-span-6 row-span-6 flex flex-col gap-2">
          <p className="text-lg font-semibold">Users types</p>
          <div className="h-full w-full">
            <PieChart
              colors={['#7C4DFF', '#8d65fc', '#a07efc', '#bca4fc']}
              series={[{
                data: [
                  { value: total_users.students, label: "Students" },
                  { value: total_users.teachers, label: "Teachers" },
                  { value: total_users.parents, label: "Parents" },
                  { value: total_users.admins, label: "Admins" },
                ],
                cornerRadius: 8,
                innerRadius: 42,
              }]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}


export default DashboardHome;