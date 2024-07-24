import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import React from 'react';
import { useGetStudentSubjectAbsences } from '@/api/grade';
import SubjectAbsencesView from '@/components/subject-absences-view';

export default function StudentSubjectAbsencesView({
  subjectID
}: {
  subjectID: number;
}) {
  let absences = useGetStudentSubjectAbsences(subjectID);

  if (absences.isPending) {
    return <LoadingView />;
  }

  if (absences.isError) {
    return (
      <ErrorView refetch={absences.refetch} error={absences.error.message} />
    );
  }

  return <SubjectAbsencesView absences={absences} />;
}
