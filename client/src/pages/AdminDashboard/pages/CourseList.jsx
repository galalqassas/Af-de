import { BarChart,PieChart} from "@mui/x-charts";
import { useEffect, useState } from "react";
import Card from "../components/Card";

const ratingReducer = (course, rating) => course.reviews.reduce(
  (p, c) => (p + (c.rating === rating ? 1 : 0)), 0)

const CourseList = () => {
  const [displayedCourse, setDisplayedCourse] = useState(null);
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');  // Updated fetch URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Courses data received:', data);
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
      }
    };
  
    fetchCourses();
  }, []);

  if (error) {
    return <div className="text-red-500">Error loading courses: {error}</div>;
  }

  const difficulties = ["Easy", "Medium", "Hard", "Expert"];

  return (
    <div className="flex flex-col gap-3 h-full">
      {
        displayedCourse &&
        <>
          <button
            className="w-max"
            onClick={() => setDisplayedCourse(null)}
          >
            Back
          </button>
          <div>
            <p className="font-semibold text-xl mb-3">Course Performance</p>
            <h1>
              {displayedCourse.courseName}
            </h1>
            <p className="text-2xl">
              {displayedCourse.teacher}
            </p>
          </div>
          <div className="grid grid-cols-[auto,auto] gap-10">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2">
                <h2 className="border-b pb-1">Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Currently Enrolled</p>
                    <p>{displayedCourse.currentEnrollmentCount} student(s)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Previously Enrolled</p>
                    <p>{displayedCourse.dropCount + displayedCourse.passCount} student(s)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Avg. days to complete</p>
                    <p>{displayedCourse.hoursToComplete} day(s)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Total number of assessments</p>
                    <p>{displayedCourse.numAssessments} assessment(s)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Difficulty</p>
                    <p>{difficulties[displayedCourse.difficulty - 1]}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="border-b pb-1">Pass-to-Enrolled ratio</h2>
                <div className="h-52">
                <PieChart
                    series={[{
                      data: [
                        { value: displayedCourse.passCount, label: "Pass", color: '#7C4DFF' },
                        { value: displayedCourse.dropCount, label: "Still Enrolled", color: '#d1d5db' },
                      ],
                      cornerRadius: 8,
                      innerRadius: 42,
                    }]}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-max">
              <div className="flex flex-col gap-2">
                <h2 className="border-b pb-1">Rating</h2>
                <div className="h-52">
                  <BarChart
                    layout="horizontal"
                    xAxis={[{ label: "Count" }]}
                    yAxis={[{ scaleType: "band", data: ['Stars'] }]}
                    series={[
                      { data: [ratingReducer(displayedCourse, 1)], label: "1 star", color: '#d1d5db' },
                      { data: [ratingReducer(displayedCourse, 2)], label: "2 stars", color: '#bca4fc' },
                      { data: [ratingReducer(displayedCourse, 3)], label: "3 stars", color: "#a07efc" },
                      { data: [ratingReducer(displayedCourse, 4)], label: "4 stars", color: '#8d65fc' },
                      { data: [ratingReducer(displayedCourse, 5)], label: "5 stars", color: '#7C4DFF' },
                    ]}
                    width={500}
                  />
                </div>
              </div>
              <div className="flex flex-col h-64 gap-2">
                <h2 className="border-b pb-1">Reviews</h2>
                <div className="w-full overflow-y-scroll flex flex-col gap-2 p-2">
                  {
                    displayedCourse.reviews.map(review => (
                      <Card key={review.studentName} className="w-full flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">{review.studentName}</p>
                          <div className="flex gap-1">
                            {
                              Array(5)
                              .fill((<div className="w-2 h-2 bg-primary-1 rounded-full"></div>), 0, review.rating)
                              .fill((<div className="w-2 h-2 bg-gray-300 rounded-full"></div>), review.rating, 5)
                            }
                          </div>
                        </div>
                        <p>{review.body}</p>
                      </Card>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {
        !displayedCourse &&
        <>
          <h1>Courses</h1>
          {
            !courses && "Loading..."
          }
          {
            courses &&
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Course Description</th>
                  <th>Total Enrollment Count</th>
                  <th>Teacher</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {
                  courses.map(course => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.courseName}</td>
                      <td>{course.courseDescription}</td>
                      <td>{
                        course.currentEnrollmentCount +
                        course.passCount +
                        course.dropCount
                      }</td>
                      <td>{course.teacher}</td>
                      <td>
                        <button
                          className="underline text-primary-2"
                          onClick={() => setDisplayedCourse(course)}
                        >
                          View performance
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          }
        </>
      }
    </div >
  );
}

export default CourseList;