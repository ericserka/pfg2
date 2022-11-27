import { ControlledTextInput } from './ControlledTextInput'
import { Center, IconButton } from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons'
import { forwardRef, useState } from 'react'

export const ControlledPasswordInput = forwardRef(
  ({ control, name, label, onBlur, onSubmitEditing, ...rest }, ref) => {
    const [show, setShow] = useState(false)
    return (
      <ControlledTextInput
        ref={ref}
        control={control}
        name={name}
        label={label}
        onBlur={onBlur}
        InputRightElement={
          <Center>
            <IconButton
              rounded="full"
              onPress={() => setShow((prevShow) => !prevShow)}
              icon={
                <FontAwesome5 size={20} name={show ? 'eye-slash' : 'eye'} />
              }
            />
          </Center>
        }
        type={show ? 'text' : 'password'}
        onSubmitEditing={onSubmitEditing}
        autoComplete="password"
        autoCapitalize="none"
        {...rest}
      />
    )
  }
)
