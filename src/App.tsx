import { AppContainer } from './styles';
import { Column } from './Column';
import { AddNewItem } from './AddNewItem';
import { useAppState} from './state/AppStateContext';
import { addList } from "./state/actions";
import { CustomDragLayer } from './CustomDragLayer';

export const App = () => {
    const { lists, dispatch } = useAppState()

    return (
        <AppContainer>
            <CustomDragLayer />
            {lists.map((list) => (
                <Column id={list.id} text={list.text} key={list.id}/>
            ))}
            <AddNewItem
                toggleButtonText='+ Another list'
                onAdd={text => dispatch(addList(text))}
            />
        </AppContainer>
    )
}
