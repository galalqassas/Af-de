// PaymentManagement.jsx
import { useState, useEffect } from "react";
import Card from "../components/Card";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { LineChart } from '@mui/x-charts';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalPayments: 0,
    totalAmount: 0,
    bestSellingCourse: { name: '', amount: 0 }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const processTimeSeriesData = (data) => {
    const groupedByDate = data.reduce((acc, payment) => {
      const date = payment.payment_date;
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {});

    return Object.entries(groupedByDate)
      .map(([date, amount]) => ({
        date: new Date(date),
        amount: amount
      }))
      .sort((a, b) => a.date - b.date);
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payment');
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data);
      
      const total = data.reduce((sum, payment) => sum + payment.amount, 0);
      const timeData = processTimeSeriesData(data);
      setTimeSeriesData(timeData);
      
      const coursePayments = data.reduce((acc, payment) => {
        const courseName = payment.course_name;
        acc[courseName] = (acc[courseName] || 0) + payment.amount;
        return acc;
      }, {});
      
      const bestCourse = Object.entries(coursePayments)
        .sort(([, a], [, b]) => b - a)[0] || ['No courses', 0];

      setSummaryData({
        totalPayments: data.length,
        totalAmount: total,
        bestSellingCourse: {
          name: bestCourse[0],
          amount: bestCourse[1]
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sortedPayments = [...payments].sort((a, b) => {
      return newOrder === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    });
    setPayments(sortedPayments);
  };

  const getSortIcon = () => {
    if (!sortOrder) return <FaSort />;
    return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-4 flex flex-col justify-between">
          <p className="text-lg font-semibold">Total Payments</p>
          <p className="text-4xl font-bold text-right">{summaryData.totalPayments}</p>
        </Card>
        
        <Card className="col-span-4 flex flex-col justify-between">
          <p className="text-lg font-semibold">Total Amount</p>
          <p className="text-4xl font-bold text-right">
            ${summaryData.totalAmount.toFixed(2)}
          </p>
        </Card>
        
        <Card className="col-span-4 flex flex-col justify-between">
          <p className="text-lg font-semibold">Best-Selling Course</p>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{summaryData.bestSellingCourse.name}</p>
          </div>
        </Card>
      </div>

      <Card className="flex-1">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold border-b pb-2">Payment History</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Payment ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Payment By</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-left">Card</th>
                  <th className="px-4 py-2 text-left cursor-pointer flex items-center gap-2" 
                      onClick={handleSort}>
                    Amount
                    {getSortIcon()}
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.payment_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{payment.payment_id}</td>
                    <td className="px-4 py-3">{payment.payment_date}</td>
                    <td className="px-4 py-3">{payment.student_name}</td>
                    <td className="px-4 py-3">{payment.student_email}</td>
                    <td className="px-4 py-3">{payment.course_name}</td>
                    <td className="px-4 py-3">*****{payment.card_last_four_digits}</td>
                    <td className="px-4 py-3">${payment.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card className="flex-1 mt-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold border-b pb-2">Payment Trends</h2>
          <div className="h-[300px] w-full">
            <LineChart
              xAxis={[{
                data: timeSeriesData.map(d => d.date),
                scaleType: 'time',
                valueFormatter: (date) => date.toLocaleDateString(),
              }]}
              series={[
                {
                  data: timeSeriesData.map(d => d.amount),
                  label: 'Payment Amount ($)',
                  color: '#7C4DFF',
                },
              ]}
              height={280}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentManagement;