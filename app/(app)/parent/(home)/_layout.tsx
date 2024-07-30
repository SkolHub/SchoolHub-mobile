import { router, Tabs } from 'expo-router';
import HomeHeader from '@/components/home-header';
import { Text, useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';
import tw from '@/lib/tailwind';
import { rgbaToHex } from '@/lib/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { t, Trans } from '@lingui/macro';

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: tw`bg-secondary-100 dark:bg-primary-950 elevation-0 border-t-0 android:h-[70px] android:pb-[15px]`
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: t`Classbook`,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={tw`text-primary-800${focused ? '' : '/60'} dark:text-primary-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
              >
                <Trans>Classbook</Trans>
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            let color = colorScheme === 'light' ? 'primary-800' : 'primary-300';

            if (!focused) {
              color += '/50';
              color = rgbaToHex(tw.color(color) as string);
            } else {
              color = tw.color(color) as string;
            }

            return (
              <SymbolView
                name='chart.bar.fill'
                size={28}
                resizeMode={'scaleAspectFit'}
                tintColor={color}
                fallback={<MaterialIcons name='book' size={24} color={color} />}
              />
            );
          },
          header: () => {
            return (
              <HomeHeader
                text={t`Classbook`}
                onPress={() => {
                  router.push('/modals/account');
                }}
              />
            );
          }
        }}
      />
      <Tabs.Screen
        name='observations'
        options={{
          title: t`Observations`,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={tw`text-primary-800${focused ? '' : '/60'} dark:text-primary-200${focused ? '' : '/60'} text-[10.5px] leading-tight`}
              >
                <Trans>Observations</Trans>
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            let color = colorScheme === 'light' ? 'primary-800' : 'primary-300';

            if (!focused) {
              color += '/50';
              color = rgbaToHex(tw.color(color) as string);
            } else {
              color = tw.color(color) as string;
            }

            return (
              <SymbolView
                name='exclamationmark.circle.fill'
                size={28}
                resizeMode={'scaleAspectFit'}
                tintColor={color}
                fallback={
                  <MaterialIcons name='bar-chart' size={30} color={color} />
                }
              />
            );
          },
          header: () => {
            return (
              <HomeHeader
                text={t`Observations`}
                onPress={() => {
                  router.push('/modals/account');
                }}
              />
            );
          }
        }}
      />
    </Tabs>
  );
}
