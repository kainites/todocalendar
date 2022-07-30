<script>
    import Modal,{getModal} from './Modal.svelte'
    import db from '../../db'
    
    export let todo;
    export let todos;

    const saveTodo = async (todo) => {
        const { data, error } = await db.from('todos').upsert(todo);
    }

    const deleteTodo = async (id) => {
        const { data, error } = await db.from('todos').delete().eq('id', id);
    }

    const completeTodo = async (todo) => {
        const { data, error } = await db.from('todos').upsert(todo);
        todos[todos.findIndex((t) => (t.id == todo.id))] = {...todo, isCompleted: !todo.isCompleted};
    }
</script>

<li>
    <p class="truncated" class:todoDone={todo.isCompleted} class:todoUndone={!todo.isCompleted}>{todo.task}</p>
</li>

<button on:click={()=>getModal(todo.id).open()}>edit</button>

<Modal id={todo.id}>
    Edit todo:
    <br>
    <input bind:value={todo.task} type="text">
    <button on:click={()=>getModal(todo.id).close(saveTodo(todo))}>save</button>
    <button on:click={()=>getModal(todo.id).close(completeTodo(todo))}>complete</button>
    <br>
    <button on:click={()=>getModal(todo.id).close(deleteTodo(todo.id))}>delete</button>
    <button on:click={()=>getModal(todo.id).close()}>cancel</button>
</Modal>


<style>
    li {
        flex-grow: 1;
        display: flex;
    }

    .truncated {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    p {
        background-color: var(--greenmid);
        border-bottom: 5px solid var(--greenmid);
        width: 100%;
    }

    button {
        position: relative;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        border: none;
        background-color: var(--greenwhite);
        border: 2px solid var(--greenfade);
        font-size: 2vh;
        width: auto;
    }

    .todoDone {
        color: var(--grayheader);
        background-color: var(--greenfade);
        border-bottom: 5px solid var(--greenwhite);
        opacity: 0.75;
    }
    
    .todoUndone {
        color: var(--grayheader);
        background-color: var(--greenwhite);
        border-bottom: 5px solid var(--grayheader);
    }
</style>