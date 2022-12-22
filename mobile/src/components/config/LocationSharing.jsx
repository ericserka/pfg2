import { Flex, ScrollView, Switch, Text } from 'native-base'
import { useState } from 'react'
import {
  countValueInObject,
  updateAllValuesFromObj,
} from '../../helpers/snippets'
import { useUserGroup } from '../../store/groups/provider'

export const LocationSharing = () => {
  const {
    state: { groups, groupsThatLocationIsShared, mutationLoading },
    actions: { alterGroupLocationSharing, shareLocationWithAllGroups },
  } = useUserGroup()
  const [state, setState] = useState(
    groups.reduce(
      (acc, cur, idx) => ({
        ...acc,
        [idx]: groupsThatLocationIsShared.some((gl) => gl.id === cur.id),
      }),
      { all: groups.length === groupsThatLocationIsShared.length }
    )
  )
  return (
    <ScrollView m="3">
      <Flex direction="row" justify="space-between" align="center" m="2">
        <Text fontSize="lg" bold>
          Todos
        </Text>
        <Switch
          size="lg"
          isChecked={state['all']}
          onToggle={(value) => {
            if (value) {
              countValueInObject(state, true) < groups.length &&
                shareLocationWithAllGroups()
              setState((prevState) => updateAllValuesFromObj(prevState, value))
            } else {
              setState((prevState) => ({ ...prevState, all: value }))
            }
          }}
          isDisabled={mutationLoading}
        />
      </Flex>
      {groups.map((g, i) => (
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          m="2"
          key={i}
        >
          <Text fontSize="lg" opacity={state['all'] ? 10 : 100} bold>
            {g.name}
          </Text>
          <Switch
            size="lg"
            isChecked={state[i]}
            onToggle={(value) => {
              setState((prevState) => ({ ...prevState, [i]: value }))
              alterGroupLocationSharing(g.id, value)
            }}
            isDisabled={state['all'] || mutationLoading}
          />
        </Flex>
      ))}
    </ScrollView>
  )
}
