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
// @ts-nocheck

    import Flatpickr from 'svelte-flatpickr';
    import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/themes/light.css';
    import { uuid } from '$lib/utils';

    let newtodo = {isCompleted: false, isEditing: false, task: '', date: null, id: uuid()};
    export let todos = [];
    $:console.log(todos);
    let value, formattedValue;

    let addTodo = async () => {
        let modifiedtodo = {...newtodo, date: newtodo.date != '' ? flatpickr.formatDate(new Date(newtodo.date), 'Z'): null};
        const { data, error } = await db.from('todos').upsert(modifiedtodo);
        todos = [...todos, newtodo];
        newtodo = {isCompleted: false, isEditing: false, task: '', date: null, id: uuid()};
        
        console.log("🚀 ~ file: todo.svelte ~ line 20 ~ addTodo ~ data", data)
        console.log("🚀 ~ file: todo.svelte ~ line 20 ~ addTodo ~ error", error)
    };

    let deleteTodo = async (id) => {
        todos = todos.filter((t) => t.id != id);
        const { data, error } = await db.from('todos').delete().eq('id', id);
    }

    function editTodo(todo) {
        todos[todos.findIndex((t) => (t.id == todo.id))] = {...todo, isEditing: !todo.isEditing};
        console.log(todo)
    }

    let saveTodo = async (todo) => {
        const { data, error } = await db.from('todos').upsert(todo);
        todos[todos.findIndex((t) => (t.id == todo.id))] = {...todo, isEditing: !todo.isEditing};
    }

    const options = {
        altInput: true,
        altFormat: "d/m/Y",
        dateFormat: "Y-m-d",
	}

</script>

<h2>to do</h2>

<div id="newtodo">
    <input bind:value={newtodo.task} type="text" placeholder="input your to do here">
    <Flatpickr {options} bind:value={newtodo.date} bind:formattedValue name="date" />
    <button on:click={addTodo} type="submit">add to do</button>
</div>

<ul>
    {#each todos.sort((a,b) => new Date(a.date) - new Date(b.date)) || [] as todo}
        {#if todo.date}
            <li>
                <input type="checkbox">
                {#if todo.isEditing}
                    <input bind:value={todo.task} type="text" placeholder={todo.task}>
                    <Flatpickr {options} bind:value={todo.date} bind:formattedValue name="date" />
                    <button on:click={() => saveTodo(todo)}>save</button>
                {:else}
                    <span>{todo.task}</span>
                    <span>{todo.date == null ? '' : flatpickr.formatDate(new Date(todo.date), "d/m/Y")}</span>
                    <button on:click={() => editTodo(todo)}>edit</button>
                {/if}
                <button on:click={() => deleteTodo(todo.id)} type="submit">delete</button>
            </li>  
        {/if}
    {/each}

    {#each todos.sort((a,b) => new Date(a.date) - new Date(b.date)) || [] as todo}
        {#if !todo.date}
            <li>
                <input type="checkbox">
                {#if todo.isEditing}
                    <input bind:value={todo.task} type="text" placeholder={todo.task}>
                    <Flatpickr {options} bind:value={todo.date} bind:formattedValue name="date" />
                    <button on:click={() => saveTodo(todo)}>save</button>
                {:else}
                    <span>{todo.task}</span>
                    <span>{todo.date == null ? '' : flatpickr.formatDate(new Date(todo.date), "d/m/Y")}</span>
                    <button on:click={() => editTodo(todo)}>edit</button>
                {/if}
                <button on:click={() => deleteTodo(todo.id)} type="submit">delete</button>
            </li>  
        {/if}
    {/each}
</ul>
