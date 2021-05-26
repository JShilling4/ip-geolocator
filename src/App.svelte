<script>
	import { onMount } from "svelte";
	import axios from "axios";
	import FontIcon from "svelte-fa";
	import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

	// state
	let ipLat = 0;
	let ipLng = 0;

	// functions
	function getIP() {
		console.log("getting IP...");
		// axios
		// 	.get("https://geo.ipify.org/api/v1?apiKey=at_7BluHqXMgTh0XFpv0H4xunOsHVpCg")
		// 	.then((response) => {
		// 		const { data } = response;
		// 		console.log(data);
		// 		ipLat = data.location.lat;
		// 		ipLng = data.location.lng;
		// 		console.log(ipLat);
		// 		console.log(ipLng);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});

		console.log(ipLat);
		console.log(ipLng);
        ipLat = 40;
        ipLng = 30;
	}

	// mount
	onMount(async () => {
		getIP();
	});
</script>

<main>
	<header>
		<h1>IP Address Tracker</h1>

		<div class="search-wrapper">
			<input type="text" placeholder="Search for any IP address or domain" />
			<button on:click={getIP}>
				<FontIcon icon={faChevronRight} color="#fff" size=".8x" class="searchIcon" />
			</button>
		</div>

		<div class="results-container">
			<div class="resultBox ipAddress" />
			<div class="resultBox location" />
			<div class="resultBox timezone" />
			<div class="resultBox isp" />
		</div>
	</header>

	<div id="map" />
</main>

<style lang="scss">
	header {
		height: 30rem;
		text-align: center;
		background-image: url("/images/pattern-bg.png");
		background-size: cover;
		h1 {
			color: #fff;
			font-size: 4rem;
			font-weight: 400;
			padding: 3rem 0 4rem;
		}
		.search-wrapper {
			position: relative;
			width: 40rem;
			margin: 0 auto;
			input {
				width: 100%;
			}
			button {
				position: absolute;
				right: 0;
				background-color: #000;
				border: none;
				outline: none;
				width: 4.5rem;
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				cursor: pointer;
				:global(.searchIcon) {
					vertical-align: 0 !important;
				}
			}
		}
	}

	#map {
		position: absolute;
		top: 30rem;
		bottom: 0;
		width: 100%;
	}
</style>
