// Type alias для днів тижня
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// Union type для часових слотів
export type TimeSlot = 
    "8:30-10:00" | 
    "10:15-11:45" | 
    "12:15-13:45" | 
    "14:00-15:30" | 
    "15:45-17:15";

// Type alias для типів занять
export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Type alias Professor
export type Professor = {
    id: number;
    name: string;
    department: string;
};

// Type alias Classroom
export type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

// Type alias Course
export type Course = {
    id: number;
    name: string;
    type: CourseType;
};

// Type alias Lesson
export type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Масиви даних
export let professors: Professor[] = [];
export let classrooms: Classroom[] = [];
export let courses: Course[] = [];
export let schedule: Lesson[] = [];

// Функція для додавання нового професора
export function addProfessor(professor: Professor): void {
    professors.push(professor);
}

// Функція для додавання заняття до розкладу
export function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict === null) {
        schedule.push(lesson);
        return true;
    }
    return false;
}

// Функція для пошуку вільних аудиторій
export function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    
    return classrooms
        .filter(classroom => !occupiedClassrooms.includes(classroom.number))
        .map(classroom => classroom.number);
}

// Функція для отримання розкладу конкретного професора
export function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(lesson => lesson.professorId === professorId);
}

// Type alias для конфліктів
export type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// Функція для валідації заняття
export function validateLesson(lesson: Lesson): ScheduleConflict | null {
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
export function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // 5 днів, 5 слотів на день
    const occupiedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (occupiedSlots / totalSlots) * 100;
}

// Функція для визначення найпопулярнішого типу занять
export function getMostPopularCourseType(): CourseType {
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
export function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
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
export function cancelLesson(lessonId: number): void {
    schedule = schedule.filter(lesson => lesson.courseId !== lessonId);
}

export function resetProfessors(): void{
    professors=[];
}
