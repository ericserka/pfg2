import { Button, Spinner, Text } from 'native-base'

export const CustomButton = ({
  isDisabled,
  loading,
  onPress,
  title,
  ...rest
}) => (
  <Button onPress={onPress} isDisabled={isDisabled} {...rest}>
    {loading ? (
      <Spinner />
    ) : (
      <Text color="white" bold fontSize="lg">
        {title}
      </Text>
    )}
  </Button>
)
