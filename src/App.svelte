<script>
	import { onMount } from "svelte";
	import axios from "axios";


    // functions
	function getIP() {
        console.log("getting IP...");
		// axios.get("https://geo.ipify.org/api/v1?apiKey=at_7BluHqXMgTh0XFpv0H4xunOsHVpCg")
        //     .then((response) => {
        //         const { data } = response;
        //         console.log(data);
        //     }).catch(error => {
        //         console.log(error);
        //     });
	}

    // mount
	onMount(async () => {
        getIP();
    });

</script>

<main>
	<header>
        <h1>IP Address Tracker</h1>
    </header>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
        background-image: url("/images/pattern-bg.png");
        background-size: cover;
	}

	h1 {
		color: #fff;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
