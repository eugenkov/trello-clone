import React, {createContext, Dispatch, useContext, useEffect } from 'react';
import { Action } from './actions';
import { appStateReducer, AppState, List, Task } from './appStateReducer';
import { useImmerReducer } from 'use-immer';
import { DragItem } from '../DragItem';
import { save } from '../api';
import { withInitialState } from '../withInitialState';

type AppStateProviderProps = {
    children: React.ReactNode,
    initialState: AppState
}

type AppStateContextProps = {
    lists: List[],
    getTasksByListId(id: string): Task[],
    dispatch: Dispatch<Action>,
    draggedItem: DragItem | null
}

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps);

export const useAppState = () => {
    return useContext(AppStateContext);
}

export const AppStateProvider = withInitialState<AppStateProviderProps>(({
    children,
    initialState
}) => {
    const [state, dispatch] = useImmerReducer(appStateReducer, initialState);
    const { draggedItem, lists } = state;
    const getTasksByListId = (id: string) => {
        return lists.find((list) => list.id === id)?.tasks || []
    }

    useEffect(() => {
        save(state)
    }, [state])

    return (
        <AppStateContext.Provider value={{ lists, draggedItem, getTasksByListId, dispatch }}>
            {children}
        </AppStateContext.Provider>
    )
})
