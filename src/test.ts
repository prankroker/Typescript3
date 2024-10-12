import {
    addProfessor,
    addLesson,
    findAvailableClassrooms,
    getProfessorSchedule,
    validateLesson,
    getClassroomUtilization,
    getMostPopularCourseType,
    reassignClassroom,
    cancelLesson,
    Professor,
    Classroom,
    Course,
    Lesson,
    DayOfWeek,
    TimeSlot,
    CourseType,
    professors,
    resetProfessors
} from './index';

describe('Schedule Management System', () => {
    const professor: Professor = { id: 1, name: 'Linus', department: 'Computer Science' };

    beforeEach(() => {
        resetProfessors();

        // Add sample data
        addProfessor(professor);
    });

    test('should add a professor', () => {
        expect(professors.length).toBe(1);
        expect(professors[0]).toEqual(professor);
    });
});