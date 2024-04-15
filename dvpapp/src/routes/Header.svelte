<script>
	import { page } from "$app/stores";
	import logo from "$lib/images/uhasselt-standaard.png";
	import github from "$lib/images/github.svg";
</script>

<header>
	<div class="corner" id="photo-right">
		<a
			href="https://www.uhasselt.be/en?gad_source=5&gclid=EAIaIQobChMIvoycxtPEhQMV_5ZQBh1YkANzEAAYASAAEgKSJPD_BwE"
		>
			<img src={logo} alt="UHasselt" />
		</a>
	</div>

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

	<div class="corner" id="photo-left">
		<a href="https://github.com/MwauraPatrick/Data-Visualization-Project">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		position: sticky;
		top: 0;
		z-index: 1000; /* Ensure the header is above other content */
		background-color: rgb(202, 216, 228); /* Background color for the header */
		/* Add other styles as needed */
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

	#photo-left {
		padding-right: 50px;
	}
	#photo-right {
		padding-left: 50px;
	}

	nav {
		display: flex;
		justify-content: left;
		--background: rgb(174, 189, 61);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current="page"]::before {
		--size: 6px;
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
