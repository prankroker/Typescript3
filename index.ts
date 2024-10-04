// Type alias для днів тижня
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// Union type для часових слотів
type TimeSlot = 
    "8:30-10:00" | 
    "10:15-11:45" | 
    "12:15-13:45" | 
    "14:00-15:30" | 
    "15:45-17:15";

// Type alias для типів занять
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Type alias Professor
type Professor = {
    id: number;
    name: string;
    department: string;
};

// Type alias Classroom
type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

// Type alias Course
type Course = {
    id: number;
    name: string;
    type: CourseType;
};

// Type alias Lesson
type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Масиви даних
let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

// Функція для додавання нового професора
function addProfessor(professor: Professor): void {
    professors.push(professor);
}

// Функція для додавання заняття до розкладу
function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict === null) {
        schedule.push(lesson);
        return true;
    }
    return false;
}

// Функція для пошуку вільних аудиторій
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    
    return classrooms
        .filter(classroom => !occupiedClassrooms.includes(classroom.number))
        .map(classroom => classroom.number);
}

// Функція для отримання розкладу конкретного професора
function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(lesson => lesson.professorId === professorId);
}

// Type alias для конфліктів
type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// Функція для валідації заняття
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const professorConflict = schedule.find(
        l => l.professorId === lesson.professorId && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
    );
    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }

    const classroomConflict = schedule.find(
        l => l.classroomNumber === lesson.classroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
    );
    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }

    return null;
}

// Функція для визначення використання аудиторії
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // 5 днів, 5 слотів на день
    const occupiedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (occupiedSlots / totalSlots) * 100;
}

// Функція для визначення найпопулярнішого типу занять
function getMostPopularCourseType(): CourseType {
    const courseTypeCount: Record<CourseType, number> = {
        "Lecture": 0,
        "Seminar": 0,
        "Lab": 0,
        "Practice": 0
    };

    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            courseTypeCount[course.type]++;
        }
    });

    return Object.keys(courseTypeCount).reduce((a, b) => 
        courseTypeCount[a as CourseType] > courseTypeCount[b as CourseType] ? a : b
    ) as CourseType;
}

// Функція для зміни аудиторії
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find(l => l.courseId === lessonId);
    if (lesson) {
        const conflict = schedule.find(
            l => l.classroomNumber === newClassroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
        );
        if (!conflict) {
            lesson.classroomNumber = newClassroomNumber;
            return true;
        }
    }
    return false;
}

// Функція для скасування заняття
function cancelLesson(lessonId: number): void {
    schedule = schedule.filter(lesson => lesson.courseId !== lessonId);
}