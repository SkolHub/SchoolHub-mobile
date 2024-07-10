import { Redirect } from 'expo-router';
import { useGetAccountRole } from '@/api/account';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';

export default function Index() {
  const account = useGetAccountRole();

  if (account.isPending) {
    return <LoadingView />;
  }

  if (account.isError) {
    return (
      <ErrorView refetch={account.refetch} error={account.error.message} />
    );
  }

  console.log(account.data);

  if (account.data === 'student') {
    return <Redirect href='/student' />;
  }
  if (account.data === 'teacher') {
    return <Redirect href='/teacher' />;
  }
  if (account.data === 'admin') {
    return <Redirect href='/admin' />;
  }
  if (account.data === 'parent') {
    return <Redirect href='/parent' />;
  }
  return <Redirect href={`/student`} />;
}
