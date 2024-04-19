<script>
	import main from "./main/main.svelte";
</script>

<svelte:head>
	<title>Main</title>
	<meta name="description" content="dvproject" />
</svelte:head>

<body>
	<div class="welcome">
		<h1>Welcome to your new Supply Chain Dashboard</h1>
	</div>

	<section class="main-content">
		<div class="content-item">Division 1</div>
		<div class="content-item">Division 2</div>
		<div class="content-item">Division 3</div>
		<div class="content-item">Division 4</div>
		<div class="content-item">Division 5</div>
		<div class="content-item">Division 6</div>
	</section>
</body>

<style>
	body {
		margin: 0;
		padding: 0;
	}

	h1 {
		font-size: 24px;
		text-align: left;
		padding: 0;
		margin: 0;
	}

	.welcome {
		text-align: left;
		padding: 1rem;
		margin: 0;
	}

	.main-content {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 100px);
		gap: 1px;
		align-content: center;
		padding: 0;
		margin: 0;
		height: calc(100vh - 2rem); /* Adjust for header and footer */
	}

	.content-item {
		background-color: #f9f9f9;
		padding: 0;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
