import { useRef } from 'react';
import { AddNewItem } from './AddNewItem';
import { addTask, moveTask, moveList, setDraggedItem } from './state/actions';
import { ColumnContainer, ColumnTitle} from './styles';
import { Card} from './Card';
import { isHidden } from './utils/isHidden';
import { useAppState} from './state/AppStateContext';
import { useItemDrag } from './utils/useItemDrag';
import { useDrop } from 'react-dnd';

type ColumnProps = {
    text: string,
    id: string,
    isPreview?: boolean
}

export const Column = ({ text, id, isPreview }: ColumnProps) => {
    const { draggedItem, getTasksByListId, dispatch } = useAppState();
    const tasks = getTasksByListId(id)
    const ref = useRef<HTMLDivElement>(null)

    const [ , drop ] = useDrop({
        accept: ['COLUMN', 'CARD'],
        hover() {
            if (!draggedItem) {
                return;
            }
            if (draggedItem.type === 'COLUMN') {
                if (draggedItem.id === id) {
                    return;
                }

                dispatch(moveList(draggedItem.id, id));
            } else {
                if (draggedItem.columnId === id) {
                    return
                }
                if (tasks.length) {
                    return
                }

                dispatch(moveTask(draggedItem.id, null, draggedItem.columnId, id))
                dispatch(setDraggedItem({ ...draggedItem, columnId: id }))
            }
        }
    })

    const { drag } = useItemDrag({ type: 'COLUMN', id, text })
    drag(drop(ref))

    return (
        <ColumnContainer
            isPreview={isPreview}
            ref={ref}
            isHidden={isHidden(draggedItem, 'COLUMN', id, isPreview)}
        >
            <ColumnTitle>{text}</ColumnTitle>
            {tasks.map((task) => (
                <Card
                    text={task.text}
                    key={task.id}
                    id={task.id}
                    columnId={id}
                />
            ))}
            <AddNewItem
                onAdd={text => dispatch(addTask(text, id)) }
                toggleButtonText='+ Add another task'
                dark
            />
        </ColumnContainer>
    )
}
