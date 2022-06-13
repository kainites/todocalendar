<script>
    export let todo;

    import Modal,{getModal} from './Modal.svelte';
    
</script>

<li>
    {todo.task}
</li>

<style>
    li {
        background-color: var(--cloud);
        margin-top: 20px;
        border-bottom: 5px solid var(--green);
    }
</style>