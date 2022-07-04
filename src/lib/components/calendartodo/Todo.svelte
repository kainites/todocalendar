<script>
    import Modal,{getModal} from './Modal.svelte'
    import db from '../../db'

    import Flatpickr from 'svelte-flatpickr';
    import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/themes/light.css';
    
    export let todo;

    const saveTodo = async (todo) => {
        const { data, error } = await db.from('todos').upsert(todo);
    }

    const deleteTodo = async (id) => {
        const { data, error } = await db.from('todos').delete().eq('id', id);
        console.log(data)
        console.log(error)
    }
</script>

<li>
    <p class="truncated">{todo.task}</p>
</li>
<button on:click={()=>getModal(todo.id).open()}>edit</button>

<Modal id={todo.id}>
    Edit todo:
    <br>
    <input bind:value={todo.task} type="text">
    <button on:click={()=>getModal(todo.id).close(saveTodo(todo))}>save</button>
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
        background-color: var(--cloud);
        border-bottom: 5px solid var(--green);
        width: 100%;
    }

    button {
        position: relative;
    }
</style>