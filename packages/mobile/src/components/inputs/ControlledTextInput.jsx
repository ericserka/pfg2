import { Input, FormControl } from 'native-base'
import { useController } from 'react-hook-form'

export const ControlledTextInput = ({
  control,
  name,
  isRequired,
  errorMessage,
  label,
  trigger,
  ...rest
}) => {
  const { field } = useController({
    control,
    name,
  })
  return (
    <FormControl isRequired={isRequired} isInvalid={errorMessage}>
      <FormControl.Label _text={{ bold: true }}>{label}</FormControl.Label>
      <Input
        {...rest}
        onBlur={() => trigger(name)}
        value={field.value}
        onChangeText={field.onChange}
      />
      <FormControl.ErrorMessage>
        {errorMessage === 'Required' ? 'Obrigatório' : errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
