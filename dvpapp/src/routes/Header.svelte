<!-- Header.svelte -->
<script>
	import { page } from "$app/stores";
	import logo from "$lib/images/uhasselt-standaard.png";
	import github from "$lib/images/github.svg";
</script>

<header id="main-header">
	<div class="banner">
		<div class="corner" id="photo-right">
			<a
				href="https://www.uhasselt.be/en?gad_source=5&gclid=EAIaIQobChMIvoycxtPEhQMV_5ZQBh1YkANzEAAYASAAEgKSJPD_BwE"
			>
				<img src={logo} alt="UHasselt" />
			</a>
		</div>
		<div class="text-box">
			<p class="title"><strong>Suncharge Supply Chain</strong></p>
			<p class="subtitle">Monitoring System</p>
		</div>
		<div class="corner" id="photo-left">
			<a href="https://github.com/MwauraPatrick/Data-Visualization-Project">
				<img src={github} alt="GitHub" />
			</a>
		</div>
	</div>
</header>

<nav>
	<svg viewBox="0 0 2 3" aria-hidden="true">
		<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
	</svg>
	<ul>
		<li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
			<a href="/">Main</a>
		</li>
		<li aria-current={$page.url.pathname === "/about" ? "page" : undefined}>
			<a href="/about">About</a>
		</li>
		<li
			aria-current={$page.url.pathname.startsWith("/groupinfo")
				? "page"
				: undefined}
		>
			<a href="/groupinfo">Group Info</a>
		</li>
	</ul>
	<svg viewBox="0 0 2 3" aria-hidden="false">
		<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
	</svg>
</nav>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 1100;
		background-color: rgb(000, 255, 230);
		padding: 0 1rem;
	}

	.banner {
		display: flex;
		align-items: center;
		flex-grow: 1;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 3em;
		height: 3em;
		object-fit: contain;
	}

	.text-box {
		text-align: center;
		flex-grow: 1;
		padding: 0 1rem;
	}

	.title {
		font-size: 1.5rem;
		margin: 0;
	}

	.subtitle {
		font-size: 1rem;
		margin: 0;
	}

	nav {
		display: flex;
		justify-content: center;
		background-color: rgb(000, 000, 000);
		padding: 0rem 1rem;
		position: sticky;
		z-index: 1000;
		top: 20px;
	}

	svg {
		width: 0.5em;
		height: 2em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		padding: 0;
		margin: 0;
		display: flex;
		list-style: none;
	}

	li {
		margin: 0 0.5rem;
		position: relative;
	}

	li[aria-current="page"]::before {
		content: "";
		width: 100%;
		height: 2px;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: var(--color-theme-1);
	}

	nav a {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		color: white;
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
