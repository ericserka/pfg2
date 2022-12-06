import {
  Button,
  Center,
  CheckIcon,
  FlatList,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  KeyboardAvoidingView,
  Modal,
  Select,
  Text,
  TextArea,
  VStack,
} from 'native-base'
import { useEffect, useRef, useState } from 'react'
import { CreateGroupModal } from './CreateGroupModal'
import { useUserGroup } from '../../../store/groups/provider'
import { COLOR_PRIMARY_600 } from '../../../constants'

export const GroupSelector = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const {
    state: { current, groups },
    actions: { changeSelectedGroup },
  } = useUserGroup()

  return (
    <Center {...props} rounded="full" bg="white">
      <FormControl w="3xs">
        <Select
          rounded="full"
          onValueChange={(value) => {
            if (value === -1) {
              return setModalVisible(true)
            }
            changeSelectedGroup(value)
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
        <CreateGroupModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </FormControl>
    </Center>
  )
}
