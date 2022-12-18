import { useNavigation } from '@react-navigation/native'
import { Center, CheckIcon, FormControl, Select } from 'native-base'
import { COLOR_PRIMARY_600 } from '../../../constants'
import { useUserGroup } from '../../../store/groups/provider'

export const GroupSelector = (props) => {
  const {
    state: { current, groups },
    actions: { changeSelectedGroup },
  } = useUserGroup()
  const { navigate } = useNavigation()

  return (
    <Center {...props} rounded="full" bg="white">
      <FormControl w="3xs">
        <Select
          rounded="full"
          onValueChange={(value) => {
            value === -1 ? navigate('Criar Grupo') : changeSelectedGroup(value)
          }}
          selectedValue={current?.id ?? 0}
          _selectedItem={
            current && {
              bg: 'primary.100',
              endIcon: <CheckIcon size={5} />,
              fontWeight: 'bold',
            }
          }
        >
          <Select.Item
            rounded="lg"
            isDisabled
            key={0}
            label="Selecione um Grupo"
            value={0}
          />
          {groups?.map((g) => (
            <Select.Item rounded="lg" key={g.id} label={g.name} value={g.id} />
          ))}
          <Select.Item
            alignSelf="center"
            w="1/3"
            _text={{ color: 'white' }}
            mt="3"
            rounded="lg"
            bg={COLOR_PRIMARY_600}
            key={-1}
            label="Criar Grupo"
            value={-1}
          />
        </Select>
      </FormControl>
    </Center>
  )
}
