<script context="module" lang="ts">
    let onTop;
    const modals={};

    export function getModal(id=''){
		return modals[id]
	}
</script>

<script lang="ts">
    import {onDestroy} from 'svelte';
    
    let topDiv;
    let visible = false;
    let prevOnTop;
    let closeCallback;

    export let id=''

    function keyPress(event){
        if(event.key=="Escape" && onTop==topDiv) close()
    }
    
    function open(callback){
        closeCallback=callback;
        if(visible) return
        prevOnTop=onTop
        onTop=topDiv
    

	document.body.style.overflow="hidden";

    visible = true;

    document.body.appendChild(topDiv);

    }

    function close(returnVal=null){
        if(!visible) return
        onTop = prevOnTop
        if (onTop == null) document.body.style.overflow=""
        if(closeCallback) closeCallback(returnVal)
    }

    modals[id] = {open, close}

    onDestroy(()=>{
	delete modals[id]
    })

</script>
<svelte:window on:keydown={keyPress} />

<div id="topModal" class:visible bind:this={topDiv} on:click={()=>close()}>
    <div id='modal' on:click|stopPropagation={()=>{}}>
        <svg id="close" on:click={()=>close()} viewBox="0 0 12 12">
            <circle cx=6 cy=6 r=6 />
            <line />
            <line />
        </svg>
        <div>
            <slot></slot>
        </div>
    </div>
</div>