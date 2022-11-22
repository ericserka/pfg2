import { FormControl, Select, WarningOutlineIcon } from 'native-base'
import { Controller } from 'react-hook-form'

export const ControlledSelectInput = ({
  control,
  name,
  isRequired = true,
  label,
  placeholder,
  helperText,
  trigger,
  width = 'xs',
  items,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <FormControl w={width} isRequired={isRequired} isInvalid={error?.message}>
        <FormControl.Label _text={{ bold: true }}>{label}</FormControl.Label>
        <Select
          placeholder={placeholder}
          onValueChange={(value) => {
            onChange(value)
            trigger(name)
          }}
          selectedValue={value}
          onClose={() => trigger(name)}
          _selectedItem={{
            bg: 'primary.100',
          }}
        >
          {items.map((item) => (
            <Select.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Select>
        <FormControl.HelperText>{helperText}</FormControl.HelperText>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {error?.message === 'Required' ? 'Obrigatório' : error?.message}
        </FormControl.ErrorMessage>
      </FormControl>
    )}
  />
)
