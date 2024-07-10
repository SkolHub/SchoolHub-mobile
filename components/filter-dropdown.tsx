import React from 'react';
import * as DropdownMenu from 'zeego/dropdown-menu';
import tw from '@/lib/tailwind';
import SmallButton from '@/components/small-button';

export default function FilterDropdown({
  filter,
  setFilter
}: {
  filter: string[];
  setFilter: (filter: string[]) => void;
}) {
  const colorScheme = tw.prefixMatch('dark') ? 'dark' : 'light';

  return (
    <DropdownMenu.Root style={{ width: 50 }}>
      <DropdownMenu.Trigger style={{ width: 50, alignItems: 'center' }}>
        <SmallButton
          text={''}
          iconName={'filter-outline'}
          onPress={() => {
            // setShownPosts(
            //   posts.data.filter((p) => p.type === 'assignment')
            // );
          }}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.CheckboxItem
            value={filter.includes('announcement') ? 'on' : 'off'}
            key={'announcement'}
            onValueChange={(state) => {
              if (state === 'on') {
                setFilter([...filter, 'announcement']);
              } else {
                setFilter(filter.filter((f) => f !== 'announcement'));
              }
            }}
          >
            <DropdownMenu.ItemIndicator />
            <DropdownMenu.ItemTitle children={'Announcements'} />
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            value={filter.includes('material') ? 'on' : 'off'}
            key={'material'}
            onValueChange={(state) => {
              if (state === 'on') {
                setFilter([...filter, 'material']);
              } else {
                setFilter(filter.filter((f) => f !== 'material'));
              }
            }}
          >
            <DropdownMenu.ItemIndicator />
            <DropdownMenu.ItemTitle children={'Materials'} />
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            value={filter.includes('test') ? 'on' : 'off'}
            key={'test'}
            onValueChange={(state) => {
              if (state === 'on') {
                setFilter([...filter, 'test']);
              } else {
                setFilter(filter.filter((f) => f !== 'test'));
              }
            }}
          >
            <DropdownMenu.ItemIndicator />
            <DropdownMenu.ItemTitle children={'Tests'} />
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            value={filter.includes('assignment') ? 'on' : 'off'}
            key={'assignment'}
            onValueChange={(state) => {
              if (state === 'on') {
                setFilter([...filter, 'assignment']);
              } else {
                setFilter(filter.filter((f) => f !== 'assignment'));
              }
            }}
          >
            <DropdownMenu.ItemIndicator />
            <DropdownMenu.ItemTitle children={'Assignments'} />
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
