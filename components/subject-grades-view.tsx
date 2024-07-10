import {
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { useGetStudentSubjectGradesAbsences } from '@/api/grade';
import LoadingView from '@/components/loading-view';
import ErrorView from '@/components/error-view';
import { formatShortDate } from '@/lib/utils';
import tw from '@/lib/tailwind';
import { LineChart } from 'react-native-chart-kit';
import Caption from '@/components/caption';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import React from 'react';

export default function SubjectGradesView({
  subjectID
}: {
  subjectID: number;
}) {
  const dimensions = useWindowDimensions();

  const gradesAndAbsences = useGetStudentSubjectGradesAbsences(subjectID);

  if (gradesAndAbsences.isPending) {
    return <LoadingView />;
  }

  if (gradesAndAbsences.isError) {
    return (
      <ErrorView
        refetch={gradesAndAbsences.refetch}
        error={gradesAndAbsences.error.message}
      />
    );
  }

  gradesAndAbsences.data.grades = gradesAndAbsences.data.grades.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let gradesNum = 0;
  let average = 0;

  gradesAndAbsences.data?.grades.forEach((grade) => {
    gradesNum++;
    average += +grade.value;
  });

  average = average / gradesNum;

  let chartData = {
    labels: gradesAndAbsences.data.grades
      .map((grade) => formatShortDate(grade.date).slice(0, -5))
      .reverse(),
    datasets: [
      {
        data: gradesAndAbsences.data.grades
          .map((grade) => +grade.value)
          .reverse(),
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
          refreshing={gradesAndAbsences.isPending}
          onRefresh={gradesAndAbsences.refetch}
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
      <Caption text='Grades' />
      <View style={tw`mb-6 rounded-3xl bg-neutral-50 p-4 dark:bg-neutral-700`}>
        <View style={tw`flex-row justify-between`}>
          <View
            style={tw`flex-1 items-stretch border-r border-black/15 px-4 dark:border-white/20`}
          >
            <Text
              style={tw`text-center text-xl font-bold text-primary-800 dark:text-primary-50`}
            >
              {gradesNum > 0 ? average.toFixed(2) : 'No grades'}
            </Text>
            <Text
              style={tw`text-center text-sm font-semibold text-primary-700 dark:text-primary-200`}
            >
              overall average
            </Text>
          </View>
          <View style={tw`flex-1 items-stretch pl-4`}>
            <Text
              style={tw`text-center text-xl font-bold text-primary-800 dark:text-primary-50`}
            >
              {gradesNum}
            </Text>
            <Text
              style={tw`text-center text-sm font-semibold text-primary-700 dark:text-primary-200`}
            >
              {gradesNum === 1 ? 'grade' : 'grades'}
            </Text>
          </View>
        </View>
      </View>
      <List>
        {gradesAndAbsences.data?.grades.map((grade, index) => (
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
                    style={tw`shrink text-base font-bold leading-tight text-primary-500 dark:text-primary-300`}
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
                  style={tw`text-right text-base font-bold leading-tight text-primary-500 dark:text-primary-300`}
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
