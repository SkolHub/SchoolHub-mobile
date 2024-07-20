import * as DropdownMenu from 'zeego/dropdown-menu';
import React from 'react';

export default function GeneralDropdown({
  items,
  trigger,
  triggerWidth
}: {
  trigger: React.ReactElement;
  triggerWidth?: number;
  items: Array<{
    title: string;
    icon?: string;
    onPress: () => void;
  }>;
}) {
  return (
    <DropdownMenu.Root style={{ width: triggerWidth }}>
      <DropdownMenu.Trigger
        style={{ width: triggerWidth, alignItems: 'center' }}
      >
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          {items.map((item, index) => (
            <DropdownMenu.Item key={index.toString()} onSelect={item.onPress}>
              <DropdownMenu.ItemTitle children={item.title} />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
