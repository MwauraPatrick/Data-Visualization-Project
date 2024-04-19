<script>
	import Counter from "./main/main.svelte";
	import welcome from "$lib/images/suncharge.jpg";
	import welcome_fallback from "$lib/images/suncharge.jpg";
</script>

<svelte:head>
	<title>Main</title>
	<meta name="description" content="dvproject" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/jpg" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		Welcome to your new <br />Supply Chain Dashboard
	</h1>

	<main />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 500 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 150px;
		top: 0;
		display: block;
	}
</style>
