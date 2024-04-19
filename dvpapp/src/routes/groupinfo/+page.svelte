<script>
	import { page } from '$app/stores';
</script>

<div class="container">
	<p><strong>Data visualization class of 2024</strong></p>
	<p><strong>Group Number 35</strong></p>
	<p>Data set: Suncharge</p>

	<ul class="student-list">
		<li>
			<p>Student 1: <strong>Sariga Kakkamani</strong></p>
			<p>Student ID: 2364698</p>
			<p>Institution: Hasselt University</p>
		</li>
		<li>
			<p>Student 2: <strong>Simon Bayou Bizuneh</strong></p>
			<p>Student ID: 2364704</p>
			<p>Institution: Hasselt University</p>
		</li>
		<li>
			<p>Student 3: <strong>Waweru Mwaura</strong></p>
			<p>Student ID: 2364796</p>
			<p>Institution: Hasselt University</p>
		</li>
	</ul>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center; 
		justify-content: center; 
		min-height: 100vh; 
	}

	.student-list {
		display: flex;
		flex-direction: row; 
		justify-content: center;
		list-style-type: none; 
		padding: 0; 
	}

	.student-list li {
		margin: 0 1rem; 
		text-align: center; 
	}
</style>
