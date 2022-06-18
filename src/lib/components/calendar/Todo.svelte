<script>
    export let todo;

    import Modal,{getModal} from './Modal.svelte'
    import db from '../../db'
    import deleteTodo from '../../../routes/todo.svelte'
    import editTodo from '../../../routes/todo.svelte'
    import saveTodo from '../../../routes/todo.svelte'

    let functionName = async () => {
        const { data, error } = await db.from('todos').select()
        let todos = data
        console.log(data)
    }

    functionName()
</script>

<li>
    {todo.task}
    <button on:click={()=>getModal('edit').open()}>edit</button>
</li>

<Modal id="edit">
    Edit to do:
    <input bind:value={todo.task} type="text">
    <button>save</button>
    <button>delete</button>
    <button on:click={()=>getModal('edit').close()}>cancel</button>
</Modal>

<style>
    li {
        background-color: var(--cloud);
        margin-top: 20px;
        border-bottom: 5px solid var(--green);
    }
</style>