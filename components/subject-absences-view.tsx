import tw from '@/lib/tailwind';
import {
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Caption from '@/components/caption';
import StatsSummaryView from '@/components/stats-summary-view';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { formatShortDate } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Absence } from '@/api/grade';
import { t, Trans } from '@lingui/macro';

export default function SubjectAbsencesView({
  absences
}: {
  absences: {
    data: Absence[];
    isError: boolean;
    isPending: boolean;
    refetch: () => void;
  };
}) {
  const dimensions = useWindowDimensions();

  absences.data = absences.data.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let absencesNum = 0,
    unexcusedAbsencesNum = 0;

  absences.data?.forEach((absence) => {
    absencesNum++;
    if (!absence.excused) {
      unexcusedAbsencesNum++;
    }
  });

  let absencesPerMonth: number[] = [];
  for (let i = 0; i < 12; i++) {
    absencesPerMonth[i] = 0;
  }
  absences.data?.forEach((absence) => {
    absencesPerMonth[new Date(absence.date).getMonth()]++;
  });

  let x = absencesPerMonth.splice(0, 6);
  absencesPerMonth = absencesPerMonth.concat(x);
  absencesPerMonth = absencesPerMonth.splice(2, 10);

  let chartData = {
    labels: [
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun'
    ],
    datasets: [
      {
        data: absencesPerMonth,
        color: (opacity = 1) =>
          tw.prefixMatch('dark')
            ? tw.color('red-400') ?? ''
            : tw.color('red-500') ?? ''
      }
    ]
  };
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) =>
      tw.prefixMatch('dark')
        ? tw.color('primary-50/70') ?? ''
        : tw.color('primary-800/70') ?? '',
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <ScrollView
      style={tw`flex-1 bg-transparent`}
      contentContainerStyle={tw`pb-12`}
      refreshControl={
        <RefreshControl
          refreshing={absences.isPending}
          onRefresh={absences.refetch}
        />
      }
    >
      <View style={tw`rounded-3xl bg-neutral-50 py-4 pl-4 dark:bg-neutral-700`}>
        <BarChart
          yAxisLabel={''}
          yAxisSuffix={''}
          data={chartData}
          width={dimensions.width - 60}
          height={200}
          chartConfig={chartConfig}
          fromZero={true}
          showValuesOnTopOfBars={true}
        />
      </View>
      <Caption text={t`Absences`} />
      <StatsSummaryView
        data={[
          { label: t`absences`, value: absencesNum.toString() },
          {
            label: t`unexcused absences`,
            value: unexcusedAbsencesNum.toString()
          }
        ]}
        style={'mb-6'}
      />
      <List>
        {absences.data?.map((item) => (
          <ListItem
            shouldPress={false}
            leftComponent={
              <View>
                <Text
                  style={tw`text-base font-bold leading-tight text-primary-800 dark:text-primary-50`}
                >
                  {formatShortDate(item.date)}
                </Text>
                <Text
                  style={tw`text-sm font-bold leading-tight text-primary-500 dark:text-primary-300`}
                >
                  {item.reason}
                </Text>
              </View>
            }
            rightComponent={
              <View style={tw`flex-1`}>
                {item.excused ? (
                  <View style={tw`flex-row items-center justify-end gap-1`}>
                    <Ionicons
                      name={'checkmark-circle'}
                      size={18}
                      color={
                        tw.prefixMatch('dark')
                          ? tw.color('green-400')
                          : tw.color('green-500')
                      }
                    />
                    <Text
                      style={tw`text-sm font-bold leading-tight text-green-500 dark:text-green-400`}
                    >
                      <Trans>Excused</Trans>
                    </Text>
                  </View>
                ) : (
                  <View style={tw`flex-row items-center justify-end gap-1`}>
                    <Ionicons
                      name={'close-circle'}
                      size={18}
                      color={
                        tw.prefixMatch('dark')
                          ? tw.color('red-400')
                          : tw.color('red-500')
                      }
                    />
                    <Text
                      style={tw`text-sm font-bold leading-tight text-red-500 dark:text-red-400`}
                    >
                      <Trans>Unexcused</Trans>
                    </Text>
                  </View>
                )}
                <Text
                  style={tw`text-right text-sm font-bold leading-tight text-primary-500 dark:text-primary-300`}
                >
                  {item.teacher.name}
                </Text>
              </View>
            }
            text={''}
            key={item.id}
          />
        ))}
      </List>
    </ScrollView>
  );
}
