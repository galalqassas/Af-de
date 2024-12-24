import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CoursePageBody.module.css';

const CoursePageBody = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/courses/${courseId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setCourse(data))
      .catch(error => console.error('Error fetching course details:', error));

    fetch(`http://localhost:5000/courses/${courseId}/ratings`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setRatings(data))
      .catch(error => console.error('Error fetching course ratings:', error));
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleEnroll = () => {
    if (course && course.course_id) {
      console.log(course);
      navigate(`/checkout/${course.course_id}`);
    } else {
      console.error('Invalid course ID for enrollment');
    }
  };

  return (
    <div className={styles.coursePageContainer}>
      <div className={styles.courseDetailsContainer}>
        <h2 className={styles.courseTitle}>{course.course_name}</h2>
        <div className={styles.imageContainer}>
          <img src={`../../assets/${course.image_url}`} alt={course.course_name} className={styles.courseImage} />
        </div>
        <div className={styles.instructorSection}>
          <img src={`../../assets/${course.teacher_profile_picture}`} alt="Instructor Profile" className={styles.instructorImage} />
          <div className={styles.instructorInfo}>
            <h3>{course.teacher_name || 'Unknown Teacher'}</h3>
            <p>Lead Instructor</p>
          </div>
        </div>  
        <p className={styles.courseDescription}>{course.course_description}</p>

        <h3>Course Outline</h3>
        <ul className={styles.courseOutline}>
          {course.contents.length > 0 ? (
            course.contents.map(content => (
              <li key={content.content_id}>
                <span className={styles.lessonIcon}>📚</span>
                <strong>{content.title}</strong> - <span className={styles.duration}>{content.duration}</span>
              </li>
            ))
          ) : (
            <li>No course content available.</li>
          )}
        </ul>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.courseFeatures}>
          <h3>Course Features</h3>
          <ul>
            <li><strong>Instructor:</strong> {course.teacher_name || 'Unknown'}</li>
            <li><strong>Rating:</strong> {course.average_rating} ({course.rating_count})</li>
            <li><strong>Lectures:</strong> {course.contents.length}</li>
            <li><strong>Course Price:</strong> ${course.price}</li>
          </ul>
          <button className={styles.enrollButton} onClick={handleEnroll}>Enroll Now</button>
        </div>

        <div className={styles.feedbackSection}>
          <h3>Student Feedback</h3>
          {ratings.length > 0 ? (
            ratings.map(rating => (
              <p key={rating.rating_id}>
                <strong>{rating.student_name}:</strong> {rating.comment} 
                <span className={styles.starRating}>{"⭐".repeat(rating.rating)}</span>
              </p>
            ))
          ) : (
            <p>No ratings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePageBody;