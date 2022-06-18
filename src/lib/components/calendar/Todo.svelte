<script>
    export let todo;

    import Modal,{getModal} from './Modal.svelte'


</script>

<li>
    {todo.task}
    <button on:click={()=>getModal('edit').open()}>edit</button>
</li>

<Modal id="edit">
    Edit
    <button>save</button>
    <button on:click={()=>getModal('edit').close()}>cancel</button>
</Modal>

<style>
    li {
        background-color: var(--cloud);
        margin-top: 20px;
        border-bottom: 5px solid var(--green);
    }
</style>