import { Grade } from '@/api/grade';
import { formatShortDate } from '@/lib/utils';
import tw from '@/lib/tailwind';
import {
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import Caption from '@/components/caption';
import StatsSummaryView from '@/components/stats-summary-view';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import { t } from '@lingui/macro';

export default function SubjectGradesView({
  grades
}: {
  grades: {
    data: Grade[];
    isError: boolean;
    isPending: boolean;
    refetch: () => void;
  };
}) {
  const dimensions = useWindowDimensions();

  grades.data = grades.data.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let gradesNum = 0;
  let average = 0;

  grades.data?.forEach((grade) => {
    gradesNum++;
    average += +grade.value;
  });

  average = average / gradesNum;

  let chartData = {
    labels: grades.data
      .map((grade) => formatShortDate(grade.date).slice(0, -5))
      .reverse(),
    datasets: [
      {
        data: grades.data.map((grade) => +grade.value).reverse(),
        color: (opacity = 1) =>
          tw.prefixMatch('dark')
            ? tw.color('secondary-500') ?? ''
            : tw.color('secondary-600') ?? ''
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
          refreshing={grades.isPending}
          onRefresh={grades.refetch}
        />
      }
    >
      <View style={tw`rounded-3xl bg-neutral-50 py-4 dark:bg-neutral-700`}>
        <LineChart
          data={chartData}
          width={dimensions.width - 60}
          height={220}
          chartConfig={chartConfig}
          fromZero={true}
          withShadow={false}
          withVerticalLines={false}
          segments={10}
          formatYLabel={(value) => (+value).toString()}
          verticalLabelRotation={30}
        />
      </View>
      <Caption text={t`Grades`} />
      <StatsSummaryView
        data={[
          { label: t`overall average`, value: average.toFixed(2).toString() },
          { label: t`grades`, value: gradesNum.toString() }
        ]}
        style={'mb-6'}
      />
      <List>
        {grades.data?.map((grade, index) => (
          <ListItem
            shouldPress={false}
            leftComponent={
              <View
                style={tw`shrink grow flex-col items-start justify-between`}
              >
                <Text
                  style={tw`text-lg font-bold leading-tight text-primary-800 dark:text-primary-50`}
                >
                  {grade.value}
                </Text>
                {grade?.reason ? (
                  <Text
                    style={tw`shrink text-sm font-bold leading-tight text-primary-500 dark:text-primary-300`}
                  >
                    {grade.reason}
                  </Text>
                ) : null}
              </View>
            }
            rightComponent={
              <View
                style={tw`grow basis-2/5 flex-col items-end justify-between`}
              >
                <Text
                  style={tw`text-base font-bold leading-tight text-primary-500 dark:text-primary-300`}
                >
                  {formatShortDate(grade.date)}
                </Text>
                <Text
                  style={tw`text-right text-sm font-bold leading-tight text-primary-500 dark:text-primary-300`}
                >
                  {grade.teacher.name}
                </Text>
              </View>
            }
            text={grade.value}
            key={index}
          />
        ))}
      </List>
    </ScrollView>
  );
}
