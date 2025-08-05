import Course from "../models/Course.js"



// Get All Courses
export const getAllCourse = async (req, res) => {
    try {

        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator', select: '-password' })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Get Course by Id
export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: 'educator' });

    if (!courseData) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Commented out to allow all lecture URLs
    // courseData.courseContent.forEach((chapter) => {
    //   chapter.chapterContent.forEach((lecture) => {
    //     if (!lecture.isPreviewFree) {
    //       lecture.lectureUrl = '';
    //     }
    //   });
    // });

    res.json({ success: true, courseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete Course by Id
export const deleteCourseById = async (req, res) => {
  const { id } = req.params;
  console.log("Deleting course with ID:", id);

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    await course.deleteOne();  // <-- use deleteOne instead of remove()
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const updates = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.courseTitle = updates.courseTitle || course.courseTitle;
    course.courseDescription = updates.courseDescription || course.courseDescription;
    course.coursePrice = updates.coursePrice || course.coursePrice;
    course.discount = updates.discount ?? course.discount;

    await course.save();

    res.status(200).json({ success: true, message: 'Course updated successfully', course });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating course' });
  }
};

export const uploadCoursePdf = async (req, res) => {
  try {
    const courseId = req.params.id;
    const filePath = `/uploads/pdfs/${req.file.filename}`; // path where your file is stored

    const course = await Course.findByIdAndUpdate(
      courseId,
      { coursePdf: filePath },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'PDF uploaded successfully',
      pdfUrl: filePath,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: 'PDF upload failed', error: error.message });
  }
};