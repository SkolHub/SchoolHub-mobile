import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import React from 'react';
import { useGetParentSubjectAbsences } from '@/api/grade';
import SubjectAbsencesView from '@/components/subject-absences-view';

export default function ParentSubjectAbsencesView({
  subjectID
}: {
  subjectID: number;
}) {
  let absences = useGetParentSubjectAbsences(subjectID.toString());

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
