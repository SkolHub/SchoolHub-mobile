import { Subject } from '@/api/subject';
import api from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import { Absence, Grade } from '@/api/grade';

export interface SchoolClass {
  id: number;
  name: string;
  classMasterID: number;
  organizationID: number;
  subject: {
    schoolClassID: number;
    subjectID: number;
    subject: Subject;
  }[];
  students: {
    studentID: number;
    schoolClassID: number;
    student: {
      id: number;
      name: string;
    };
  }[];
}

export interface SchoolClassStudentSubject {
  id: number;
  name: string;
  icon: string;
  metadata: Record<any, any>;
  teachers: {
    id: number;
    name: string;
  }[];
  grades: Grade[];
  absences: Absence[];
}

const fetchSchoolClass = async (id: string) => {
  return api
    .get(`/school-class/class-master/${id}`)
    .then((res) => res.data as SchoolClass);
};

const fetchSchoolClassStudent = async ({
  schoolClassID,
  studentID
}: {
  schoolClassID: number;
  studentID: number;
}) => {
  return api
    .get(
      `/school-class/class-master/school-class/${schoolClassID}/student/${studentID}`
    )
    .then((res) => res.data as SchoolClassStudentSubject[]);
};

export const useGetSchoolClass = (id: string) => {
  return useQuery({
    queryKey: ['school-class', id],
    queryFn: () => fetchSchoolClass(id)
  });
};

export const useGetSchoolClassStudent = ({
  schoolClassID,
  studentID
}: {
  schoolClassID: number;
  studentID: number;
}) => {
  return useQuery({
    queryKey: ['school-class-student', schoolClassID, studentID],
    queryFn: () => fetchSchoolClassStudent({ schoolClassID, studentID })
  });
};
