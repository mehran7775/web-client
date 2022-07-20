import { ref, reactive, toRefs } from '#app'
import { AutoCompleteItem } from '@/types'

export const useAutoComplete = (options: Array<AutoCompleteItem>) => {
    const state = reactive({
        userInput: "" as string,
        loading: false as boolean,
        // filteredSuggestions: [] as,
        suggestions: options,
        selectedItems: [] as AutoCompleteItem[]
    });

    const select = (item: AutoCompleteItem) => {
        const index = state.selectedItems.find((itm) => itm.id === item.id)
        if( !index ) state.selectedItems.push({...item})
    }

    const deselect = (item: AutoCompleteItem) => { 
        const index = state.selectedItems.findIndex(itm => itm.id === item.id )
        if(index > -1) state.selectedItems.splice(index, 1)
    }

    return {
        state,
        select,
        deselect
    };
};

