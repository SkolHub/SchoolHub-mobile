import { KeyboardType, Text, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';
import React from 'react';
import { cn } from '@/lib/utils';
import tw from '@/lib/tailwind';

const FormInput = ({
  control,
  name,
  placeholder,
  secureTextEntry,
  inputAccessoryViewID,
  errorText,
  contentType,
  flex1,
  helperText,
  defaultValue = '',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  displayName,
  shouldError = true,
  inModal = false,
  keyboardType = 'default'
}: {
  control: any;
  name: string;
  placeholder: string;
  secureTextEntry: boolean;
  inputAccessoryViewID: string;
  errorText: string;
  contentType: string;
  flex1: boolean;
  helperText?: string;
  defaultValue?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  displayName?: string;
  shouldError?: boolean;
  inModal?: boolean;
  keyboardType?: KeyboardType;
}) => {
  return (
    <View style={tw.style(`w-full`, flex1 ? `flex-1` : ``)}>
      <Controller
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error }
        }) => {
          return (
            <View>
              {!!displayName && (
                <Text
                  style={tw`pl-3 text-base font-medium text-black dark:text-white`}
                >
                  {displayName}
                </Text>
              )}
              <TextInput
                style={tw.style(
                  'h-14 w-full rounded-2xl bg-white px-3 text-lg leading-tight text-black dark:bg-neutral-700 dark:text-white',
                  shouldError && !!error && 'border border-red-500',
                  !editable && 'text-neutral-500 dark:text-neutral-400',
                  inModal && 'bg-background-50 dark:bg-background-800',
                  multiline && 'h-40'
                )}
                defaultValue={defaultValue}
                placeholder={placeholder}
                inputAccessoryViewID={inputAccessoryViewID}
                textContentType={contentType as any}
                onBlur={onBlur}
                onChangeText={(text) => onChange(text)}
                value={value}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
                placeholderTextColor={'rgb(160, 160, 160)'}
                keyboardType={keyboardType}
              />
              {shouldError && (
                <Text
                  style={tw.style(error ? `my-1 ml-2 text-red-500` : `hidden`)}
                >
                  {error ? errorText : ''}
                </Text>
              )}
              {!!helperText && (
                <Text style={tw`ml-2 text-xs text-gray-500`}>{helperText}</Text>
              )}
            </View>
          );
        }}
        name={name}
        control={control}
      />
    </View>
  );
};

export default FormInput;
