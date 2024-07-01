import { router, Stack, useLocalSearchParams } from 'expo-router';
import GenericHeader from '@/components/generic-header';
import { useOrganizations } from '@/data/organizations';

export default function Layout() {
  const { subject, className, assignment } = useLocalSearchParams();
  const { activeOrganization, organizations, getOrganization } =
    useOrganizations();

  const assignmentData = getOrganization(activeOrganization)
    .classes.find((cls) => cls.name === className)
    ?.subjects.find((sub) => sub.name === subject)
    ?.assignments.find((a) => a.title === assignment);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack>
        <Stack.Screen
          name={'index'}
          options={{
            header: () => (
              <GenericHeader
                text={assignmentData?.title ?? ''}
                onPress={() => {
                  router.back();
                }}
              />
            )
          }}
        />
      </Stack>
    </>
  );
}
