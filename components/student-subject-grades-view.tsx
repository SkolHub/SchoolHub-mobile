import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import React from 'react';
import { useGetStudentSubjectGrades } from '@/api/grade';
import SubjectGradesView from '@/components/subject-grades-view';

export default function StudentSubjectGradesView({
  subjectID
}: {
  subjectID: number;
}) {
  const grades = useGetStudentSubjectGrades(subjectID);

  if (grades.isPending) {
    return <LoadingView />;
  }

  if (grades.isError) {
    return <ErrorView refetch={grades.refetch} error={grades.error.message} />;
  }

  return <SubjectGradesView grades={grades} />;
}
