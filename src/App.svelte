<script>
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import axios from "axios";
	import FontIcon from "svelte-fa";
	import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
	import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

	// constants
	const fadeUpIn = { y: 30, duration: 500 };

	// state
	let map;
	let locationMarker;
	let ipData = {
		ip: "",
		isp: "",
		name: "",
		location: {
			city: "",
			country: "",
			lat: 39.8,
			lng: -89.5,
			postalCode: "",
			region: "",
			timezone: "",
		},
	};
	let searchInput = null;
	let dataIsLoading = false;

	// functions
	async function getIP() {
		// console.log("getting IP...");
		enterLoading();
		let domain = searchInput == null ? "" : `&domain=${searchInput}`;
		try {
			const response = await axios.get(`https://geo.ipify.org/api/v1?apiKey=${JSON.parse(__myapp.env.API_KEY_IPIFY)}${domain}`);
			const { data } = response;
			ipData = { ...data };
			dataIsLoading = false;
			updateMapView();
			searchInput = null;
			return response;
		} catch (error) {
			console.log(error);
			searchInput = null;
		}
	}

	function updateMapView() {
		// console.log("updating map view...");
		const { lng, lat } = ipData.location;
		map.flyTo({ center: [lng, lat], zoom: 7.5 });
		locationMarker.setLngLat([lng, lat]);
	}

	function initMap() {
		// console.log("initializing map...");
		const { lng, lat } = ipData.location;
		mapboxgl.accessToken = JSON.parse(__myapp.env.API_KEY_MAPBOX);
		map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			zoom: 3,
		});
		locationMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
	}

	function enterLoading() {
		const { lng, lat } = ipData.location;
		dataIsLoading = true;
		map.flyTo({ center: [lng, lat], zoom: 3 });
	}

	function onKeyPress(e) {
		if (e.charCode === 13) {
			getIP();
		}
	}

	// mount
	onMount(async () => {
		initMap();
		getIP();
	});
</script>

<main>
	<header>
		<h1>IP Address Locator</h1>
		<div class="search-wrapper">
			<input type="text" placeholder="Search for IP address by domain" bind:value={searchInput} on:keypress={onKeyPress} />
			<button on:click={getIP}>
				<FontIcon icon={faChevronRight} color="#fff" size=".8x" class="searchIcon" />
			</button>
		</div>
		<div class="results-container">
			<div class="resultBox ipAddress">
				<h2 class="heading">IP Address</h2>
				{#if ipData.ip != "" && !dataIsLoading}
					<p class="value" transition:fly={fadeUpIn}>
						{ipData.ip}
					</p>
				{:else}
					<p class="value">--</p>
				{/if}
			</div>
			<div class="resultBox location">
				<h2 class="heading">Location</h2>
				{#if ipData.location.city != "" && !dataIsLoading}
					<p class="value" transition:fly={fadeUpIn}>
						{ipData.location.city}{#if ipData.location.city !== ""},{/if}
						{ipData.location.region}
					</p>
				{:else}
					<p class="value">--</p>
				{/if}
			</div>
			<div class="resultBox timezone">
				<h2 class="heading">Timezone</h2>
				{#if ipData.location.timezone != "" && !dataIsLoading}
					<p class="value" transition:fly={fadeUpIn}>
						{#if ipData.location.timezone !== ""}UTC{/if}
						{ipData.location.timezone}
					</p>
				{:else}
					<p class="value">--</p>
				{/if}
			</div>
			<div class="resultBox isp">
				<h2 class="heading">ISP</h2>
				{#if ipData.isp != "" && !dataIsLoading}
					<p class="value" transition:fly={fadeUpIn}>
						{ipData.isp}
					</p>
				{:else}
					<p class="value">--</p>
				{/if}
			</div>
		</div>
	</header>
	<div id="map" />
</main>

<style lang="scss">
	header {
		height: 30rem;
		padding: 0 2rem;
		text-align: center;
		background-image: url("/images/pattern-bg.png");
		background-size: cover;
		@include breakpoint(tablet-small) {
			height: 40rem;
		}
		h1 {
			color: #fff;
			font-size: 4rem;
			font-weight: 400;
			padding: 3rem 0 4rem;
			@include breakpoint(phone) {
				font-size: 3rem;
			}
		}
		.search-wrapper {
			position: relative;
			width: 40rem;
			margin: 0 auto;
			@include breakpoint(phone) {
				width: 100%;
			}
			input {
				width: 100%;
				@include breakpoint(phone-small) {
					font-size: 1.4rem;
				}
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

	.results-container {
		position: absolute;
		top: 20rem;
		left: 50%;
		width: 80%;
		transform: translateX(-50%);
		z-index: 100;
		display: flex;
		padding: 4rem;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.3);
		@include breakpoint(laptop) {
			width: 95%;
		}
		@include breakpoint(tablet-small) {
			flex-wrap: wrap;
			padding: 2rem;
		}
		@include breakpoint(phone) {
			top: 18rem;
		}
		.resultBox {
			margin: 0 3rem;
			width: 25%;
			@include breakpoint(tablet-small) {
				width: 100%;
				margin: 0;
			}
			&:not(:last-child) {
				@include breakpoint(tablet-small) {
					margin-bottom: 2rem;
				}
			}
			.heading {
				margin-bottom: 1rem;
				font-weight: 300;
				color: rgb(141, 138, 138);
				@include breakpoint(tablet) {
					font-size: 1.8rem;
				}
				@include breakpoint(tablet-small) {
					margin-bottom: 0.5rem;
				}
			}
			.value {
				font-size: 2.6rem;
				font-weight: 600;
				@include breakpoint(tablet) {
					font-size: 2rem;
				}
			}
		}
	}

	#map {
		position: absolute;
		top: 30rem;
		bottom: 0;
		width: 100%;
		@include breakpoint(tablet-small) {
			top: 40rem;
		}
	}
</style>
