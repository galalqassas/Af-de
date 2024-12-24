import DashboardHome from './DashboardHome'
import CourseList from './CourseList'
import TeacherApproval from './TeacherApproval'
import PaymentManagement from './PaymentManagement'
const pages = [
  {
    path: "",
    page: <DashboardHome />,
    buttonText: "Home",
    buttonIcon: <></>,
  },
  {
    path: "/teacher",
    page: <TeacherApproval/>,
    buttonText: "Teacher Approval",
    buttonIcon: <></>,
  },
  {
    path: "/course",
    page: <CourseList/>,
    buttonText: "Course Performance",
    buttonIcon: <></>,
  },
  {
    path: "/payment",
    page: <PaymentManagement/>,
    buttonText: "Payment Management",
    buttonIcon: <></>,
  }
]

export default pages