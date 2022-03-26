<script context="module">
    import db from '$lib/db'

    export async function load(){
    const { data, error } = await db.from('todos').select()
    console.log(data)
    console.log(error)
    return {props:{todos:data}}
    }
</script>

<script>
    import Flatpickr from 'svelte-flatpickr';
    import flatpickr from 'flatpickr';
    import { uuid } from '$lib/utils';
    let newtodo = {isCompleted: false, isEditing: false, task: '', date: '', id: uuid()};
    export let todos;

    let addTodo = async () => {
        let modifiedtodo = {...newtodo, date: newtodo.date != '' ? flatpickr.formatDate(new Date(newtodo.date), 'Z'): null};
        const { data, error } = await db.from('todos').insert(modifiedtodo);
        todos = [...todos, newtodo];
        newtodo = {isCompleted: false, isEditing: false, task: '', date: '', id: uuid()};
        
        console.log("🚀 ~ file: todo.svelte ~ line 20 ~ addTodo ~ data", data)
        console.log("🚀 ~ file: todo.svelte ~ line 20 ~ addTodo ~ error", error)
    };

    function deleteTodo(id) {
        todos = todos.filter((t) => t.id != id);
    }

    function editTodo(todo) {
        todos[todos.findIndex((t) => (t.id == todo.id))]= {...todo, isEditing: !todo.isEditing};
    }
</script>

<h2>to do</h2>

<div id=newtodo>
    <input bind:value={newtodo.task} type="text" placeholder="input your to do here">
    <input bind:value={newtodo.date} type="date" placeholder="due date of to do">
    <button on:click={addTodo} type="submit">add to do</button>
</div>

<ul>
    {#each todos as todo}
        <li>
            <input type="checkbox">
            {#if todo.isEditing}
                 <input bind:value={todo.task} type="text" placeholder={todo.task}>
                 <input bind:value={todo.date} type="date" placeholder={todo.date}>
                 <button on:click={() => editTodo(todo)}>save</button>
            {:else}
                 <span>{todo.task}</span>
                 <span>{todo.date}</span>
                 <button on:click={() => editTodo(todo)}>edit</button>
            {/if}
            <button on:click={() => deleteTodo(todo.id)} type="submit">delete</button>
        </li>  
    {/each}
</ul>
