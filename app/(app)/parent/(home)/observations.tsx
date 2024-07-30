import { ScrollView, View } from 'react-native';
import tw from '@/lib/tailwind';
import { Observation, useGetParentObservations } from '@/api/grade';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { formatShortDate } from '@/lib/utils';
import Caption from '@/components/caption';
import ObservationCard from '@/components/observation-card';

export default function Observations() {
  const observations = useGetParentObservations();

  if (observations.isPending) {
    return <LoadingView />;
  }

  if (observations.isError) {
    return (
      <ErrorView
        refetch={observations.refetch}
        error={observations.error.message}
      />
    );
  }
  const groupedObservations = observations.data.reduce(
    (acc: any, observation) => {
      const day = formatShortDate(observation.timestamp);
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(observation);
      return acc;
    },
    {}
  );

  const groupedObservationsArray = Object.keys(groupedObservations).map(
    (day) => ({
      day,
      observations: groupedObservations[day]
    })
  );

  return (
    <ScrollView
      style={tw`bg-secondary-100 px-4 dark:bg-primary-950`}
      contentContainerStyle={tw`pb-20`}
    >
      {groupedObservationsArray.map((group) => (
        <View key={group.day}>
          <Caption text={group.day} />
          {group.observations.map((observation: Observation) => (
            <ObservationCard
              key={observation.id}
              title={observation.subject.name}
              date={formatShortDate(observation.timestamp)}
              teacher={observation.teacher.name}
              body={observation.reason}
              onPress={() => {}}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
