import { Button, Text, Spinner } from 'native-base'

export const CustomButton = ({ isDisabled, loading, onPress, title }) => (
  <Button onPress={onPress} isDisabled={isDisabled}>
    {loading ? (
      <Spinner />
    ) : (
      <Text color="white" fontSize="lg">
        {title}
      </Text>
    )}
  </Button>
)
