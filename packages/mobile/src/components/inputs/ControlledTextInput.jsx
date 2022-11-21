import { FormControl, Input, WarningOutlineIcon } from 'native-base'
import { forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { TextInputMask } from 'react-native-masked-text'

export const ControlledTextInput = forwardRef(
  (
    {
      control,
      name,
      isRequired = true,
      label,
      placeholder,
      helperText,
      onBlur,
      InputRightElement,
      masked = false,
      mask,
      width = 'xs',
      ...rest
    },
    ref
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl
          w={width}
          isRequired={isRequired}
          isInvalid={error?.message}
        >
          <FormControl.Label _text={{ bold: true }}>{label}</FormControl.Label>
          {masked ? (
            <TextInputMask
              type="custom"
              options={{ mask }}
              value={value}
              onChangeText={onChange}
              customTextInput={Input}
              customTextInputProps={{
                ...rest,
                ref,
                onBlur,
                InputRightElement,
                placeholder: placeholder ?? label,
              }}
            />
          ) : (
            <Input
              {...rest}
              ref={ref}
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              InputRightElement={InputRightElement}
              placeholder={placeholder ?? label}
            />
          )}
          <FormControl.HelperText>{helperText}</FormControl.HelperText>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {error?.message === 'Required' ? 'Obrigatório' : error?.message}
          </FormControl.ErrorMessage>
        </FormControl>
      )}
    />
  )
)
